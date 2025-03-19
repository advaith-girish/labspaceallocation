import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Dashboard from './components/Dashboard.jsx'
import Labs from './components/Labs.jsx'
import Login from './components/Login.jsx'
import SeatBookForm from './components/SeatBookForm.jsx'
import StudentProfile from './components/StudentProfile.jsx'
import ServerMonitoring from './components/ServerMonitoring.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/labs" element={<Labs/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/book" element={<SeatBookForm/>} />
        <Route path="/profile" element={<StudentProfile/>} />
        <Route path="/server-monitoring" element={<ServerMonitoring/>} />  
      </Routes>
    </Router>
  </StrictMode>,
)
