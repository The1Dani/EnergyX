import React, { useState, useEffect } from "react";
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
  const [userId] = useState(() => localStorage.getItem("userId") || null); // ia ID-ul salvat
  const [consumptionData, setConsumptionData] = useState({
    Yesterday: [],
    Today: [],
    Tomorrow: [],
  });

  const hours = Array.from({ length: 25 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.warn("No userId found in localStorage.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/id/${userId}`);
        const result = await response.json();
        console.log("Fetched consumption data:", result);

        // Asum că backend-ul întoarce:
        // { yesterday: [...], today: [...], tomorrow: [...] }
        setConsumptionData({
          Yesterday: result.yesterday || [],
          Today: result.today || [],
          Tomorrow: result.tomorrow || [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]); // refetch dacă userId se schimbă

  const data = {
    labels: hours,
    datasets: [
      {
        label: `Consumption (${day})`,
        data: consumptionData[day],
        borderColor: "#134675",
        backgroundColor: "rgba(19, 70, 117, 0.3)",
        tension: 0.3,
        pointRadius: 3,
        borderDash: day === "Tomorrow" ? [6, 6] : [],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        {consumptionData[day].length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>

      <p className="description">
        This chart shows the amount of electricity consumed every hour in{" "}
        <b>megawatts (MW)</b>. The horizontal axis represents the hours of the
        day (00–24), while the vertical axis shows the energy demand in MW.
      </p>
    </div>
  );
};

export default HourlyConsumption;
