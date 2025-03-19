import React, { useState, useEffect } from "react";
import "./StudentProfile.css";

function StudentProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("Local stored user:", user);

  const isStudent = user?.role === "STUDENT";
  const [seatInfo, setSeatInfo] = useState(null);
  const [labInfo, setLabInfo] = useState(null);

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

  useEffect(() => {
    fetchSeatInfo();
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
      </div>
    </div>
  );
}

export default StudentProfile;
