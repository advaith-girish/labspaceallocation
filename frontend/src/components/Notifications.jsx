import React, { useEffect, useState } from "react";
import styles from "./styles/Notifications.module.css";
import { useNavigate } from "react-router-dom";


const Notifications = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [labAdminLabs, setLabAdminLabs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  useEffect(() => {
    let url = "http://localhost:8080/api/seat-requests/pending";

    if(user.role === "STUDENT") {
      navigate("/profile");
    }
    

    if (user.role === "LAB_ADMIN") {
      fetch(`http://localhost:8080/api/labs/admin/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setLabAdminLabs(data.map((lab) => lab.id)); // Store lab IDs
        })
        .catch((error) => console.error("Error fetching labs:", error));
    }
  }, [user.role, userId]);


  useEffect(() => {
    fetch("http://localhost:8080/api/seat-requests/pending")
      .then((response) => response.json())
      .then((data) => {
        if (user.role === "LAB_ADMIN") {
          const filteredRequests = data.filter((req) =>
            labAdminLabs.includes(req.lab.id)
          );
          setRequests(filteredRequests);
        } else {
          setRequests(data);
        }
      })
      .catch((error) => console.error("Error fetching requests:", error));
  }, [user.role, labAdminLabs]);


  const handleRequestAction = async (requestId, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/seat-requests/update/${requestId}/${status}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to update request");

      alert(`Request ${status.toLowerCase()} successfully!`);
      setRequests(requests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Seat Requests</h2>
      </div>

      {requests.length === 0 ? (
        <p className={styles.noNotifications}>No pending requests.</p>
      ) : (
        <div className={styles.notificationList}>
          {requests.map((req) => (
            <div key={req.id} className={styles.notificationItem}>
              <span className={styles.notificationText}>
                <b>{req.studentName}</b> ({req.studentEmail}) requested a seat
                in <b>{req.lab.name}</b>
              </span>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.approveButton}
                  onClick={() => handleRequestAction(req.id, "Approved")}
                >
                  Approve
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={() => handleRequestAction(req.id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
