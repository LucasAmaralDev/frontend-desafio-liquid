import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './index.css'
import Dashboard from './Pages/Dashboard'
import Login from './Pages/Login'
import Register from './Pages/Register'




const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)