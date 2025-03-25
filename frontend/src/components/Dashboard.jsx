import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import Sidebar from './Sidebar';
import LabLayout from './LabLayout';
import { useNavigate, useParams } from 'react-router-dom';

const Dashboard = () => {
  const { id: labId } = useParams();
  const [activeMenu, setActiveMenu] = useState('LABLAYOUT');
  const [labName, setLabName] = useState('Loading...');
  const [seats, setSeats] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unassignRequests, setUnassignRequests] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    async function fetchLabData() {
      try {
        const response = await fetch(`http://localhost:8080/api/labs/${labId}`);
        if (!response.ok) throw new Error('Failed to fetch lab details');

        const data = await response.json();
        setLabName(data.name || 'Unknown Lab');
      } catch (error) {
        console.error('Error fetching lab details:', error);
        setLabName('Error Loading Lab');
      }
    }

    async function fetchSeatsData() {
      try {
        const response = await fetch(`http://localhost:8080/api/seats/lab/${labId}`);
        if (!response.ok) throw new Error('Failed to fetch seats');

        const data = await response.json();
        setSeats(data);
      } catch (error) {
        console.error('Error fetching seats:', error);
      }
    }

    fetchLabData();
    fetchSeatsData();
  }, [labId]);

  useEffect(() => {
    if (showNotifications) {
      fetch(`http://localhost:8080/api/seat-requests/pending/${labId}`)
        .then(response => response.json())
        .then(data => {
          const filteredRequests = data.filter(req => req.lab.id === parseInt(labId));
          setNotifications(filteredRequests);
        })
        .catch(error => console.error("Error fetching requests:", error));

      fetch(`http://localhost:8080/api/seat-unassign-requests/lab/${labId}`)
        .then(response => response.json())
        .then(data => {
          const pendingUnassignRequests = data.filter(req => req.status === "Pending");
          setUnassignRequests(pendingUnassignRequests);
        })
        .catch(error => console.error("Error fetching unassign requests:", error));
    }
  }, [showNotifications]);

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
      setNotifications(notifications.filter(req => req.id !== requestId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUnassignRequestAction = async (requestId, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/seat-unassign-requests/update/${requestId}/${status}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to update unassign request");

      alert(`Unassign request ${status.toLowerCase()} successfully!`);
      setUnassignRequests(unassignRequests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteLab = async () => {
    if (!window.confirm("Are you sure you want to delete this lab?")) {
      return;
    }
    try {
      const response = await fetch(`/api/labs/${labId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete lab: ${response.statusText}`);
      }

      alert("Lab deleted successfully!");
      navigate("/labs");
    } catch (error) {
      console.error("Error deleting lab:", error);
      alert("Failed to delete lab.");
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>{activeMenu}</h1>
          <div className={styles.profileSection}>
            <span>PROFILE</span>
            <div className={styles.profileBadge}>JC</div>
          </div>
        </header>

        {activeMenu === 'LABLAYOUT' && (
          <div className={styles.content}>
            <div className={styles.layoutHeader}>
              <h2>Existing Layouts</h2>
              {user.role === 'ADMIN' && (
                <button className={styles.primaryButton} onClick={deleteLab}>
                  Delete this Lab
                </button>
              )}
            </div>

            <div className={styles.layoutGrid}>
              <div className={styles.layoutCard}>
                <h3>{labName}</h3>
                <LabLayout seats={seats} labId={labId} />
              </div>
            </div>

            <button
              className={styles.secondaryButton}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              {showNotifications ? "Hide Notifications" : "Show Notifications"}
            </button>

            {showNotifications && (
              <div className={styles.notificationsContainer}>
                <div className={styles.notificationSection}>
                  <h3>Pending Seat Requests</h3>
                  {notifications.length === 0 ? (
                    <p className={styles.noNotifications}>No pending requests for this lab.</p>
                  ) : (
                    <ul className={styles.notificationList}>
                      {notifications.map((req) => (
                        <li key={req.id} className={styles.notificationItem}>
                          <span className={styles.notificationText}>
                            <b>{req.studentName}</b> ({req.studentEmail}) requested a seat
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
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={styles.notificationSection}>
                  <h3>Pending Seat Unassignment Requests</h3>
                  {unassignRequests.length === 0 ? (
                    <p className={styles.noNotifications}>No unassignment requests for this lab.</p>
                  ) : (
                    <ul className={styles.notificationList}>
                      {unassignRequests.map((req) => (
                        <li key={req.id} className={styles.notificationItem}>
                          <span className={styles.notificationText}>
                            <b>{req.user.name}</b> ({req.user.email}) requested to unassign seat <b>{req.seat.seatNumber}</b>
                          </span>
                          <div className={styles.buttonContainer}>
                            <button
                              className={styles.approveButton}
                              onClick={() => handleUnassignRequestAction(req.id, "Approved")}
                            >
                              Approve
                            </button>
                            <button
                              className={styles.rejectButton}
                              onClick={() => handleUnassignRequestAction(req.id, "Rejected")}
                            >
                              Reject
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;