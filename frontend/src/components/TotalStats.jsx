import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TotalStats.module.css';

const TotalStats = () => {
  const { labId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSeats: 0,
    occupiedSeats: 0,
    students: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/labs/${labId}/stats`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [labId]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Lab Statistics</h1>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ← Back to Layout
        </button>
      </div>

      <div className={styles.statsSummary}>
        <div className={styles.statCard}>
          <h3>Total Seats</h3>
          <p>{stats.totalSeats}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Occupied Seats</h3>
          <p>{stats.occupiedSeats}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Utilization</h3>
          <p>{Math.round((stats.occupiedSeats / stats.totalSeats) * 100) || 0}%</p>
        </div>
      </div>

      <h2>Allocated Students ({stats.students.length})</h2>
      <div className={styles.tableContainer}>
        <table className={styles.statsTable}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Seat Number</th>
              <th>Email</th>
              <th>Allocation Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.seatNumber}</td>
                <td>{student.email}</td>
                <td>{new Date(student.allocationDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalStats;