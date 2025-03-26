import React, { useState } from "react";
import './AddLab.css';

const AddLab = () => {
  const [labData, setLabData] = useState({
    name: "",
    location: "",
    labType: "Sitting-only", // Default value
    adminEmail: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setLabData({ ...labData, file: files[0] });
    } else {
      setLabData({ ...labData, [name]: value });
    }
  };

  const parseSVG = async (svgText) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(svgText, "image/svg+xml");

    if (xmlDoc.documentElement.nodeName === "parsererror") {
      throw new Error("Error parsing SVG file");
    }

    console.log("Parsed SVG:", xmlDoc);
    const rects = Array.from(xmlDoc.querySelectorAll("rect"));
    console.log("Rect elements:", rects);

    const seatNumbers = rects
      .map((rect) => rect.getAttribute("id"))
      .filter((id) => id && /^[A-Z]\d+$/.test(id));

    console.log("Extracted seat numbers:", seatNumbers);
    return seatNumbers;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!labData.file) return alert("Please upload an SVG file");

    try {
      const userResponse = await fetch(`/api/users/email/${labData.adminEmail}`);
      const userData = await userResponse.json();
      if (!userData.id) throw new Error("Admin not found");
      const adminId = userData.id;
      
      const labResponse = await fetch("/api/labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: labData.name,
          location: labData.location,
          labType: labData.labType, // ✅ Sending Lab Type
          admin: { id: adminId },
        }),
      });
      
      const labDataResponse = await labResponse.json();
      const labId = labDataResponse.id;
      const fileText = await labData.file.text();
      const seatNumbers = await parseSVG(fileText);
      
      const seatsPayload = seatNumbers.map(seat => ({ seatNumber: seat, lab: { id: labId } }));
      await fetch("/api/seats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seatsPayload),
      });
      
      alert("Lab and seats added successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add lab or seats.");
    }
  };

  return (
    <div className="add-lab-container">
      <div className="add-lab-form">
        <h2>Add New Lab</h2>
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
            <label>Lab Type</label>
            <select name="labType" value={labData.labType} onChange={handleChange} required>
              <option value="Desktop-based">Desktop-based</option>
              <option value="Sitting-only">Sitting-only</option>
            </select>
          </div>

          <div className="form-group">
            <label>Admin Email</label>
            <input type="email" name="adminEmail" placeholder="Enter admin email" value={labData.adminEmail} onChange={handleChange} required />
          </div>
{/*  */}
          <div className="form-group">
            <label>Upload SVG</label>
            <input type="file" name="file" accept=".svg" onChange={handleChange} required />
          </div>

          <button type="submit" className="submit-btn">Add Lab</button>
        </form>
      </div>
    </div>
  );
};

export default AddLab;
