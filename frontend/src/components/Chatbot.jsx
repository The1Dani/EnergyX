import React, { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m your energy assistant ⚡ How can I help?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    const userMsg = { from: "user", text: input };
    const botMsg = { from: "bot", text: "Here’s a recommendation based on your usage 🔋" };
    setMessages([...messages, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      <button className="chat-icon" onClick={() => setOpen(!open)}>
        💬
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <h5 className="chat-title">Energy Assistant</h5>
           
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="send-btn" onClick={handleSend}>
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
