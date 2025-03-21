import React from 'react';
import './Intro.css';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';
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
                        <Link to="/totalstats" className="card"><h3>Allocations</h3></Link>
                        <Link to="/notifications" className="card"><h3>Notifications</h3></Link>
                        <Link to="/server-monitoring" className="card"><h3>Server Monitoring</h3></Link>
                        {/* <div className="card"><h3>Notifications</h3></div> */}

                    </div>
                </div>
            </div>
        </>
    );
}

export default Intro;
