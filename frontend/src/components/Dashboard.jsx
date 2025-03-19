import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import Sidebar from './Sidebar';
import LabLayout from './LabLayout';
import { useParams } from 'react-router-dom';

const Dashboard = () => {
  const { id: labId } = useParams(); // Get labId from URL parameters
  const [activeMenu, setActiveMenu] = useState('LABLAYOUT');
  const [labName, setLabName] = useState('Loading...'); // State for lab name
  const [seats, setSeats] = useState([]); // State for seats

  useEffect(() => {
    // Fetch lab details (including name)
    async function fetchLabData() {
      try {
        const response = await fetch(`http://localhost:8080/api/labs/${labId}`);
        if (!response.ok) throw new Error('Failed to fetch lab details');
        
        const data = await response.json();
        setLabName(data.name || 'Unknown Lab'); // Update lab name
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

            <button className={styles.secondaryButton}>Show All Layouts</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
