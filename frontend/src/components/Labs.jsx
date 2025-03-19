import React from 'react';
import styles from './Labs.module.css';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const LabDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  let role=user['role'];
  let name=user['name'];
  return (
    <div className={styles.container}>
      <Sidebar/>

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Lab Space Allocation Manager</h1>
          <div className={styles.profileSection}>
            <div className={styles.profileBadge}>K</div>
            <span>{name} - {role}</span>
          </div>
        </div>

        

        <Outlet />
      </div>
    </div>
  );
};

export default LabDashboard;