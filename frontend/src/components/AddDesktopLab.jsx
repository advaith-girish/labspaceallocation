import React, { useState } from "react";
import Papa from "papaparse"; // CSV Parsing Library
import './styles/AddDesktopLab.css';
import { useParams } from "react-router-dom";

const AddDesktopLab = () => {
  const { labId } = useParams();
  const [labData, setLabData] = useState({
    csvFile: null
  });

  const [parsedSystems, setParsedSystems] = useState([]); // Stores parsed CSV data

  const handleChange = (e) => {
    const { type, files } = e.target;
    if (type === "file") {
      setLabData({ ...labData, csvFile: files[0] });
      parseCSV(files[0]);
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
      for (const system of parsedSystems) {
        const serverUserPayload = {
          ipAddress: system.IP,
          username: system.Username,
          password: system.Password,
          lab: { id: labId } // Attach correct lab ID
        };

        console.log("Sending server user:", serverUserPayload);

        const serverResponse = await fetch("/api/server-users/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serverUserPayload),
        });

        if (!serverResponse.ok) {
          throw new Error(`Failed to add server user with IP: ${system.IP}`);
        }
      }

      alert("Lab and server users added successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add lab or server users.");
    }
  };

  return (
    <div className="add-lab-container">
      <div className="add-lab-form">
        <h2>Add New Desktop-Based Lab</h2>
        <form onSubmit={handleSubmit}>

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
