import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import Sidebar from './Sidebar';
import LabLayout from './LabLayout'; // Import the LabLayout component

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('LABLAYOUT');
  const [layouts, setLayouts] = useState(['BDL']);

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
              {layouts.map((layout, index) => (
                <div key={index} className={styles.layoutCard}>
                  <h3>{layout}</h3>
                  
                  {/* Replace Image with LabLayout Component */}
                  <LabLayout /> 

                  <div className={styles.cardActions}>
                    {/* <button className={styles.iconButton}>📊</button> */}
                    {/* <button className={styles.iconButton}>✏️</button> */}
                    {/* <button className={styles.iconButton}>🗑️</button> */}
                  </div>
                </div>
              ))}
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
