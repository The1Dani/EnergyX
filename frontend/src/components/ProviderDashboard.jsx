import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./ProviderDashboard.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProviderDashboard = ({ setCurrentPage }) => {
  const [region, setRegion] = useState("Chișinău");

  const regions = ["Chișinău", "Bălți", "Cahul", "Orhei", "Ungheni", "Hîncești"];

  const data = {
    labels: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")),
    datasets: [
      {
        label: `${region} Consumption (MW)`,
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 200) + 50),
        borderColor: "#004aad",
        backgroundColor: "rgba(0, 74, 173, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Hourly Consumption" },
    },
    scales: {
      y: { title: { display: true, text: "MW" } },
      x: { title: { display: true, text: "Hour" } },
    },
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Dashboard</h2>

      {/* 2×2 grid of cards */}
      <div className="dashboard-grid">
        {/* Interactive Map card → navigates to SearchPage */}
        <div
          className="card dashboard-card clickable"
          onClick={() => setCurrentPage("search")}
        >
          <i className="bi bi-map display-6 text-primary"></i>
          <h5>Interactive Map</h5>
          <p className="text-muted">Click to view localities</p>
        </div>

        <div className="card dashboard-card">
          <i className="bi bi-lightning-charge display-6 text-warning"></i>
          <h5>Current Usage</h5>
          <p className="fw-bold">245 MW</p>
        </div>

        <div className="card dashboard-card">
          <i className="bi bi-house display-6 text-success"></i>
          <h5>Smart Meters</h5>
          <p className="fw-bold">12,458</p>
        </div>

        <div className="card dashboard-card">
          <i className="bi bi-diagram-3 display-6 text-danger"></i>
          <h5>Grid Balance</h5>
          <p className="fw-bold">Stable</p>
        </div>
      </div>

      {/* Dropdown + chart */}
      <div className="mt-5">
        <label className="form-label fw-bold">Select Region</label>
        <select
          className="form-select mb-3"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <div className="chart-container">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
