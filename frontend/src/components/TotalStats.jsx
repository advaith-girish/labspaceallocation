import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import styles from "./TotalStats.module.css";

const TotalStats = () => {
  const navigate = useNavigate();
  const [labs, setLabs] = useState([]);
  const [allocatedSeats, setAllocatedSeats] = useState([]);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/labs");
        const data = await response.json();

        const occupiedSeats = data.flatMap(lab => lab.seats)
          .filter(seat => seat.assignedUser !== null)
          .map(seat => ({
            id: seat.id,
            seatNumber: seat.seatNumber,
            labName: data.find(lab => lab.seats.some(s => s.id === seat.id))?.name || "Unknown Lab",
            studentName: seat.assignedUser.name,
            email: seat.assignedUser.email
          }));

        setLabs(data);
        setAllocatedSeats(occupiedSeats);
      } catch (error) {
        console.error("Error fetching labs:", error);
      }
    };

    fetchLabs();
  }, []);

  // Function to export data as PDF
  const exportPDF = () => {
    if (!allocatedSeats || allocatedSeats.length === 0) {
      alert("No data available to export.");
      return;
    }
  
    const doc = new jsPDF();
  
    // Title Styling
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Lab Seat Allocations", 14, 15);
  
    // Define table headers
    const tableColumn = ["Lab Name", "Seat Number", "Student Name", "Email"];
  
    // Map data into rows
    const tableRows = allocatedSeats.map((seat) => [
      seat.labName,
      seat.seatNumber,
      seat.studentName || "N/A", // Fallback for missing data
      seat.email || "N/A",
    ]);
  
    // Add table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "grid", // Optional: Can use 'striped' or 'plain' as well
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] }, // Custom header color
    });
  
    // Save the PDF
    doc.save("Lab_Seat_Allocations.pdf");
  };

  // Function to export data as CSV
  const exportCSV = () => {
    const csvData = Papa.unparse({
      fields: ["Lab Name", "Seat Number", "Student Name", "Email"],
      data: allocatedSeats.map(seat => [seat.labName, seat.seatNumber, seat.studentName, seat.email])
    });

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Lab_Seat_Allocations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Lab Seat Allocations</h1>
        <button className={styles.backButton} onClick={() => navigate(-1)}>← Back to Dashboard</button>
      </div>

      <div className={styles.statsSummary}>
        <div className={styles.statCard}><h3>Total Labs</h3><p>{labs.length}</p></div>
        <div className={styles.statCard}><h3>Total Seats</h3><p>{labs.reduce((total, lab) => total + lab.seats.length, 0)}</p></div>
        <div className={styles.statCard}><h3>Occupied Seats</h3><p>{allocatedSeats.length}</p></div>
        <div className={styles.statCard}><h3>Utilization</h3>
          <p>{Math.round((allocatedSeats.length / (labs.reduce((total, lab) => total + lab.seats.length, 0) || 1)) * 100)}%</p>
        </div>
      </div>

      <div className={styles.buttons}>
        <button className={styles.exportButton} onClick={exportPDF}>Download PDF</button>
        <button className={styles.exportButton} onClick={exportCSV}>Download CSV</button>
      </div>

      <h2>Allocated Seats ({allocatedSeats.length})</h2>
      <div className={styles.tableContainer}>
        <table className={styles.statsTable}>
          <thead>
            <tr><th>Lab Name</th><th>Seat Number</th><th>Student Name</th><th>Email</th></tr>
          </thead>
          <tbody>
            {allocatedSeats.length > 0 ? allocatedSeats.map(seat => (
              <tr key={seat.id}>
                <td>{seat.labName}</td>
                <td>{seat.seatNumber}</td>
                <td>{seat.studentName}</td>
                <td>{seat.email}</td>
              </tr>
            )) : (
              <tr><td colSpan="4" className={styles.noData}>No seats allocated yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalStats;
