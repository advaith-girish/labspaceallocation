import React from "react";
import "./StudentProfile.css";

function StudentProfile() {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("local stored : ",user);
  var isStudent = (user['role']=='STUDENT');

  return (
    <div className="containerProfile">
      <div className="contentProfile">
        <h1 className="pageTitle">{isStudent?"STUDENT":"ADMIN"} PROFILE</h1>

        <div className="profileWrapper">

          {isStudent && <div className="card allocationBox">
            <h3>Current Allocation</h3>
            <p><b>Lab:</b> BDL</p>
            <p><b>Seat No.:</b> B1</p>
            <p><b>Type:</b> Desktop-based</p>
            <h3>Past Allocations</h3>
            <p>...</p>
            <p>...</p>
            <p>...</p>
          </div>}

          <div className="card detailsBox">
            <h3>{user['role']}</h3>
            <p><b>Name:</b>{user['name']}</p>
            <p><b>Email:</b>{user['email']}</p>
            <p><b>Password:</b>{user['password']}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
