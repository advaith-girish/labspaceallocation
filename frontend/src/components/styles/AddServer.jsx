import React, { useState } from "react";
import './AddServer.css';

const AddServer = () => {
  const [serverData, setServerData] = useState({
    labName: "",
    ip: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServerData({ ...serverData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serverData),
      });

      if (!response.ok) throw new Error("Failed to add server");

      alert("Server added successfully!");
      setServerData({ labName: "", ip: "", username: "", password: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add server.");
    }
  };

  return (
    <div className="add-server-container">
      <div className="add-server-form">
        <h2>Add New Server</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Lab Name</label>
            <input type="text" name="labName" placeholder="Enter lab name" value={serverData.labName} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>IP Address</label>
            <input type="text" name="ip" placeholder="Enter server IP" value={serverData.ip} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" placeholder="Enter username" value={serverData.username} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter password" value={serverData.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="submit-btn">Add Server</button>
        </form>
      </div>
    </div>
  );
};

export default AddServer;
