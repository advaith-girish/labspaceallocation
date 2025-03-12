import React, { useState } from 'react';
import './LabLayout.css';

const LabLayout = () => {
  // Define the lab layout structure
  const labStructure = [
    { row: 1, computers: [1, 1, 0] },
    { row: 2, computers: [0, 1, 1] },
    { row: 3, computers: [1, 0, 1] },
  ];

  const [labStatus, setLabStatus] = useState(labStructure);

  // Toggle computer status (Red = Active, White = Inactive)
  const toggleComputer = (rowIndex, compIndex) => {
    const updatedLab = labStatus.map((row, r) => ({
      ...row,
      computers: row.computers.map((status, c) =>
        r === rowIndex && c === compIndex ? (status ? 0 : 1) : status
      ),
    }));
    setLabStatus(updatedLab);
  };

  return (
    <div className="lab-container">
      {labStatus.map((row, rowIndex) => (
        <div key={rowIndex} className="table">
          {row.computers.map((status, compIndex) => (
            <button
              key={compIndex}
              className={`computer ${status ? 'active' : 'inactive'}`}
              onClick={() => toggleComputer(rowIndex, compIndex)}
            >
              💻
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LabLayout;
