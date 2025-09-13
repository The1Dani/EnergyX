import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function gaussian(x, mean, sigma = 3) {
  // Gaussian distribution formula
  return Math.exp(-0.5 * Math.pow((x - mean) / sigma, 2));
}

function TariffCalculator() {
  const [hour, setHour] = useState(18); // default peak at 18:00
  const previousCost = 1200;

  // generate values for 0-24 hours
  const labels = Array.from({ length: 25 }, (_, i) => i.toString().padStart(2, "0"));
  const values = labels.map((h) => gaussian(parseInt(h), hour));

  // normalize to MW scale (0–100 for nicer graph)
  const maxVal = Math.max(...values);
  const scaledValues = values.map((v) => (v / maxVal) * 100);

  // current cost formula: decreases with distance from 17:00
  const currentCost = Math.max(300, previousCost - Math.abs(hour - 17) * 50);

  const data = {
    labels,
    datasets: [
      {
        label: `Consumption distribution (peak at ${hour}:00)`,
        data: scaledValues,
        borderColor: "#004aad",
        backgroundColor: "rgba(0, 74, 173, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
    },
    scales: {
      y: {
        title: { display: true, text: "MW" },
        beginAtZero: true,
      },
      x: {
        title: { display: true, text: "Hour (00–24)" },
      },
    },
  };

  return (
    <div className="tariff-container">
      <h2 className="tariff-title">Tariff Calculator</h2>

      <div className="chart-box">
        <Line data={data} options={options} />
      </div>

      <div className="slider-box">
        <label htmlFor="hourRange">Select hour: {hour}:00</label>
        <input
          id="hourRange"
          type="range"
          min="0"
          max="24"
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
        />
      </div>

      <div className="cost-box">
        <p>
          <strong>Previous Cost:</strong> {previousCost} MDL
        </p>
        <p>
          <strong>Current Cost:</strong> {currentCost} MDL
        </p>
      </div>
    </div>
  );
}

export default TariffCalculator;
