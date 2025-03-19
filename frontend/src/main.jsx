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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/labs" element={<Labs/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/book" element={<SeatBookForm/>} />
        <Route path="/profile" element={<StudentProfile/>} />
        <Route path="/server-monitoring" element={(<h1>Coming Soon...</h1>)} />
        <Route path="/forgot-password" element={(<h1>Contact Scene Admin : PGB</h1>)} />
      </Routes>
    </Router>
  </StrictMode>,
)
