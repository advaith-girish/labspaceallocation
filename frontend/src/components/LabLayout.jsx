import React, { useState } from "react";
import "./LabLayout.css";
import SeatBookForm from "./SeatBookForm";

const LabLayout = ({ seats }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedSeat(null);
  };

  console.log("Seats:", seats);

  const submitForm = async (name, email) => {
    console.log("Submitting for seat:", selectedSeat.id);
    console.log("User:", name, email);

    let studentId;
    try {
      const response = await fetch(`http://localhost:8080/api/users/email/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();
      console.log(data);
      if (!data || !data.id) {
        console.log("User not found");
        return;
      }

      studentId = data.id;
      console.log("Student ID:", studentId);
    } catch (error) {
      console.error("Error:", error);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/seats/${selectedSeat.id}/assign/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error("Failed to assign seat");

      alert("Seat assigned successfully!");
      closeForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const unassignSeat = async () => {
    console.log("Unassigning seat:", selectedSeat.id);

    try {
      const response = await fetch(`http://localhost:8080/api/seats/${selectedSeat.id}/unassign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Failed to unassign seat");

      alert("Seat unassigned successfully!");
      closeForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const groupedSeats = seats.reduce((acc, seat) => {
    const rowKey = seat.seatNumber.charAt(0);
    acc[rowKey] = acc[rowKey] || [];
    acc[rowKey].push(seat);
    return acc;
  }, {});

  return (
    <div className="lab-container">
      {Object.entries(groupedSeats).map(([row, seatList]) => (
        <div key={row} className="table">
          {seatList.map(seat => (
            <button
              key={seat.id}
              className={`computer ${seat.assignedUser ? "occupied" : "unoccupied"}`}
              onClick={() => handleSeatClick(seat)}
            >
              {seat.seatNumber} 💻
            </button>
          ))}
        </div>
      ))}

      {showForm && selectedSeat && (
        <div className="popup-overlay">
          <div className="popup-content">
            <SeatBookForm 
              onSubmit={submitForm} 
              seatUser={selectedSeat.assignedUser} 
              onUnassign={unassignSeat}
            />
            <button className="close-btn" onClick={closeForm}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabLayout;
