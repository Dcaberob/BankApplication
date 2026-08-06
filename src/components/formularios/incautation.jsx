import React, { useState } from "react";
import { format } from "date-fns";

import IncautacionPDF from "./incautation_pdf";

export default function IncautacionForm() {
  const [formData, setFormData] = useState({
    entidad: "",
    agencia: "",
    fecha: format(new Date(), "yyyy-MM-dd"),
    departamento: "",
    localidad: "",
    ciPortador: "",
    nombrePortador: "",
    apellidoPortador: "",
    telefonoPortador: "",
    billetes: [], // Lista de billetes incautados
  });

  const [billete, setBillete] = useState({
    corte: "",
    numero: "",
    serie: "",
    cantidad: "",
    moneda: "",
    motivo: "",
    tipoFalsificacion: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBilleteChange = (e) => {
    let value = e.target.value;
    if (e.target.type === "number") {
      if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
        value = "";
      }
    }
    setBillete((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  // Agregar billete a la tabla
  const agregarBillete = () => {
    if (
      !billete.corte ||
      !billete.numero ||
      !billete.serie ||
      !billete.cantidad ||
      !billete.moneda ||
      !billete.motivo
    ) {
      alert("Completa todos los campos del billete antes de agregarlo.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      billetes: [...prev.billetes, billete],
    }));

    // Resetear el formulario del billete
    setBillete({
      corte: "",
      numero: "",
      serie: "",
      cantidad: "",
      moneda: "",
      motivo: "",
      tipoFalsificacion: "",
    });
  };

  // Eliminar un billete de la tabla
  const eliminarBillete = (index) => {
    setFormData((prev) => ({
      ...prev,
      billetes: prev.billetes.filter((_, i) => i !== index),
    }));
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    alert("Formulario enviado correctamente");
  };

  return (
    <div className="container">
      <h2 className="text-center mb-2 text-primary">
        Formulario de Incautación
      </h2>

      <form
        className="p-4 border rounded shadow-sm bg-light"
        onSubmit={handleSubmit}
      >
        <div className="row row-cols-1 row-cols-md-2 g-3">
          <div className="col">
            <label className="form-label fw-bold">🏦 Entidad Financiera:</label>
            <input
              type="text"
              className="form-control"
              name="entidad"
              value={formData.entidad}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label fw-bold">🏛 Agencia:</label>
            <input
              type="text"
              className="form-control"
              name="agencia"
              value={formData.agencia}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label fw-bold">📅 Fecha:</label>
            <input
              type="date"
              className="form-control"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label fw-bold">🏛 Departamento:</label>
            <input
              type="text"
              className="form-control"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label fw-bold">📍 Localidad:</label>
            <input
              type="text"
              className="form-control"
              name="localidad"
              value={formData.localidad}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label fw-bold">🆔 C.I. del Portador:</label>
            <input
              type="text"
              className="form-control"
              name="ciPortador"
              value={formData.ciPortador}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label fw-bold">
              👤 Nombre del Portador:
            </label>
            <input
              type="text"
              className="form-control"
              name="nombrePortador"
              value={formData.nombrePortador}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label fw-bold">
              👤 Apellido del Portador:
            </label>
            <input
              type="text"
              className="form-control"
              name="apellidoPortador"
              value={formData.apellidoPortador}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label fw-bold">
              📞 Teléfono del Portador:
            </label>
            <input
              type="text"
              className="form-control"
              name="telefonoPortador"
              value={formData.telefonoPortador}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Tabla para agregar Billetes */}
        <div className="mt-4">
          <h4 className="text-center text-secondary">📜 Billetes Incautados</h4>

          <div className="row row-cols-lg-8 g-2 align-items-end">
            <div className="col">
              <label className="form-label">💰 Moneda:</label>
              <select
                className="form-control"
                name="moneda"
                value={billete.moneda}
                onChange={handleBilleteChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value="Bolivianos">Bolivianos</option>
                <option value="Dólares">Dólares</option>
                <option value="Euros">Euros</option>
              </select>
            </div>

            <div className="col">
              <label className="form-label">💵 Corte:</label>
              <input
                type="number"
                className="form-control"
                name="corte"
                value={billete.corte}
                onChange={handleBilleteChange}
                required
              />
            </div>

            <div className="col">
              <label className="form-label">🔢 Número:</label>
              <input
                type="text"
                className="form-control"
                name="numero"
                value={billete.numero}
                onChange={handleBilleteChange}
                required
              />
            </div>

            <div className="col">
              <label className="form-label">🔢 Serie:</label>
              <input
                type="text"
                className="form-control"
                name="serie"
                value={billete.serie}
                onChange={handleBilleteChange}
                required
              />
            </div>

            <div className="col">
              <label className="form-label">🔢 Cantidad:</label>
              <input
                type="number"
                className="form-control"
                name="cantidad"
                min="0"
                step="any"
                value={billete.cantidad}
                onChange={handleBilleteChange}
                required
              />
            </div>

            <div className="col">
              <label className="form-label">🔢Tipo de Falsificacion:</label>
              <input
                type="text"
                className="form-control"
                name="tipoFalsificacion"
                value={billete.tipoFalsificacion}
                onChange={handleBilleteChange}
                required
              />
            </div>

            <div className="col">
              <label className="form-label">⚠️ Motivo de incautacion:</label>
              <select
                className="form-control"
                name="motivo"
                value={billete.motivo}
                onChange={handleBilleteChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value="falso">Billete falso</option>
                <option value="duplicado">Serie Duplicado</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-success btn-sm mt-2"
            onClick={agregarBillete}
          >
            ➕ Agregar Billete
          </button>

          {/* Tabla de Billetes */}
          {formData.billetes.length > 0 && (
            <table className="table table-striped mt-3">
              <thead className="table-primary">
                <tr>
                  <th>Moneda</th>
                  <th>Corte</th>
                  <th>Número</th>
                  <th>Serie</th>
                  <th>Cantidad</th>
                  <th>Tipo</th>
                  <th>Motivo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {formData.billetes.map((b, index) => (
                  <tr key={index}>
                    <td>{b.moneda}</td>
                    <td>{b.corte}</td>
                    <td>{b.numero}</td>
                    <td>{b.serie}</td>
                    <td>{b.cantidad}</td>
                    <td>{b.tipoFalsificacion}</td>
                    <td>{b.motivo}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarBillete(index)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="d-flex justify-content-center mt-4 gap-3">
          <button
            onClick={() => IncautacionPDF(formData)}
            className="btn btn-primary"
          >
            📄 Descargar PDF
          </button>
        </div>
      </form>
    </div>
  );
}
