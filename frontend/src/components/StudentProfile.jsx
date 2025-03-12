import React from "react";
import "./StudentProfile.css";

function StudentProfile() {
  return (
    <div className="container">
    
      <div className="content">
        <h1 className="pageTitle" >Student's Profile</h1>

        <div className="profileContainer">
       
          <div className="allocationBox">
            <h3>Current Allocation:</h3>
            <p><b>Lab:</b> BDL</p>
            <p><b>Seat No.:</b> B1</p>
            <p><b>Type:</b> Desktop-based</p>
            <h3>Past Allocations:</h3>
            <p>...</p>
            <p>...</p>
            <p>...</p>
          </div>

        
          <div className="detailsBox">
            <p><b>Name:</b> Student</p>
            <p><b>Email:</b> YYY</p>
            <p><b>Roll Number:</b> YYY</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
