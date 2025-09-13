import React, { useEffect, useState } from "react";
import "./SearchPage.css";

const SearchPage = () => {
  const [selectedCity, setSelectedCity] = useState("Chișinău");

  const cities = [
    "Bălți","Cahul","Chișinău","Comrat","Cricova","Edineț","Florești",
    "Hîncești","Orhei","Rezina","Soroca","Ștefan Vodă","Tiraspol","Ungheni","Vadul lui Vodă"
  ];

  const cityData = {
    "Chișinău": { avg: 125, current: 138, peak: "18:00 - 21:00" },
    "Bălți": { avg: 98, current: 110, peak: "17:00 - 20:00" },
    "Cahul": { avg: 76, current: 82, peak: "12:00 - 15:00" },
    "Orhei": { avg: 88, current: 101, peak: "19:00 - 22:00" },
    "Ungheni": { avg: 65, current: 72, peak: "13:00 - 16:00" },
    "Hîncești": { avg: 92, current: 115, peak: "18:00 - 21:00" },
    "Comrat": { avg: 70, current: 79, peak: "14:00 - 17:00" },
    "Cricova": { avg: 55, current: 61, peak: "11:00 - 14:00" },
    "Edineț": { avg: 64, current: 74, peak: "10:00 - 13:00" },
    "Florești": { avg: 59, current: 67, peak: "15:00 - 18:00" },
    "Rezina": { avg: 72, current: 84, peak: "16:00 - 19:00" },
    "Soroca": { avg: 83, current: 96, peak: "18:00 - 21:00" },
    "Ștefan Vodă": { avg: 60, current: 68, peak: "09:00 - 12:00" },
    "Tiraspol": { avg: 140, current: 158, peak: "20:00 - 23:00" },
    "Vadul lui Vodă": { avg: 50, current: 56, peak: "08:00 - 11:00" },
  };

  useEffect(() => {
    const L = window.L;
    if (!L) return;

    const map = L.map("map").setView([47.4116, 28.3699], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    fetch("https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/moldova.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        const regionStatus = {
          "Chișinău": "danger",
          "Bălți": "warning",
          "Cahul": "normal",
          "Orhei": "warning",
          "Ungheni": "normal",
          "Hîncești": "danger",
        };

        function getColor(status) {
          if (status === "normal") return "#28a745";
          if (status === "warning") return "#ffc107";
          if (status === "danger") return "#dc3545";
          return "#999";
        }

        function style(feature) {
          const name = feature.properties.name;
          const status = regionStatus[name] || "normal";
          return {
            fillColor: getColor(status),
            weight: 2,
            opacity: 1,
            color: "#fff",
            dashArray: "3",
            fillOpacity: 0.6,
          };
        }

        function onEachFeature(feature, layer) {
          const name = feature.properties.name;
          const status = regionStatus[name] || "normal";
          layer.bindPopup(`<strong>${name}</strong><br>Status: ${status}`);
          layer.on({
            mouseover: (e) => {
              e.target.setStyle({
                weight: 3,
                color: "#333",
                fillOpacity: 0.8,
              });
            },
            mouseout: (e) => {
              geojsonLayer.resetStyle(e.target);
            },
          });
        }

        const geojsonLayer = L.geoJson(geojson, {
          style,
          onEachFeature,
        }).addTo(map);

        map.fitBounds(geojsonLayer.getBounds());
      });
  }, []);

  return (
    <section id="search" className="page-section py-5">
      <div className="container-fluid">
        <h2 className="section-title text-center mb-4">🔍 Search Localities</h2>
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="mb-4">
              <label className="form-label fw-bold">Select City</label>
              <select
                className="form-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="data-card">
              <h3 className="data-title">{selectedCity}</h3>
              <p className="data-label">Daily Avg</p>
              <div className="data-value">{cityData[selectedCity].avg} MW</div>
              <p className="data-label">Current Usage</p>
              <div className="data-value">{cityData[selectedCity].current} MW</div>
              <p className="data-label">Peak Hours</p>
              <div className="data-value">{cityData[selectedCity].peak}</div>
            </div>

            <div className="data-card">
              <h3 className="data-title">Network Status</h3>
              <div className="status-item normal"><span className="status-dot"></span> Normal (0-70%)</div>
              <div className="status-item warning"><span className="status-dot"></span> Moderate (70-90%)</div>
              <div className="status-item danger"><span className="status-dot"></span> Critical (90%+)</div>
            </div>
          </div>

          <div className="col-lg-8">
            <div id="map" className="map-container"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
