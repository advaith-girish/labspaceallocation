import React, { useState } from "react";
import './AddLab.css'; // Import the external CSS file

const AddLab = () => {
  const [labData, setLabData] = useState({
    name: "",
    location: "",
    file: null,  // For storing the uploaded file
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setLabData({ ...labData, file: files[0] });
    } else {
      setLabData({ ...labData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulating an API call for the file upload
      alert("Lab added successfully!");
      console.log("Lab Data:", labData);
    } catch (error) {
      console.error("Error adding lab:", error);
      alert("Failed to add lab.");
    }
  };

  return (
    <div className="add-lab-container">
      <div className="add-lab-form">
        <h2>Add New Lab</h2>

        <form onSubmit={handleSubmit}>
          {/* Lab Name Input */}
          <div className="form-group">
            <label>Lab Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter lab name"
              value={labData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Location Input */}
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={labData.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* File Upload Button */}
          <div className="form-group">
            <label>Upload File</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Add Lab
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLab;
