import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")).username;

  const handleClickBalance = () => navigate("/balanceInitial");
  const handleClickDashBoard = () => navigate("/dashboard");
  const handleClickArqueo = () => navigate("/arqueo");
  const handleClickTransaction = () => navigate("/transaction");
  const handleClickHistory = () => navigate("/history");
  const handleClickFormularios = () => navigate("/formularios");
  const handleClickLogOut = () => {
    localStorage.clear();
    setTimeout(() => {
      navigate("/login", { replace: true });
      window.location.reload();
    }, 100);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-7 mt-3 d-flex justify-content-center align-items-center">
          <img
            src="/files/ADI1.jpg"
            alt="Operación Bancaria"
            className="img-fluid rounded shadow"
            style={{ maxHeight: "500px" }}
          />
        </div>
        <div className="col-md-5">
          <h1 className="mb-4 text-center">Seleccione la Operación Bancaria</h1>
          <div className="d-grid gap-3">
            {user === "admin" && (
              <button
                className="btn btn-primary btn-lg"
                onClick={handleClickDashBoard}
              >
                DashBoard
              </button>
            )}
            <button
              className="btn btn-primary btn-lg"
              onClick={handleClickBalance}
            >
              Apertura de Caja
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleClickTransaction}
            >
              Transacciones
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleClickFormularios}
            >
              Formularios
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleClickArqueo}
            >
              Cierre de Caja
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleClickHistory}
            >
              Historial
            </button>
            <button
              className="btn btn-danger btn-lg"
              onClick={handleClickLogOut}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-7 text-center"></div>
      </div>
    </div>
  );
}
