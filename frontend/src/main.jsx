import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Dashboard from './components/Dashboard.jsx'
import Labs from './components/Labs.jsx'
import Login from './components/Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/labs" element={<Labs/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  </StrictMode>,
)