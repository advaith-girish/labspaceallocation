import React, { useEffect, useState } from 'react';
import styles from './SeatBookForm.module.css';
<<<<<<< Updated upstream

const SeatBookForm = ({ onSubmit,seatUser }) => {
  console.log("SeatBookForm:", seatUser);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
=======
import {useNavigate} from 'react-router-dom'
const SeatBookForm = ({ onSubmit, seatUser, onUnassign, labId }) => {
  const navigate=useNavigate();
  console.log("SeatBookForm received seatUser:", seatUser);

  const [email, setEmail] = useState(seatUser?.email || '');
  const [name, setName] = useState(seatUser?.name || '');
  const [messages, setMessages] = useState([0, 'Enter name', 'Enter email']);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [assignMode, setAssignMode] = useState("manual"); // Default to manual
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
          <button type="button" className={styles.deleteButton}>Delete</button>
=======
          <button type="button" className={styles.deleteButton} onClick={handleDelete}>Delete</button>
          <br></br>
          <button 
  type="button" 
  className={styles.saveButton} 
  onClick={()=>navigate("/lab_book")}
  style={{ backgroundColor: 'grey', color: 'white'}} // Inline style for grey color
>
  Book Whole Lab
</button>

>>>>>>> Stashed changes
        </div>
        
      </form>
    </div>
  );
};

export default SeatBookForm;
