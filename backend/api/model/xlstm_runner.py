import torch
import numpy as np
import xlstm
from xlstm.xlstm_large.model import xLSTMLargeConfig, xLSTMLarge

# @title 7) Load PRETRAINED xLSTMLarge (native kernels, logits-only; no Triton)

try:
    from xlstm.xlstm_large.model import xLSTMLargeConfig, xLSTMLarge
except Exception as e:
    raise RuntimeError("Failed to import xlstm.xlstm_large. Ensure the package is available.") from e

V = 2048

# ==== path to your saved weights (raw state_dict or full checkpoint) ====
CKPT_PATH = "/opt/data/model_data/xLSTMweights.pth"  # <-- updated to local file path    

# Base dims (used if the checkpoint doesn't include cfg)
EMBED_DIM  = 512
NUM_HEADS  = 4
NUM_BLOCKS = 6

# We’ll align VOCAB_SIZE with the checkpoint if possible; fall back to current V
VOCAB_SIZE = V  # must match your tokenizer (will be overwritten if ckpt has it)

def _extract_state_dict(ckpt_obj):
    """Return a state_dict from various common checkpoint layouts."""
    if isinstance(ckpt_obj, dict):
        # Full checkpoint formats
        for key in ("model", "state_dict", "model_state", "model_state_dict"):
            if key in ckpt_obj and isinstance(ckpt_obj[key], dict):
                return ckpt_obj[key]
        # Raw state_dict (all tensor values)
        if all(isinstance(v, torch.Tensor) for v in ckpt_obj.values()):
            return ckpt_obj
    raise RuntimeError("Could not find a state_dict in the checkpoint file.")

def _make_cfg_native(vocab_size: int, saved_cfg: dict | None = None):
    sc = saved_cfg or {}
    return xLSTMLargeConfig(
        embedding_dim   = int(sc.get("embedding_dim", EMBED_DIM)),
        num_heads       = int(sc.get("num_heads", NUM_HEADS)),
        num_blocks      = int(sc.get("num_blocks", NUM_BLOCKS)),
        vocab_size      = int(sc.get("vocab_size", vocab_size)),
        return_last_states=False,      # logits only
        mode="inference",              # dropout off; still trainable
        chunkwise_kernel="chunkwise--native_autograd",
        sequence_kernel ="native_sequence__native",
        step_kernel     ="native",
    )

# --- load checkpoint from disk ---
ckpt = torch.load(CKPT_PATH, map_location="cpu")

# If checkpoint has quant/cfg, use them to align vocab/dims
saved_cfg = ckpt.get("cfg", {}) if isinstance(ckpt, dict) else {}
if isinstance(ckpt, dict) and isinstance(ckpt.get("quant"), dict) and "V" in ckpt["quant"]:
    V = int(ckpt["quant"]["V"])       # keep your tokenizer/quantizer consistent
    VOCAB_SIZE = V
elif isinstance(saved_cfg, dict) and "vocab_size" in saved_cfg:
    VOCAB_SIZE = int(saved_cfg["vocab_size"])

# Build model with **native** kernels only (no Triton)
cfg   = _make_cfg_native(VOCAB_SIZE, saved_cfg)
model = xLSTMLarge(cfg).to("cpu")

# Load weights
state_dict = _extract_state_dict(ckpt)
missing, unexpected = model.load_state_dict(state_dict, strict=False)
if missing or unexpected:
    print(f"load_state_dict: missing={len(missing)} unexpected={len(unexpected)}")
    if missing:    print("  missing:",    missing[:10],    "..." if len(missing) > 10    else "")
    if unexpected: print("  unexpected:", unexpected[:10], "..." if len(unexpected) > 10 else "")

model.eval()

def predict_energy(model_class, state_dict_path, mode=0, device="cpu"):
    """
    Predict energy usage for 24 hours or 7 days (hourly).
    
    Args:
        model_class: The model class (not instance).
        state_dict_path: Path to the saved state_dict file.
        mode (int): 0 for 24-hour prediction, 1 for 7-day (168 hours).
        device (str): "cpu" or "cuda".
    
    Returns:
        np.ndarray: Array of predicted values (len=24 or 168).
    """
    # build model
    model = model_class().to(device)
    model.load_state_dict(torch.load(state_dict_path, map_location=device))
    model.eval()

    # choose output length
    output_len = 24 if mode == 0 else 7 * 24
    
    # dummy input if your model requires sequence input
    # (adjust this according to your training setup)
    x = torch.zeros((1, 1, model.input_size), device=device)  

    preds = []
    with torch.no_grad():
        for _ in range(output_len):
            y = model(x)   # forward pass
            val = y.squeeze().item()
            preds.append(val)

            # update input if autoregressive
            x = y.unsqueeze(0).unsqueeze(0)

    return np.array(preds)


# Quick eval of the integer sequence 0..24
def m_eval(week:bool=False):
    import torch

    # Use the model's device just in case
    device = next(model.parameters()).device

    # (1, 25) batch with tokens 0..24
    if not week:
        seq = torch.arange(0, 25, dtype=torch.long, device=device).unsqueeze(0)
    else:
        seq = torch.arange(0, 24*7+1, dtype=torch.long, device=device).unsqueeze(0)
        
    model.eval()
    with torch.no_grad():
        out = model(seq)                         # (1, 25, V) or tuple
        logits = out[0] if isinstance(out, (tuple, list)) else out

        # Next-token distribution AFTER seeing the whole context 0..24
        last_logits = logits[0, -1]              # (V,)
        probs = torch.softmax(last_logits, dim=-1)
        next_id = int(probs.argmax().item())

        topk = torch.topk(probs, k=5)

        # Optional: per-position argmax (prediction for token t+1 at each position t)
        per_pos_pred = logits.argmax(dim=-1).squeeze(0).tolist()
        # print("Per-position next-token argmax (len=25):")
        #per_pos_pred /= 10
        return list(map(lambda x: x/10, per_pos_pred))


if __name__ == "__main__":

    print("Returned", m_eval(week=True))
    print("Returned", m_eval(week=True))
