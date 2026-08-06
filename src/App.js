import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './App.css';
import Home from './pages/home';
import InitialBalance from './pages/initial_balance';
import Arqueo from "./pages/arqueo";
import Formularios from "./pages/formularios";
import Transaction from "./pages/transaction";
import Login from "./pages/login";
import History from "./pages/history";
import Dashboard from "./pages/dashboard";
import Navbar from "./components/navbar";
import ProtectedRoute from "./components/protected_route";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // 🔥 Revisar el token en localStorage
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setIsAuthenticated(true);
      setUserRole(user.role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Página de Login */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

        {/* 🔐 Rutas protegidas */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/balanceInitial" element={<><Navbar /><InitialBalance /></>} />
          <Route path="/arqueo" element={<><Navbar /><Arqueo /></>} />
          <Route path="/transaction" element={<><Navbar /><Transaction /></>} />
          <Route path="/history" element={<><Navbar /><History /></>} />
          <Route path="/formularios" element={<><Navbar /><Formularios /></>} />
        </Route>

        {/* ✅ Redirigir rutas desconocidas siempre al login */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
