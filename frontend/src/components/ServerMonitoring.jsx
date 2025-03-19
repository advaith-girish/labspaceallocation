import React, { useState } from "react";
import "./ServerMonitoring.css";
import { useNavigate } from "react-router-dom";

const ServerMonitoring = () => {
  const [toggles, setToggles] = useState({
    cpu: true,
    memory: true,
    disk: true,
    bandwidth: true
  });

  const navigate = useNavigate();

  const users = [
    { name: "User123", cpu: "35%", memory: "6.2GB", disk: "50GB", lastActive: "5 minutes ago" },
    { name: "User124", cpu: "25%", memory: "4.2GB", disk: "65GB", lastActive: "2 minutes ago" },
    { name: "User125", cpu: "18%", memory: "3.8GB", disk: "35GB", lastActive: "8 minutes ago" },
  ];

  const handleToggle = (metric) => {
    setToggles(prev => ({ ...prev, [metric]: !prev[metric] }));
  };

  return (
    <div className="server-monitoring">
      <button type="button" onClick={()=>{navigate('/')}}>Go Home</button>
      <h1>Server Monitoring</h1>

      {/* Metric Toggles */}
      <div className="toggle-container">
        {Object.keys(toggles).map((metric, index) => {
          const label = metric.charAt(0).toUpperCase() + metric.slice(1) + " Usage";
          return (
            <div key={metric} className="toggle">
              <span>{label}</span>
              <label className="switch">
                <input 
                  type="checkbox"
                  checked={toggles[metric]}
                  onChange={() => handleToggle(metric)}
                />
                <span className="slider"></span>
              </label>
            </div>
          );
        })}
      </div>

      {/* User Statistics Table */}
      <div className="table-container">
        <table className="monitoring-table">
          <thead>
            <tr>
              <th>User Name</th>
              {toggles.cpu && <th>CPU Usage (%)</th>}
              {toggles.memory && <th>Memory Usage (GB)</th>}
              {toggles.disk && <th>Disk Usage (GB)</th>}
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                {toggles.cpu && <td>{user.cpu}</td>}
                {toggles.memory && <td>{user.memory}</td>}
                {toggles.disk && <td>{user.disk}</td>}
                <td>{user.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServerMonitoring;