import React, { useEffect, useState } from "react";
import styles from "./styles/Notifications.module.css";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]); // Seat assignment requests
  const [unassignRequests, setUnassignRequests] = useState([]); // Seat unassignment requests
  const [labAdminLabs, setLabAdminLabs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  useEffect(() => {
    if (user.role === "STUDENT") {
      navigate("/profile");
    }

    if (user.role === "LAB_ADMIN") {
      fetch(`http://localhost:8080/api/labs/admin/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setLabAdminLabs(data.map((lab) => lab.id));
        })
        .catch((error) => console.error("Error fetching labs:", error));
    }
  }, [userId]);

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
      .catch((error) => console.error("Error fetching seat requests:", error));

    fetch("http://localhost:8080/api/seat-unassign-requests/pending")
      .then((response) => response.json())
      .then((data) => {
        if (user.role === "LAB_ADMIN") {
          const filteredUnassignRequests = data.filter((req) =>
            labAdminLabs.includes(req.seat.lab.id)
          );
          console.log("Filtered unassign requests:", filteredUnassignRequests);
          setUnassignRequests(filteredUnassignRequests);
        } else {
          setUnassignRequests(data);
        }
      })
      .catch((error) => console.error("Error fetching unassign requests:", error));
  }, [labAdminLabs]);


  const handleRequestAction = async (requestId, status, isUnassign) => {
    const url = isUnassign
      ? `http://localhost:8080/api/seat-unassign-requests/update/${requestId}/${status}`
      : `http://localhost:8080/api/seat-requests/update/${requestId}/${status}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to update request");

      alert(`Request ${status.toLowerCase()} successfully!`);
      if (isUnassign) {
        setUnassignRequests(unassignRequests.filter((req) => req.id !== requestId));
      } else {
        setRequests(requests.filter((req) => req.id !== requestId));
      }
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
        <p className={styles.noNotifications}>No pending seat requests.</p>
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
                  onClick={() => handleRequestAction(req.id, "Approved", false)}
                >
                  Approve
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={() => handleRequestAction(req.id, "Rejected", false)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.header}>
        <h2>Seat Unassignment Requests</h2>
      </div>

      {unassignRequests.length === 0 ? (
        <p className={styles.noNotifications}>No pending unassign requests.</p>
      ) : (
        <div className={styles.notificationList}>
          {unassignRequests.map((req) => (
            <div key={req.id} className={styles.notificationItem}>

              <span className={styles.notificationText}>
                <b>{req.user?.name || "Unknown User"}</b> ({req.user?.email || "No Email"}) requested to unassign seat {" "}
                <b>{req.seat?.seatNumber || "Unknown Seat"} </b>
                in <b>{req.seat?.lab?.name || "Unknown Lab"}</b>
              </span>

              <div className={styles.buttonContainer}>
                <button
                  className={styles.approveButton}
                  onClick={() => handleRequestAction(req.id, "Approved", true)}
                >
                  Approve
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={() => handleRequestAction(req.id, "Rejected", true)}
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
