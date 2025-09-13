import React, { useState, useEffect } from "react";
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
import { Line } from "react-chartjs-2";
import "./ProviderDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProviderDashboard = ({ setCurrentPage }) => {
  const [region, setRegion] = useState("Chișinău");
  const [consumptionData, setConsumptionData] = useState([]);
  const [loading, setLoading] = useState(true);

  const regions = [
    "Bălți",
    "Cahul",
    "Chișinău",
    "Comrat",
    "Cricova",
    "Edineț",
    "Florești",
    "Hîncești",
    "Orhei",
    "Rezina",
    "Soroca",
    "Ștefan Vodă",
    "Tiraspol",
    "Ungheni",
    "Vadul lui Vodă",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // assumes backend API returns something like:
        // { hours: ["00","01","02",...], consumption: [120, 135, ...] }
        const response = await fetch(`http://localhost:5000/region/${region}`);
        const result = await response.json();

        setConsumptionData(result.consumption || []);
      } catch (error) {
        console.error("Error fetching region data:", error);
        setConsumptionData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [region]);

  const labels = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const data = {
    labels,
    datasets: [
      {
        label: `${region} Consumption (MW)`,
        data: consumptionData.length > 0 ? consumptionData : Array(24).fill(0),
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
      y: { title: { display: true, text: "MW" }, beginAtZero: true },
      x: { title: { display: true, text: "Hour" } },
    },
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Dashboard</h2>

      <div className="dashboard-grid">
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
          <p className="fw-bold">
            {consumptionData.length > 0
              ? `${consumptionData[consumptionData.length - 1]} MW`
              : "N/A"}
          </p>
        </div>

        <div className="card dashboard-card">
          <i className="bi bi-house display-6 text-success"></i>
          <h5>Smart Meters</h5>
          <p className="fw-bold">12,458</p>
        </div>

        <div className="card dashboard-card">
          <i className="bi bi-diagram-3 display-6 text-danger"></i>
          <h5>Grid Balance</h5>
          <p className="fw-bold">
            {consumptionData.length > 0 ? "Stable" : "Unknown"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <label className="form-label fw-bold">Select Region</label>
        <select
          className="form-select mb-3"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <div className="chart-container">
          {loading ? <p>Loading data...</p> : <Line data={data} options={options} />}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
