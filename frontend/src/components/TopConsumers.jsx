import React, { useEffect, useState } from "react";
import "./DashboardandConsumers.css";

const TopConsumers = () => {
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsumers = async () => {
      try {
        // Example: backend returns something like:
        // [
        //   { "region": "Chișinău", "value": 245 },
        //   { "region": "Bălți", "value": 232 },
        //   ...
        // ]
        const response = await fetch("http://localhost:5000/top-consumers");
        const result = await response.json();
        setConsumers(result || []);
      } catch (error) {
        console.error("Error fetching top consumers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsumers();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Top Consumers by Region</h2>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <ul className="list-group top-consumers-list">
          {consumers.map((c, i) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <i className="bi bi-geo-alt text-primary me-2"></i>
                {c.region}
              </span>
              <span className="badge bg-danger rounded-pill">{c.value} MW</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopConsumers;
