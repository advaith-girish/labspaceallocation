import React from 'react';
import './Sidebar.css';

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Lab Management</h2>
            <div className="menu">
                <div className="menu-item">
                    <a href="/" style={{ textDecoration: 'none' , color:'white'}}>HOME</a>
                </div>
                <div className="menu-item">
                    <a href="/labs" style={{ textDecoration: 'none' , color:'white'}}>LAB LAYOUT</a>
                </div>
                <div className="menu-item">
                    <a href="/server-monitoring" style={{ textDecoration: 'none' , color:'white'}}>SERVER MONITORING</a>
                </div>
                <div className="menu-item">
                    <a href="/profile" style={{ textDecoration: 'none' , color:'white'}}>PROFILE</a>
                </div>
                <div className="menu-item logout">
                    <a href="/login" style={{ textDecoration: 'none' , color:'white'}}>Logout</a>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
