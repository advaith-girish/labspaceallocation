import React, { useState } from "react";
import Papa from "papaparse"; // CSV Parsing Library
import './styles/AddDesktopLab.css';

const AddDesktopLab = () => {
  const [labData, setLabData] = useState({
    name: "",
    location: "",
    adminEmail: "",
    csvFile: null
  });

  const [parsedSystems, setParsedSystems] = useState([]); // Stores parsed CSV data

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setLabData({ ...labData, csvFile: files[0] });
      parseCSV(files[0]);
    } else {
      setLabData({ ...labData, [name]: value });
    }
  };

  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = ({ target }) => {
      Papa.parse(target.result, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setParsedSystems(results.data);
          console.log("Parsed CSV Data:", results.data);
        },
      });
    };

    reader.onerror = (error) => console.error("Error reading CSV:", error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!labData.csvFile) return alert("Please upload a CSV file");

    try {
      // Fetch admin ID
      const userResponse = await fetch(`/api/users/email/${labData.adminEmail}`);
      const userData = await userResponse.json();
      if (!userData.id) throw new Error("Admin not found");
      const adminId = userData.id;

      // Create the Lab
      const labResponse = await fetch("/api/labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: labData.name,
          location: labData.location,
          labType: "Desktop-based",
          admin: { id: adminId },
        }),
      });

      const labDataResponse = await labResponse.json();
      const labId = labDataResponse.id;

      // Attach systems to Lab
      const systemsPayload = parsedSystems.map(system => ({
        ip: system.IP,
        username: system.Username,
        password: system.Password,
        lab: { id: labId },
      }));

      // Send systems data to API
      await fetch("/api/systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(systemsPayload),
      });

      alert("Lab and systems added successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add lab or systems.");
    }
  };

  return (
    <div className="add-lab-container">
      <div className="add-lab-form">
        <h2>Add New Desktop-Based Lab</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Lab Name</label>
            <input type="text" name="name" placeholder="Enter lab name" value={labData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" placeholder="Enter location" value={labData.location} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Admin Email</label>
            <input type="email" name="adminEmail" placeholder="Enter admin email" value={labData.adminEmail} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Upload CSV</label>
            <input type="file" name="csvFile" accept=".csv" onChange={handleChange} required />
          </div>

          {parsedSystems.length > 0 && (
            <div className="csv-preview">
              <h3>CSV Preview</h3>
              <table>
                <thead>
                  <tr>
                    <th>IP Address</th>
                    <th>Username</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedSystems.map((system, index) => (
                    <tr key={index}>
                      <td>{system.IP}</td>
                      <td>{system.Username}</td>
                      <td>{system.Password}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button type="submit" className="submit-btn">Add Lab</button>
        </form>
      </div>
    </div>
  );
};

export default AddDesktopLab;
