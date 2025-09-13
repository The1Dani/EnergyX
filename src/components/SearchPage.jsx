import React, { useEffect } from "react";
import "./SearchPage.css";

const SearchPage = () => {
  useEffect(() => {
    const L = window.L;
    if (!L) return;

    const map = L.map("map").setView([47.4116, 28.3699], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // ✅ Example GeoJSON for Moldova regions (simplified!)
    fetch("https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/moldova.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        // Example statuses per region
        const regionStatus = {
          "Chișinău": "danger",
          "Bălți": "warning",
          "Cahul": "normal",
          "Orhei": "warning",
          "Ungheni": "normal",
          "Hîncești": "danger",
        };

        function getColor(status) {
          if (status === "normal") return "#28a745"; // green
          if (status === "warning") return "#ffc107"; // yellow
          if (status === "danger") return "#dc3545"; // red
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
          {/* Left Panel */}
          <div className="col-lg-4 mb-4">
            <div className="search-box d-flex mb-4">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Type a city name..."
              />
              <button className="btn btn-primary search-btn">Search</button>
            </div>

            <div className="data-card">
              <h3 className="data-title">Chișinău</h3>
              <p className="data-label">Daily Avg</p>
              <div className="data-value">125 MW</div>
              <p className="data-label">Current Usage</p>
              <div className="data-value">138 MW</div>
              <p className="data-label">Peak Hours</p>
              <div className="data-value">18:00 - 21:00</div>
            </div>

            <div className="data-card">
              <h3 className="data-title">Network Status</h3>
              <div className="status-item normal">
                <span className="status-dot"></span> Normal (0-70%)
              </div>
              <div className="status-item warning">
                <span className="status-dot"></span> Moderate (70-90%)
              </div>
              <div className="status-item danger">
                <span className="status-dot"></span> Critical (90%+)
              </div>
            </div>
          </div>

          {/* Right Panel (Map) */}
          <div className="col-lg-8">
            <div id="map" className="map-container"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
