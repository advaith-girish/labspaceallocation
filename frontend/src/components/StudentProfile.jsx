import React, { useState, useEffect } from "react";
import "./StudentProfile.css";

function StudentProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("Local stored user:", user);

  const isStudent = user?.role === "STUDENT";
  const [seatInfo, setSeatInfo] = useState(null);
  const [labs, setLabs] = useState([]); 
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState(""); 
  const [isUnassignRequested, setIsUnassignRequested] = useState(false);

  // ✅ Fetch seat information if the user is a student
  async function fetchSeatInfo() {
    if (isStudent) {
      try {
        console.log(`Fetching seat for user ID: ${user.id}`);
        const response = await fetch(`/api/seats/user/${user.id}`);
        const seatData = await response.json();
        console.log("Fetched seat info:", seatData); // 🔍 Debug log
  
        if (!seatData.lab) {
          console.error("Lab data is missing from the API response!");
        }
  
        setSeatInfo(seatData);
      } catch (error) {
        console.error("Error fetching seat:", error);
      }
    }
  }
  

  // ✅ Fetch available labs
  async function fetchLabs() {
    try {
      console.log("Fetching available labs...");
      const response = await fetch(`/api/labs`);
      const labData = await response.json();
      console.log("Fetched labs:", labData);
      setLabs(labData);
    } catch (error) {
      console.error("Error fetching labs:", error);
    }
  }

  // ✅ Request a seat in a lab
  async function submitSeatRequest() {
    if (!selectedLab) {
      alert("Please select a lab.");
      return;
    }

    try {
      console.log(`Requesting seat for user ${user.name} in lab ${selectedLab}`);
      const response = await fetch(`/api/seat-requests/request`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          studentName: user.name,
          studentEmail: user.email,
          labId: selectedLab
        })
      });

      if (!response.ok) throw new Error("Failed to request seat");

      alert("Seat request submitted successfully!");
      setShowRequestModal(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // ✅ Request to unassign seat
  async function submitUnassignRequest() {
    if (!seatInfo) {
      alert("You don't have a seat assigned.");
      return;
    }

    try {
      console.log(`Requesting seat unassignment for seat ${seatInfo.id}`);
      const response = await fetch(`/api/seat-unassign-requests/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          seatId: seatInfo.id
        })
      });

      if (!response.ok) throw new Error("Failed to request unassignment");

      alert("Seat unassignment request submitted successfully!");
      setIsUnassignRequested(true);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // ✅ Fetch data on component mount
  useEffect(() => {
    fetchSeatInfo();
    fetchLabs();
  }, []);

  return (
    <div className="containerProfile">
      <div className="contentProfile">
        <h1 className="pageTitle">{isStudent ? "STUDENT" : "ADMIN"} PROFILE</h1>

        <div className="profileWrapper">
          {/* ✅ Student's Current Seat Allocation */}
          {isStudent && (
            <div className="card allocationBox">
              <h3>Current Allocation</h3>
              {seatInfo ? (
                <>
                  <p>
                    <b>Lab:</b> {seatInfo?.lab?.name || "Fetching..."}
                  </p>
                  <p>
                    <b>Seat No.:</b> {seatInfo?.seatNumber || "N/A"}
                  </p>
                  <p>
                    <b>Location:</b> {seatInfo?.lab?.location || "Fetching..."}
                  </p>
                </>
              ) : (
                <p>No seat assigned</p>
              )}
            </div>
          )}

          {/* ✅ Student's Details */}
          <div className="card detailsBox">
            <h3>{user?.role}</h3>
            <p>
              <b>Name:</b> {user?.name}
            </p>
            <p>
              <b>Email:</b> {user?.email}
            </p>
          </div>
        </div>

        {/* ✅ Request a seat if student has none */}
        {isStudent && !seatInfo && (
          <button className="saveButton" onClick={() => setShowRequestModal(true)}>
            Request Seat
          </button>
        )}

        {/* ✅ Request to unassign seat if student has one */}
        {isStudent && seatInfo && (
          <button 
            className="unassignButton" 
            onClick={submitUnassignRequest} 
            disabled={isUnassignRequested}
          >
            {isUnassignRequested ? "Unassignment Requested" : "Request Unassign Seat"}
          </button>
        )}
      </div>

      {/* ✅ Modal for selecting lab when requesting a seat */}
      {showRequestModal && isStudent && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>Select a Lab for Seat Request</h3>
            <select onChange={(e) => setSelectedLab(e.target.value)} value={selectedLab}>
              <option value="">Select a Lab</option>
              {labs.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.name} ({lab.location})
                </option>
              ))}
            </select>
            <button onClick={submitSeatRequest}>Submit Request</button>
            <button onClick={() => setShowRequestModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentProfile;
