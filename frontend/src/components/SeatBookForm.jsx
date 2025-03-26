import React, { useState, useEffect } from 'react';
import styles from './SeatBookForm.module.css';

import {useNavigate} from 'react-router-dom'
import { sendEmail } from '../utils/sendEmail';

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

  useEffect(() => {
    if (seatUser) {
      setName(seatUser.name || '');
      setEmail(seatUser.email || '');
      setMessages([1, 'Booked Username', 'Booked Email']);
    }
  }, [seatUser]);

  useEffect(() => {
    if (labId) {
      fetch(`http://localhost:8080/api/labs/${labId}`)
        .then(response => response.json())
        .then(data => {
          const seats = data.seats.filter(seat => !seat.assignedUser);
          setAvailableSeats(seats);
        })
        .catch(error => console.error("Error fetching seats:", error));

      fetch(`http://localhost:8080/api/seat-requests/pending/${labId}`)
        .then(response => response.json())
        .then(data => {
          const requests = data.filter(req => req.lab.id === parseInt(labId));
          setPendingRequests(requests);
        })
        .catch(error => console.error("Error fetching requests:", error));
    }
  }, [labId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (assignMode === "requested" && selectedStudent && selectedSeat) {
      handleAssignSeat();
    } else {
      onSubmit(name, email);
    }
  };

  const handleDelete = () => {
    if (seatUser) {
      onUnassign();
    } else {
      alert("No user assigned to this seat.");
    }
  };

  const handleAssignSeat = async () => {
    if (!selectedStudent || !selectedSeat) {
      alert("Please select a student and a seat.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/seats/${selectedSeat}/assign/${selectedStudent}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to assign seat");

      await sendEmail(email);

      alert("Seat assigned successfully!");
      setPendingRequests(pendingRequests.filter(req => req.studentEmail !== selectedStudent));
      setSelectedStudent("");
      setSelectedSeat("");
    } catch (error) {
      console.error("Error assigning seat:", error);
    }
  };

  return (
    <div className={styles.containerBook}>
      <form className={styles.formBox} onSubmit={handleSubmit}>

        {/* Radio Buttons */}
        {!seatUser && <div className={styles.radioGroup}>
          <div>
            <label htmlFor='manual'>Manual Entry</label>
            <input
              id='manual'
              type="radio"
              value="manual"
              checked={assignMode === "manual"}
              onChange={() => setAssignMode("manual")}
            />
          </div>

          <div>
            <label>Select Requested User</label>
            <input
              type="radio"
              value="requested"
              checked={assignMode === "requested"}
              onChange={() => setAssignMode("requested")}
            />
          </div>

        </div>}

        {assignMode === "manual" ? (
          <>
            {/* Manual Booking */}
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>{messages[1]}</label>
              {!messages[0] ? (
                <input
                  type="text"
                  id="name"
                  className={!messages[0] ? styles.input : styles.inputNoEdit}
                  placeholder="Enter name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              ) : (
                <input className={!messages[0] ? styles.input : styles.inputNoEdit} value={name} readOnly />
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>{messages[2]}</label>
              {!messages[0] ? (
                <input
                  type="email"
                  id="email"
                  className={!messages[0] ? styles.input : styles.inputNoEdit}
                  placeholder="Enter email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <input className={!messages[0] ? styles.input : styles.inputNoEdit} value={email} readOnly />
              )}
            </div>
          </>
        ) : (
          <>
            <div className={styles.inputGroup}>
              <label>Select Student:</label>
              <select
                value={selectedStudent}
                onChange={(e) => {
                  const selectedEmail = e.target.value;
                  setSelectedStudent(selectedEmail);

                  const student = pendingRequests.find(req => req.studentEmail === selectedEmail);

                  if (student) {
                    setName(student.studentName);
                    setEmail(student.studentEmail);
                  }
                }}
              >
                <option value="">Select a Student</option>
                {pendingRequests.map(req => (
                  <option key={req.id} value={req.studentEmail}>
                    {req.studentName} ({req.studentEmail})
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton}>Save</button>
          <button type="button" className={styles.deleteButton} onClick={handleDelete}>Delete</button>
          <br></br>
          <button 
  type="button" 
  className={styles.saveButton} 
  onClick={()=>navigate("/lab_book")}
  style={{ backgroundColor: 'grey', color: 'white'}}>
  Book Whole Lab </button>

        </div>
        
      </form>
    </div>
  );
};

export default SeatBookForm;
