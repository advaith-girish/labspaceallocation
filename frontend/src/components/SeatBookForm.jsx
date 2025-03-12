import React, { useState } from 'react';
import styles from './SeatBookForm.module.css';

const SeatBookForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    console.log('Name:', name);
    console.log('Email:', email);
    // Add save logic here
  };

  const handleDelete = () => {
    console.log('Delete action');
    // Add delete logic here
  };

  const handleBlock = () => {
    console.log('Block action');
    // Add block logic here
  };

  return (
    <div className={styles.container}>
      {/* Form */}
      <div className={styles.formBox}>
        {/* Name Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>Enter name..</label>
          <input
            type="text"
            id="name"
            className={styles.input}
            placeholder="Enter name.."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Enter email..</label>
          <input
            type="email"
            id="email"
            className={styles.input}
            placeholder="Enter email.."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} onClick={handleSave}>Save</button>
          <button className={styles.deleteButton} onClick={handleDelete}>Delete</button>
          <button className={styles.blockButton} onClick={handleBlock}>Block</button>
        </div>
      </div>
    </div>
  );
};

export default SeatBookForm;