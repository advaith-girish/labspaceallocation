import React, { useEffect, useState } from 'react';
import styles from './SeatBookForm.module.css';

const SeatBookForm = ({ onSubmit,seatUser }) => {
  console.log("SeatBookForm:", seatUser);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (seatUser) {
      setName(seatUser.name || '');  
      setEmail(seatUser.email || '');  
    }
  }, [seatUser]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, email);
  };

  return (
    <div className={styles.containerBook}>
      <form className={styles.formBox} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>Enter name:</label>
          <input
            type="text"
            id="name"
            className={styles.input}
            placeholder="Enter name.."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Enter email:</label>
          <input
            type="email"
            id="email"
            className={styles.input}
            placeholder="Enter email.."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton}>Save</button>
          <button type="button" className={styles.deleteButton}>Delete</button>
        </div>
      </form>
    </div>
  );
};

export default SeatBookForm;
