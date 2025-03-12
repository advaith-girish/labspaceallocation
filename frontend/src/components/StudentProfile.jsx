import React from "react";
import "./StudentProfile.css";

function StudentProfile() {
  return (
    <div className="containerProfile">
      <div className="content">
        <h1 className="pageTitle">STUDENT PROFILE</h1>

        <div className="profileWrapper">
          {/* Allocation Card */}
          <div className="card allocationBox">
            <h3>Current Allocation</h3>
            <p><b>Lab:</b> BDL</p>
            <p><b>Seat No.:</b> B1</p>
            <p><b>Type:</b> Desktop-based</p>
            <h3>Past Allocations</h3>
            <p>...</p>
            <p>...</p>
            <p>...</p>
          </div>

          {}
          <div className="card detailsBox">
            <h3>Student Details</h3>
            <p><b>Name:</b> Arjun Sarath</p>
            <p><b>Email:</b> as@example.com</p>
            <p><b>Roll Number:</b> 12345</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
