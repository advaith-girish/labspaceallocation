import React, { useState } from "react";
import './AddLab.css';

const AddLab = () => {
  const [labData, setLabData] = useState({
    name: "",
    location: "",
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

    // Ensure the SVG is parsed correctly
    if (xmlDoc.documentElement.nodeName === "parsererror") {
      throw new Error("Error parsing SVG file");
    }

    // Debugging: Log the SVG structure to ensure it's parsed correctly
    console.log("Parsed SVG:", xmlDoc);

    // Use Array.from to handle NodeList properly
    const rects = Array.from(xmlDoc.querySelectorAll("rect"));

    // Debugging: Log the rect elements to ensure they are being selected
    console.log("Rect elements:", rects);

    // Extract seat numbers from the id attributes of rect elements
    const seatNumbers = rects
      .map((rect) => rect.getAttribute("id")) // Use getAttribute to explicitly fetch the id
      .filter((id) => id && /^[A-Z]\d+$/.test(id)); // Ensure the id matches the expected format (e.g., A1, B2)

    // Debugging: Log the extracted seat numbers
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
            <label>Admin Email</label>
            <input type="email" name="adminEmail" placeholder="Enter admin email" value={labData.adminEmail} onChange={handleChange} required />
          </div>
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