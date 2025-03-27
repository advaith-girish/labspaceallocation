import React, { useState, useEffect } from "react";
import Papa from "papaparse"; // CSV Parsing Library
import './styles/AddDesktopLab.css';
import { useParams } from "react-router-dom";

const AddDesktopLab = ({ use }) => {
  const { labId } = useParams();
  const [labData, setLabData] = useState({ csvFile: null });
  const [parsedData, setParsedData] = useState([]); // Stores parsed CSV data
  const [availableSeats, setAvailableSeats] = useState([]); // Stores available seats

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
          setParsedData(results.data);
          console.log("Parsed CSV Data:", results.data);
        },
      });
    };

    reader.onerror = (error) => console.error("Error reading CSV:", error);
  };

  async function fetchAvailableSeats() {
    try {
      const response = await fetch(`http://localhost:8080/api/seats/lab/${labId}`);
      if (!response.ok) throw new Error('Failed to fetch seats');
      const seats = await response.json();
      setAvailableSeats(seats);
    } catch (error) {
      console.error('Error fetching seats:', error);
    }
  }

  useEffect(() => {
    if (use === "students") fetchAvailableSeats();
  }, [use, labId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!labData.csvFile) return alert("Please upload a CSV file");

    try {
      if (use === "servers") {
        for (const system of parsedData) {
          const serverUserPayload = {
            ipAddress: system.IP,
            username: system.Username,
            password: system.Password,
            lab: { id: labId }
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
      } else if (use === "students") {
        if (parsedData.length > availableSeats.length) {
          return alert("Not enough seats available for all students.");
        }

        for (let i = 0; i < parsedData.length; i++) {
          const student = parsedData[i];
          const seat = availableSeats[i]; // Assign seats in order

          if (!student.Name || !student.Email || !student.Password) {
            alert(`Missing data in CSV row ${i + 1}. Ensure Name, Email, and Password are provided.`);
            return;
          }

          const responseStudent = await fetch("http://localhost:8080/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: student.Name,
              email: student.Email,
              password: student.Password, // Now using password from CSV
              role: "STUDENT"
            }),
          });

          if (!responseStudent.ok) {
            throw new Error(`Failed to register student: ${student.Name}`);
          }

          const studentResponse = await responseStudent.json();
          const studentId = studentResponse.id;

          const responseSeat = await fetch(`http://localhost:8080/api/seats/${seat.id}/assign/${studentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          });

          if (!responseSeat.ok) throw new Error(`Failed to assign seat to ${student.Name}`);
        }

        alert("Seats successfully allocated to students!");
      }

      window.location.href = "/labs";
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to complete the operation.");
    }
  };

  return (
    <div className="add-lab-container">
      <div className="add-lab-form">
        <h2>{use === "servers" ? "Add New Desktop-Based Lab" : "Allocate Seats to Students"}</h2>
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Upload CSV</label>
            <input type="file" name="csvFile" accept=".csv" onChange={handleChange} required />
          </div>

          {parsedData.length > 0 && (
            <div className="csv-preview">
              <h3>CSV Preview</h3>
              <table>
                <thead>
                  <tr>
                    {use === "servers" ? (
                      <>
                        <th>IP Address</th>
                        <th>Username</th>
                        <th>Password</th>
                      </>
                    ) : (
                      <>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th> {/* Added password column */}
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.map((entry, index) => (
                    <tr key={index}>
                      {use === "servers" ? (
                        <>
                          <td>{entry.IP}</td>
                          <td>{entry.Username}</td>
                          <td>{entry.Password}</td>
                        </>
                      ) : (
                        <>
                          <td>{entry.Name}</td>
                          <td>{entry.Email}</td>
                          <td>{entry.Password}</td> {/* Display password */}
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button type="submit" className="submit-btn">
            {use === "servers" ? "Add Lab" : "Allocate Seats"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDesktopLab;
