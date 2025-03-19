import React, { useState, useEffect } from 'react';
import styles from './SeatBookForm.module.css';

const   SeatBookForm = ({ onSubmit, seatUser, onUnassign }) => {
  console.log("SeatBookForm received seatUser:", seatUser);

  const [email, setEmail] = useState(seatUser?.email || '');
  const [name, setName] = useState(seatUser?.name || '');
  const [messages, setMessages] = useState([0,'Enter name', 'Enter email']); // 0 if no user , 1 if user alloted

  useEffect(() => {
    if (seatUser) {
      setName(seatUser.name || '');
      setEmail(seatUser.email || '');
      setMessages([1,'Booked Username', 'Booked Email']);
    }
  }, [seatUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, email);
  };


  const handleDelete = () => {
    if (seatUser) {
      onUnassign(); 
    } else {
      alert("No user assigned to this seat.");
    }
  };

  return (
    <div className={styles.containerBook}>
      <form className={styles.formBox} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>{messages[1]}</label>
          {!messages[0] ? <input
            type="text"
            id="name"
            className={styles.input}
            placeholder="Enter name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          /> : <input
          className={styles.input}
          value={name}
        />}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>{messages[2]}</label>
          {!messages[0] ? <input
            type="email"
            id="email"
            className={styles.input}
            placeholder="Enter email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /> : <input
          className={styles.input}
          value={email}
        />}
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton}>Save</button>
          <button type="button" className={styles.deleteButton} onClick={handleDelete}>Delete</button>
        </div>
      </form>
    </div>
  );
};

export default SeatBookForm;
