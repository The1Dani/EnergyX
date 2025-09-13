import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "./TariffCalculator.css";
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
  return Math.exp(-0.5 * Math.pow((x - mean) / sigma, 2));
}

function TariffCalculator() {
  const [hour, setHour] = useState(18); 
  const previousCost = 1200;

  const labels = Array.from({ length: 25 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const values = labels.map((h) => gaussian(parseInt(h), hour));

  const maxVal = Math.max(...values);
  const scaledValues = values.map((v) => (v / maxVal) * 100);

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
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { display: true },
      title: { display: false },
    },
    scales: {
      y: {
        title: { display: true, text: "MW (scaled)" },
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

      <div className="chart-box chart-container">
        <Line data={data} options={options} />
      </div>

      <div className="slider-box">
        <label htmlFor="hourRange" className="fw-bold">
          Select peak hour: {hour}:00
        </label>
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
          <strong>Estimated Current Cost:</strong> {currentCost} MDL
        </p>
      </div>

      <div className="description-box">
        <h4>How to read this chart</h4>
        <p>
          The blue curve represents electricity consumption during the day, 
          with the highest point showing the selected peak hour. 
          By moving the slider, you can shift the peak to see how 
          changing consumption patterns affect your estimated cost. 
          When the peak hour moves closer to <b>17:00</b>, 
          your cost decreases. If the peak is further away, 
          the cost increases, reflecting higher energy demand during off-peak times.
        </p>
      </div>
    </div>
  );
}

export default TariffCalculator;
