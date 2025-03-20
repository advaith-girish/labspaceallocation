import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import Sidebar from './Sidebar';
import LabLayout from './LabLayout';
import { useParams } from 'react-router-dom';

const Dashboard = () => {
  const { id: labId } = useParams(); // Get labId from URL
  const [activeMenu, setActiveMenu] = useState('LABLAYOUT');
  const [labName, setLabName] = useState('Loading...');
  const [seats, setSeats] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false); // Toggle notifications
  const [notifications, setNotifications] = useState([]); // Store lab-specific notifications

  useEffect(() => {
    // Fetch lab details
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

    // Fetch seats in the lab
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

  // Fetch seat request notifications for the specific lab
  useEffect(() => {
    if (showNotifications) {
      fetch("http://localhost:8080/api/seat-requests/pending")
        .then(response => response.json())
        .then(data => {
          const filteredRequests = data.filter(req => req.lab.id === parseInt(labId));
          setNotifications(filteredRequests);
        })
        .catch(error => console.error("Error fetching requests:", error));
    }
  }, [showNotifications, labId]);

  // ✅ Function to Approve/Reject Seat Requests
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
              <button className={styles.primaryButton}>+ Add New Layout</button>
            </div>

            <div className={styles.layoutGrid}>
              <div className={styles.layoutCard}>
                <h3>{labName}</h3> {/* Display the fetched lab name */}
                <LabLayout seats={seats} />
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
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
