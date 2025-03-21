import ReactDOM from 'react-dom/client'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './index.css'
import Dashboard from './Pages/Dashboard'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Relatorios from './Pages/Relatorios'
import Teste from './Pages/Teste'
import Users from './Pages/Users'
import Propostas from './Pages/Propostas'



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
          <Route path="/teste" element={<Teste />} />
          <Route path="/users" element={<Users />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/propostas" element={<Propostas />} />
        </Routes>
      </div>
    </Router>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)