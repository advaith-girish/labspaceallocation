import React, { useState, useEffect } from "react";
import "./StudentProfile.css";

function StudentProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("Local stored user:", user);

  const isStudent = user?.role === "STUDENT";

  const [seatInfo, setSeatInfo] = useState(null);
  const [labInfo, setLabInfo] = useState(null);
  const [labs, setLabs] = useState([]); 
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState(""); 

  // Fetch seat information if the user is a student
  async function fetchSeatInfo() {
    if (isStudent) {
      try {
        const response = await fetch(`/api/seats/user/${user.id}`);
        const seatData = await response.json();
        console.log("Fetched seat info:", seatData);
        setSeatInfo(seatData);
      } catch (error) {
        console.error("Error fetching seat:", error);
      }
    }
  }

  // Fetch lab information based on seat assignment
  async function fetchLabInfo() {
    if (seatInfo?.id) {
      try {
        const response = await fetch(`/api/labs/${seatInfo.id}`);
        const labData = await response.json();
        console.log("Fetched lab info:", labData);
        setLabInfo(labData);
      } catch (error) {
        console.error("Error fetching lab:", error);
      }
    }
  }

  async function fetchLabs() {
    try {
      const response = await fetch(`/api/labs`);
      const labData = await response.json();
      console.log("Fetched labs:", labData);
      setLabs(labData);
    } catch (error) {
      console.error("Error fetching labs:", error);
    }
  }

  async function submitSeatRequest() {
    if (!selectedLab) {
      alert("Please select a lab.");
      return;
    }

    try {
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

  useEffect(() => {
    fetchSeatInfo();
    fetchLabs();
  }, []);

  useEffect(() => {
    fetchLabInfo();
  }, [seatInfo]);

  return (
    <div className="containerProfile">
      <div className="contentProfile">
        <h1 className="pageTitle">{isStudent ? "STUDENT" : "ADMIN"} PROFILE</h1>

        <div className="profileWrapper">
          {isStudent && (
            <div className="card allocationBox">
              <h3>Current Allocation</h3>
              {seatInfo ? (
                <>
                  <p>
                    <b>Lab:</b> {labInfo ? labInfo.name : "Fetching..."}
                  </p>
                  <p>
                    <b>Seat No.:</b> {seatInfo.seatNumber || "N/A"}
                  </p>
                  <p>
                    <b>Type:</b> {seatInfo.type || "N/A"}
                  </p>
                </>
              ) : (
                <p>No seat assigned</p>
              )}

              <h3>Past Allocations</h3>
              <p>...</p>
              <p>...</p>
              <p>...</p>
            </div>
          )}

          <div className="card detailsBox">
            <h3>{user?.role}</h3>
            <p>
              <b>Name:</b> {user?.name}
            </p>
            <p>
              <b>Email:</b> {user?.email}
            </p>
            <p>
              <b>Password:</b> {user?.password}
            </p>
          </div>
        </div>

        {isStudent && <button className="saveButton" onClick={() => setShowRequestModal(true)}>
          Request Seat
        </button>}
      </div>

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
