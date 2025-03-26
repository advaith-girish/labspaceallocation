import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './Whole_lab.css'; // Import the external CSS file

const Lab_Booking = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleBooking = () => {
    // Use navigate to go to the Google Sheets URL
    window.location.href = 'https://docs.google.com/spreadsheets/d/1FprGQa9bwRsfINA6k4n3_24Z2J63kgSnqO9QdWU_qdk/edit?pli=1&gid=0#gid=0';

    // Optionally, you can navigate to another route in the app after some action
    // For example, navigate("/another-route");
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="heading">Lab Allocation</h1>
        <p className="paragraph">
          Our lab is available for booking by groups. If you'd like to reserve the whole lab, 
          click the button below to fill in your details.
        </p>
        <p className="paragraph">
          You will be redirected to a Google Spreadsheet where you can submit your booking request.
        </p>

        <button 
          className="button"
          onClick={handleBooking} // Call handleBooking function on button click
        >
          Book Whole Lab
        </button>
      </div>
    </div>
  );
};

export default Lab_Booking;
