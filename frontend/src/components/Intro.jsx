import React from 'react';
import './Intro.css';
import Sidebar from './Sidebar';
function Intro() {
    return (
        <>
            <div style={{ display: 'flex' }}>
                <Sidebar/>

                <div className="main-content">
                    <div className="header">
                        <h1>Dashboard</h1>
                        <div className="header-right">
                            <div>PROFILE</div>
                            <button className="logout-button">Logout</button>
                        </div>
                    </div>

                    <div className="card-grid">
                        <div className="card"><h3>Overview Matrix</h3></div>
                        <div className="card"><h3>Lab Space Management</h3></div>
                        <div className="card"><h3>Allocations</h3></div>
                        <div className="card"><h3>Server Monitoring</h3></div>
                        <div className="card"><h3>Notifications</h3></div>
                        <div className="card"><h3>Reports</h3></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Intro;
