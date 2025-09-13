import React, { useState } from 'react';

const PredictionsPage = () => {
  const [city, setCity] = useState("Chișinău");
  const [timeRange, setTimeRange] = useState("24h");
  const [selectedTab, setSelectedTab] = useState("location");

  const cities = [
    "Bălți","Cahul","Chișinău","Comrat","Cricova","Edineț","Florești",
    "Hîncești","Orhei","Rezina","Soroca","Ștefan Vodă","Tiraspol","Ungheni","Vadul lui Vodă"
  ];





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







  const historicalData = [220, 210, 190, 180, 175, 170, 185, 200, 230, 250, 270, 290, 
                          310, 320, 315, 305, 300, 320, 340, 360, 370, 355, 330, 310];
  
  const predictionData24h = [300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 490,
                            470, 450, 430, 410, 390, 370, 350, 330, 310, 290, 270, 250];
  
  const predictionData7d = [300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410,
                            420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530,
                            540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650,
                            660, 670, 680, 690, 700, 710, 720, 730, 740, 750, 760, 770];

  const labels24h = Array.from({length: 24}, (_, i) => `${i}:00`);
  const labels7d = Array.from({length: 7}, (_, i) => `Day ${i+1}`);

  const renderChart = () => {
    const data = timeRange === "24h" 
      ? historicalData.concat(predictionData24h) 
      : historicalData.concat(predictionData7d);

    const labels = timeRange === "24h" ? labels24h : labels7d;
    const maxValue = Math.max(...data);

    return (
      <div className="chart-container">
        <div className="position-relative h-100">
     
          <div className="position-absolute w-100 h-100 d-flex flex-column justify-content-between">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="d-flex align-items-center" style={{ height: "20%" }}>
                <div className="text-muted me-2" style={{ width: "40px" }}>
                  {Math.round(maxValue * (4 - i) / 4)}
                </div>
                <div className="flex-grow-1 border-top"></div>
              </div>
            ))}
          </div>

          <div className="position-absolute w-100 h-100 pt-4">
            <div className="position-relative h-100">
              {data.map((value, index) => (
                <div 
                  key={index}
                  className="position-absolute bg-primary rounded"
                  style={{
                    width: "4px",
                    height: `${(value / maxValue) * 80}%`,
                    left: `${(index / (data.length - 1)) * 100}%`,
                    bottom: "0",
                    transform: "translateX(-50%)"
                  }}
                ></div>
              ))}

              <div 
                className="position-absolute w-100 border-top border-danger"
                style={{
                  top: `${(1 - 400 / maxValue) * 80}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="text-center mb-4 display-5 fw-bold">Energy Consumption Forecasts</h1>

      <ul className="nav nav-tabs justify-content-center mb-3">
        <li className="nav-item">
          <button 
            className={`nav-link ${selectedTab === "location" ? "active" : ""}`}
            onClick={() => setSelectedTab("location")}
          >
            By Location
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${selectedTab === "country" ? "active" : ""}`}
            onClick={() => setSelectedTab("country")}
          >
            National Overview
          </button>
        </li>
      </ul>

      {selectedTab === "location" && (
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <label className="form-label fw-bold">Select City</label>
            <select
              className="form-select form-select-lg"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {selectedTab === "country" && (
        <div className="text-center mb-4">
          <h3>National Consumption Forecast</h3>
        </div>
      )}

      <div className="text-center mb-4">
        <div className="btn-group">
          <button 
            className={`btn ${timeRange === "24h" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setTimeRange("24h")}
          >
            24 Hours
          </button>
          <button 
            className={`btn ${timeRange === "7d" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setTimeRange("7d")}
          >
            7 Days
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          {renderChart()}
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="p-3 bg-light rounded">
            <h4>How to Read the Forecast</h4>
            <p>
              The blue bars represent the estimated energy consumption for <b>{city}</b> 
              during the selected time period. The red horizontal line indicates the maximum 
              recommended consumption level. If the bars go above this line, demand exceeds 
              the safe limit. Switch between a 24-hour and a 7-day view to better understand 
              daily vs. weekly patterns.
            </p>
          </div>
        </div>
        <div className="col-md-6">
        </div>
      </div>
    </div>
  );
};

export default PredictionsPage;
