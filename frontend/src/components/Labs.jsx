import React, { useEffect, useState } from 'react';
import styles from './LabDashboard.module.css';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

const LabDashboard = () => {

  const [labs, setlabs] = useState([]);
  const user=JSON.parse(localStorage.getItem('user'));
  let role=user['role'];
  let name=user['name'];
  const navigate = useNavigate();

  useEffect(() => {

    if(role=='ADMIN')
    {
      fetch('http://localhost:8080/api/labs')
      .then(response => response.json())
      .then(data => setlabs(data));
    }
    else if(role=='LAB_ADMIN')
    {
      fetch(`http://localhost:8080/api/labs/admin/${user['id']}`)
      .then(response => response.json())
      .then(data => setlabs(data));
    }
    else{
      navigate('/profile');
    }
  }
  , []);


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

        <div className={styles.content}>
          <div className={styles.labGrid}>
            {labs.length==0 && <h2>No Labs Available</h2>}
            {labs.map((lab, index) => (
              <a key={index} href={`/dashboard/${lab.id}`} style={{ textDecoration: 'none', color: 'black' }}>
              <div className={styles.labCard}>
                <h3>{lab.name}</h3>
                <p>Location: {lab.location}</p>
              </div>
              </a>
            ))}
          </div>

          <button className={styles.secondaryButton}>Add New Lab</button>
          <button className={styles.secondaryButton}>Total Stats</button>

        </div>
      </div>
    </div>
  );
};

export default LabDashboard;