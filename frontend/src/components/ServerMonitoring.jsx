import React, { useState, useEffect } from "react";
import "./ServerMonitoring.css";
import { useNavigate } from "react-router-dom";

const CPU_THRESHOLD = 80;  // Set threshold for warnings

const ServerMonitoring = () => {
  const [toggles, setToggles] = useState({ cpu: true, memory: true, disk: true });
  const [serverStats, setServerStats] = useState({});
  const [warnings, setWarnings] = useState([]);  // Store warning messages

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/server/stats")
      .then((res) => res.json())
      .then((data) => {
        setServerStats(data);

        // Extract warnings from API response
        const newWarnings = [];
        Object.entries(data).forEach(([ip, stats]) => {
          if (stats.warning) {
            newWarnings.push({ ip, username: stats.username, cpu: stats.cpu, message: stats.warning });
          }
        });

        setWarnings(newWarnings);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="server-monitoring">
      <button type="button" onClick={() => navigate("/")}>Go Home</button>
      <h1>Server Monitoring</h1>

      {/* Warning Messages */}
      {warnings.length > 0 && (
        <div className="warning-container">
          {warnings.map((warning, index) => (
            <div key={index} className="warning-box">
              ⚠️ <strong>{warning.message}</strong>  
              <br />
              User: {warning.username}  
              <br />
              IP: {warning.ip}  
              <br />
              CPU Usage: {warning.cpu}%
            </div>
          ))}
        </div>
      )}

      {/* Metric Toggles */}
      <div className="toggle-container">
        {Object.keys(toggles).map((metric) => (
          <div key={metric} className="toggle">
            <span>{metric.charAt(0).toUpperCase() + metric.slice(1)} Usage</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={toggles[metric]}
                onChange={() => setToggles((prev) => ({ ...prev, [metric]: !prev[metric] }))}
              />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>

      {/* Server Stats Table */}
      <div className="table-container">
        <table className="monitoring-table">
          <thead>
            <tr>
              <th>VM IP</th>
              <th>Username</th>
              {toggles.cpu && <th>CPU Usage (%)</th>}
              {toggles.memory && <th>Memory Usage (%)</th>}
              {toggles.disk && <th>Disk Usage (%)</th>}
            </tr>
          </thead>
          <tbody>
            {Object.entries(serverStats).map(([ip, stats]) => (
              <tr key={ip}>
                <td>{ip}</td>
                <td>{stats.username || "Unknown"}</td>
                {toggles.cpu && <td>{stats.cpu || "N/A"}</td>}
                {toggles.memory && <td>{stats.memory || "N/A"}</td>}
                {toggles.disk && <td>{stats.disk || "N/A"}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServerMonitoring;
