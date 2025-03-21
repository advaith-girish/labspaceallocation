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
import AddLab from './components/AddLab.jsx'
import ListLabs from './components/ListLabs.jsx'
import Notifications from './components/Notifications.jsx'
import TotalStats from './components/TotalStats.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/labs" element={<Labs/>} >
          <Route index element={<ListLabs/>} />
          <Route path="addlab" element={<AddLab/>} />
        </Route>
        <Route path="/login" element={<Login/>} />
        <Route path="/book" element={<SeatBookForm/>} />
        <Route path="/profile" element={<StudentProfile/>} />
        <Route path="/server-monitoring" element={<ServerMonitoring/>} />  
        <Route path="/notifications" element={<Notifications/>} />
        <Route path="/totalstats" element={<TotalStats/>} />
        <Route path="/forgot-password" element={(<h1>Contact Scene Admin : PGB</h1>)} />
        <Route path="/totalstats" element={<TotalStats/>} />
      </Routes>
    </Router>
  </StrictMode>,
)
