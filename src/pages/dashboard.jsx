import React, { useState, useEffect } from "react";
import Users from "../components/adm/users";
import Transactions from "../components/adm/transactions";
import DashboardAdmin from "../components/adm/dashboard_admin";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Balance from "../components/adm/balance";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  // Función para manejar el cambio de página
  const handleNavigation = (page) => {
    setActivePage(page);
  };

  // Contenido dinámico según la página activa
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardAdmin />;
      case "transactions":
        return <Transactions />;
      case "users":
        return <Users />;
      case "balance":
        return <Balance />;
      default:
        return <DashboardAdmin />;
    }
  };

  const handleClickHome = () => navigate("/home");
  const handleClickLogout = () => {
    localStorage.clear();
    navigate("/login")};

  return (
    <div className="d-flex">
      <div
        className="bg-dark text-white p-3 vh-100 d-flex flex-column"
        style={{ width: "250px" }}
      >
        <h4 className="text-center">ADMIN PANEL</h4>
        <nav className="nav flex-column mt-5">
          <button
            className={`btn btn-link text-white text-start ${
              activePage === "dashboard" && "fw-bold text-primary"
            }`}
            onClick={() => handleNavigation("dashboard")}
          >
            <i className="fas fa-chart-line me-2"></i> DASHBOARD
          </button>
          <button
            className={`btn btn-link text-white text-start ${
              activePage === "transactions" && "fw-bold text-primary"
            }`}
            onClick={() => handleNavigation("transactions")}
          >
            <i className="fas fa-exchange-alt me-2"></i> TRANSACTIONS
          </button>
          <button
            className={`btn btn-link text-white text-start ${
              activePage === "users" && "fw-bold text-primary"
            }`}
            onClick={() => handleNavigation("users")}
          >
            <i className="fas fa-users me-2"></i> USERS
          </button>
          <button
            className={`btn btn-link text-white text-start ${
              activePage === "balance" && "fw-bold text-primary"
            }`}
            onClick={() => handleNavigation("balance")}
          >
            <i className="fas fa-wallet me-2"></i> BALANCES
          </button>
          <button
            className="btn btn-outline-light mt-auto"
            onClick={handleClickHome}
          >
            <i className="fas fa-home me-2"></i> HOME
          </button>
          <button className="btn btn-danger mt-4" onClick={handleClickLogout}>
            <i className="fas fa-sign-out-alt me-2"></i> Logout
          </button>
        </nav>
      </div>

      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h3>Admin panel</h3>
          <button className="btn btn-danger" onClick={handleClickLogout}>
            Logout
          </button>
        </div>
        <div className="mt-4">{renderContent()}</div>
      </div>
    </div>
  );
}
