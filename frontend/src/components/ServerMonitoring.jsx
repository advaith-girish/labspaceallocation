import React, { useState, useEffect } from "react";
import "./ServerMonitoring.css";
import { useNavigate } from "react-router-dom";

const CPU_THRESHOLD = 80;

const ServerMonitoring = () => {
  const [toggles, setToggles] = useState({ cpu: true, memory: true, disk: true });
  const [serverStats, setServerStats] = useState({});
  const [warnings, setWarnings] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedInUser || !loggedInUser.id) {
      console.error("User not logged in or missing ID.");
      navigate("/login");
      return;
    }

    setUser(loggedInUser);

    const fetchStats = () => {
      fetch(`http://localhost:8080/api/server/stats?userId=${loggedInUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          setServerStats(data);
          setWarnings(
            Object.entries(data)
              .filter(([_, stats]) => stats.warning)
              .map(([ip, stats]) => ({
                ip,
                username: stats.username,
                lab: stats.lab,
                cpu: stats.cpu,
                message: stats.warning,
              }))
          );
        })
        .catch((err) => console.error("Error fetching data:", err));
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="server-monitoring">
      <button className="gohomebutton" onClick={() => navigate("/")}>Go Home</button>
      <h1>Server Monitoring</h1>

      {warnings.length > 0 && (
        <div className="warning-container">
          {warnings.map((warning, index) => (
            <div key={index} className="warning-box">
              ⚠️ <strong>{warning.message}</strong>
              <br />
              Lab: {warning.lab || "Unknown"}
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

      <div className="table-container">
        <table className="monitoring-table">
          <thead>
            <tr>
              <th>Lab Name</th>
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
                <td>{stats.lab || "Unknown"}</td>
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
