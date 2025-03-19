import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import Sidebar from './Sidebar';
import LabLayout from './LabLayout';
import { useParams } from 'react-router-dom';

const Dashboard = () => {
  const labId = useParams().id;
  const [activeMenu, setActiveMenu] = useState('LABLAYOUT');
  const layouts = 'BDL';
  const [seats, setseats] = useState([]);

  useEffect(() => {
    // Fetch layouts for the lab
    async function getData() {
      await fetch(`http://localhost:8080/api/seats/lab/${labId}`)
        .then(response => response.json())
        .then(data => {
          setseats(data); 
        });
    }
    getData();
  }, []);

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
              <button className={styles.primaryButton}>
                + Add New Layout
              </button>
            </div>

            <div className={styles.layoutGrid}>

              {/*  
              {layouts.map((layout, index) => (
                <div key={index} className={styles.layoutCard}>
                  <h3>{layout}</h3>
                  <LabLayout />
                </div>
              ))}
              */}

              <div className={styles.layoutCard}>
                <h3>{layouts}</h3>
                <LabLayout seats={seats}/>

                {/* <div className={styles.cardActions}>
                  <button className={styles.iconButton}>📊</button>
                  <button className={styles.iconButton}>✏️</button>
                  <button className={styles.iconButton}>🗑️</button>
                </div> */}

              </div>


            </div>

            <button className={styles.secondaryButton}>
              Show All Layouts
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
