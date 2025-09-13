import React, { useEffect, useState } from "react";
import "./SearchPage.css";

const SearchPage = () => {
  const [selectedCity, setSelectedCity] = useState("Chișinău");
  const [cities, setCities] = useState([]);
  const [cityData, setCityData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        // Example: backend returns something like:
        // { cities: ["Chișinău","Bălți",...],
        //   data: { "Chișinău": { avg: 125, current: 138, peak: "18:00-21:00" }, ... } }
        const response = await fetch("http://localhost:5000/cities");
        const result = await response.json();

        setCities(result.cities || []);
        setCityData(result.data || {});
        if (result.cities && result.cities.length > 0) {
          setSelectedCity(result.cities[0]);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) {
    return (
      <section id="search" className="page-section py-5">
        <div className="container-fluid text-center">
          <h2>Loading data...</h2>
        </div>
      </section>
    );
  }

  return (
    <section id="search" className="page-section py-5">
      <div className="container-fluid">
        <h2 className="section-title text-center mb-4"> Search Localities</h2>
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
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {cityData[selectedCity] && (
              <div className="data-card">
                <h3 className="data-title">{selectedCity}</h3>
                <p className="data-label">Daily Avg</p>
                <div className="data-value">{cityData[selectedCity].avg} MW</div>
                <p className="data-label">Current Usage</p>
                <div className="data-value">{cityData[selectedCity].current} MW</div>
                <p className="data-label">Peak Hours</p>
                <div className="data-value">{cityData[selectedCity].peak}</div>
              </div>
            )}

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

          <div className="col-lg-8">
            {/* You could add a chart or visualization instead of map */}
            <div className="placeholder-box">
              <p>
                Data for <strong>{selectedCity}</strong> is loaded from API.  
                You can integrate charts or another visualization here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;