import React, { useState, useEffect } from 'react';

const PredictionsPage = () => {
  const [city, setCity] = useState("Chișinău");
  const [timeRange, setTimeRange] = useState("24h");
  const [selectedTab, setSelectedTab] = useState("location");
  const [predictionData7d, setPredictionData7d] = useState([]);
  const [loading, setLoading] = useState(true);

  const cities = [
    "Bălți","Cahul","Chișinău","Comrat","Cricova","Edineț","Florești",
    "Hîncești","Orhei","Rezina","Soroca","Ștefan Vodă","Tiraspol","Ungheni","Vadul lui Vodă"
  ];

  // fetch the weekly predictions
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch("http://localhost:5000/pred");
        const result = await response.json();
        // assuming result is just a list of numbers like [300, 310, 320, ...]
        setPredictionData7d(result);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const historicalData = [220, 210, 190, 180, 175, 170, 185, 200, 230, 250, 270, 290, 
                          310, 320, 315, 305, 300, 320, 340, 360, 370, 355, 330, 310];
  
  const predictionData24h = [300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 490,
                            470, 450, 430, 410, 390, 370, 350, 330, 310, 290, 270, 250];
  
  const labels24h = Array.from({length: 24}, (_, i) => `${i}:00`);
  const labels7d = Array.from({length: 7}, (_, i) => `Day ${i+1}`);

  const renderChart = () => {
    if (loading) {
      return <p className="text-center">Loading predictions...</p>;
    }

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
                    width: "6px", // made bars bigger for visibility
                    height: `${(value / maxValue) * 80}%`,
                    left: `${(index / (data.length - 1)) * 100}%`,
                    bottom: "0",
                    transform: "translateX(-50%)"
                  }}
                  title={`${labels[index % labels.length]}: ${value}`} // tooltip for clarity
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
      {/* ... your tab buttons and dropdown unchanged ... */}
      <div className="row">
        <div className="col">
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default PredictionsPage;
