import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./HourlyConsumption.css";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const HourlyConsumption = () => {
  const [day, setDay] = useState("Today");

  const hours = Array.from({ length: 25 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));

  // Example dummy data (MW values)
  const datasets = {
    Yesterday: Array.from({ length: 25 }, () => Math.floor(Math.random() * 50) + 20),
    Today: Array.from({ length: 25 }, () => Math.floor(Math.random() * 50) + 30),
    Tomorrow: Array.from({ length: 25 }, () => Math.floor(Math.random() * 50) + 25),
  };

  const data = {
    labels: hours,
    datasets: [
      {
        label: `Consumption (${day})`,
        data: datasets[day],
        borderColor: "#134675",
        backgroundColor: "rgba(19, 70, 117, 0.3)",
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: `Hourly Consumption - ${day}` },
    },
    scales: {
      y: {
        title: { display: true, text: "MW" },
        beginAtZero: true,
      },
      x: {
        title: { display: true, text: "Hour (00 - 24)" },
      },
    },
  };

  return (
    <div className="hourly-page">
      <h1>Hourly Consumption</h1>
      <div className="button-group">
        <button
          className={day === "Yesterday" ? "active" : ""}
          onClick={() => setDay("Yesterday")}
        >
          Yesterday
        </button>
        <button
          className={day === "Today" ? "active" : ""}
          onClick={() => setDay("Today")}
        >
          Today
        </button>
        <button
          className={day === "Tomorrow" ? "active" : ""}
          onClick={() => setDay("Tomorrow")}
        >
          Tomorrow
        </button>
      </div>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default HourlyConsumption;
