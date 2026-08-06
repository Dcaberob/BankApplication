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
    <section class="h-100 gradient-form" >
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-xl-10">
            <div class="card rounded-3 text-black">
              <div class="row g-0">
                <div class="col-lg-6">
                  <div class="card-body p-md-5 mx-md-4">
                    
                    <div class="text-center">
                      
                      <h3 class="mt-1 mb-5 pb-1">ADI Academic Training</h3>
                    </div>  
                      <form onSubmit={handleSubmit}>
                        <p>Introduzca su usuario</p>
                        <div data-mdb-input-init class="form-outline mb-4">
                            <input type="text" id="username" name="username" placeholder="Ingrese su usuario" className="form-control" value={formData.username} onChange={handleInputChange} required />
                            <label class="form-label" for="form2Example11">Username</label>
                        </div>
                        <div data-mdb-input-init class="form-outline mb-4">
                            <input type="password" id="password" name="password" placeholder="Ingrese su contraseña" className="form-control" value={formData.password} onChange={handleInputChange} required />
                            <label class="form-label" for="form2Example22">Password</label>
                        </div>
                        <div class="text-center pt-1 mb-5 pb-1">
                          <button className="btn btn-primary btn-block fa-lg mb-3" type="submit" disabled={isLoading}>
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </button>
                        </div>
                      </form>
                    
                  </div>
                  
                </div>
                <div class="col-lg-6 d-flex align-items-center bg-gradient-bank">
              <div class="text-white px-3 py-4 p-md-5 mx-md-4">
                <p className="small px-3 fs-5">
                  <i>Impulsamos el desarrollo profesional en Bolivia a través de capacitaciones de vanguardia en Banca, Finanzas y Tributación. Gracias a nuestras alianzas estratégicas, diseñamos programas formativos de alta demanda e innovación con estándares internacionales. Nos transformamos día a día para ser tu centro de entrenamiento de referencia y excelencia académica.</i></p>
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