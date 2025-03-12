import React, { useState } from "react";
import "./LabLayout.css";
import SeatBookForm from "./SeatBookForm"; // Import the form

const LabLayout = () => {
  const labStructure = [
    { row: 1, computers: [1, 1, 0] },
    { row: 2, computers: [0, 1, 1] },
    { row: 3, computers: [1, 0, 1] },
  ];

  const [labStatus, setLabStatus] = useState(labStructure);
  const [showForm, setShowForm] = useState(false);

  const handleSeatClick = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  return (
    <div className="lab-container">
      {labStatus.map((row, rowIndex) => (
        <div key={rowIndex} className="table">
          {row.computers.map((status, compIndex) => (
            <button
              key={compIndex}
              className={`computer ${status ? "active" : "inactive"}`}
              onClick={handleSeatClick}
            >
              💻
            </button>
          ))}
        </div>
      ))}

      {/* Show popup form when a seat is clicked */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-content">
            <SeatBookForm />
            <button className="close-btn" onClick={closeForm}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabLayout;
