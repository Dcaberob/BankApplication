import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TopMenu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => {
      navigate("/login", { replace: true });
      window.location.reload();
    }, 100);
  };

  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <Link class="navbar-brand" to="/">
          CENTRO DE CAPACITACION
        </Link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <Link class="nav-link" to="/home">
                Inicio
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="/balanceInitial">
                Apertura Caja
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="/transaction">
                Transacciones
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="/formularios">
                Formularios
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="/arqueo">
                Cierre Caja
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link" to="/history">
                Historial
              </Link>
            </li>
            <li class="nav-item">
              <button className="nav-link" onClick={handleLogout}>
                Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
