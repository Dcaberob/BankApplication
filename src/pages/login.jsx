import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../src/rest/resquest_api";
import "./login.css";

export default function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await loginRequest(formData);

      if (response && response.status === 200) {
        const { user } = response.data;

        localStorage.setItem("token", response.data.user.access_token);
        localStorage.setItem("user", JSON.stringify(user));

        setIsAuthenticated(true);

        alert("Inicio de sesión exitoso!");

        // 🔄 Esperar 100ms antes de redirigir
        setTimeout(() => {
          navigate(user.role === "admin" ? "/dashboard" : "/home");
        }, 100);
      } else {
        setError(response.message || "Credenciales inválidas.");
      }
    } catch (err) {
      setError("Ocurrió un error, por favor intente más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="vh-100 bg-light d-flex align-items-center justify-content-center">
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-xl-10">
            <div className="card rounded-4 text-black shadow-lg border-0 overflow-hidden">
              <div className="row g-0">
                
                {/* Columna Izquierda: Formulario */}
                <div className="col-lg-6 bg-white d-flex align-items-center">
                  <div className="card-body p-4 p-md-5 mx-md-3 w-100">
                    
                    {/* Logo / Imagen */}
                    <div className="text-center mb-4">
                      <img
                        src="/files/ADI2.jpeg"
                        alt="Operación Bancaria"
                        className="img-fluid rounded-3 shadow-sm"
                        style={{ maxHeight: "120px", objectFit: "contain" }}
                      />
                      <h4 className="mt-3 mb-1 text-primary fw-bold">Bienvenido</h4>
                      <p className="text-muted small">Ingresa tus credenciales para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                      {/* Campo Usuario */}
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          id="username"
                          name="username"
                          placeholder="Ingrese su usuario"
                          className="form-control"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="username">Usuario</label>
                      </div>

                      {/* Campo Contraseña */}
                      <div className="form-floating mb-4">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          placeholder="Ingrese su contraseña"
                          className="form-control"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="password">Contraseña</label>
                      </div>

                      {/* Botón de Enviar */}
                      <div className="d-grid gap-2 mb-3">
                        <button
                          className="btn btn-primary btn-lg shadow-sm"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Cargando...
                            </>
                          ) : (
                            "Iniciar Sesión"
                          )}
                        </button>
                      </div>
                    </form>

                  </div>
                </div>

                {/* Columna Derecha: Panel Informativo */}
                <div className="col-lg-6 d-flex align-items-center bg-primary bg-gradient text-white p-4 p-md-5">
                  <div className="px-2 py-3">
                    <h3 className="fw-bold mb-3">Capacitación de Excelencia</h3>
                    <p className="lead fs-6 lh-base opacity-90">
                      Impulsamos el desarrollo profesional en Bolivia a través de capacitaciones 
                      de vanguardia en Banca, Finanzas y Tributación. Gracias a nuestras alianzas 
                      estratégicas, diseñamos programas formativos de alta demanda e innovación con 
                      estándares internacionales. Nos transformamos día a día para ser tu centro de 
                      entrenamiento de referencia y excelencia académica.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
