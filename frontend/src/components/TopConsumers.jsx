import React from "react";
import "./DashboardandConsumers.css";

const TopConsumers = () => {
  const consumers = [
    { region: "Chișinău", value: 245 },
    { region: "Bălți", value: 232 },
    { region: "Cahul", value: 205 },
    { region: "Orhei", value: 198 },
    { region: "Ungheni", value: 185 },
    { region: "Cahul", value: 179 },
    { region: "Strășeni", value: 171 },
    { region: "Ștefan Vodă", value: 160 },
    { region: "Dubăsari", value: 156 },
    { region: "Dondușeni", value: 130 },
    { region: "Glodeni", value: 126 },
    { region: "Taraclia", value: 125 },
    { region: "Telenești ", value: 119 },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4">Top Consumers by Region</h2>
      <ul className="list-group top-consumers-list">
        {consumers.map((c, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-geo-alt text-primary me-2"></i>
              {c.region}
            </span>
            <span className="badge bg-danger rounded-pill">{c.value} MW</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopConsumers;
