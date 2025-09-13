import React, { useState, useEffect } from "react";
import "./SmartHouse.css";

function SmartHouse() {
  const [temperature, setTemperature] = useState(22); 
  const [thermostatOn, setThermostatOn] = useState(false);
  const [lightsOn, setLightsOn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((t) => {
        const newTemp = t + (Math.random() * 4 - 2); 
        return Math.round(newTemp * 10) / 10;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (temperature > 25) {
      setThermostatOn(false);
    } else if (temperature < 20) {
      setThermostatOn(true);
    }
  }, [temperature]);

  return (
    <div className="smart-house-container">
      <h2 className="title">🏠 Smart House IoT Demo</h2>
      <p className="subtitle">
        External temperature: <strong>{temperature}°C</strong>
      </p>

      <div className="devices-grid">
        <div className="device-card">
          <div
            className={`bulb ${thermostatOn ? "on" : "off"}`}
          ></div>
          <p>Thermostat: {thermostatOn ? "On" : "Off"}</p>
        </div>

        <div className="device-card">
          <div
            className={`bulb ${lightsOn ? "on" : "off"}`}
          ></div>
          <p>Lights: {lightsOn ? "On" : "Off"}</p>
          <button
            className="toggle-btn"
            onClick={() => setLightsOn(!lightsOn)}
          >
            Toggle Lights
          </button>
        </div>
      </div>

      <p className="note">
        🌡️ When the outside temperature is above <b>25°C</b>, the thermostat
        automatically turns <b>Off</b>.  
        When it drops below <b>20°C</b>, it turns <b>On</b>.  
        Lights can be controlled manually.
      </p>
    </div>
  );
}

export default SmartHouse;
