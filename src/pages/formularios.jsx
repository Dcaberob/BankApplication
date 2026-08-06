import React, { useState, useEffect } from "react";
import "./FileList.css"
import PCC01Form from "../components/formularios/pcc.jsx"
import IncautacionForm from "../components/formularios/incautation.jsx"

export default function Formularios() {
  const [files, setFiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showIncForm, setShowIncForm] = useState(false);

  const getFileIcon = (type) => {
    switch (type) {
      case "PDF":
        return "📄";
      case "Word":
        return "📝";
      case "Imagen":
        return "🖼";
      case "ZIP":
        return "📦";
      default:
        return "📁";
    }
  };

  useEffect(() => {
    setFiles([
      { name: "PCC-01", type: "PDF", url: "/files/PCC-01.pdf" },
      {
        name: "Incautacion Monedas Billetes",
        type: "PDF",
        url: "/files/incautacion.pdf",
      },
    ]);
  }, []);

  return (
    <div className="container mt-5">
    <h2 className="text-center mb-4 text-primary">📂 Archivos Disponibles</h2>
    <div className="w-100"></div>

    {files.map((file, index) => (
      <div key={index} className="col-md-6 p-3">
        <div className="card shadow-sm mb-4 border-0 hover-card">
          <div className="card-body text-center">
            <h1 className="file-icon">{getFileIcon(file.type)}</h1>
            <h5 className="card-title mt-2">{file.name}</h5>
            <p className="card-text">
              <span className="badge bg-secondary p-2">{file.type}</span>
            </p>
            <a
              href={file.url}
              download
              className="btn btn-outline-primary btn-sm me-2"
            >
              📥 Descargar
            </a>

            {file.name === "PCC-01" && (
              <button
                className="btn btn-success btn-sm"
                onClick={() => setShowForm(true)}
              >
                📝 Llenar Formulario
              </button>
            )}
            {file.name === "Incautacion Monedas Billetes" && (
              <button
                className="btn btn-success btn-sm"
                onClick={() => setShowIncForm(true)}
              >
                📝 Llenar Formulario
              </button>)}
          </div>
        </div>
      </div>
    ))}

    
{showForm && (
  <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header bg-primary text-white">
          <div>
            <h5 className="modal-title fw-bold">Formulario PCC-01</h5>
            <p className="mb-0">Complete los datos requeridos para registrar la operación.</p>
          </div>
          <button className="btn-close btn-close-white" onClick={() => setShowForm(false)}></button>
        </div>

        <div className="modal-body">
          <PCC01Form />
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
        </div>
      </div>
    </div>
  </div>
)}
{showIncForm && (
  <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-xl">
      <div className="modal-content">
        <div className="modal-header bg-primary text-white">
          <div>
            <h5 className="modal-title fw-bold">Formulario Incautacion de monedas y billetes</h5>
            <p className="mb-0">Complete los datos requeridos para registrar la operación.</p>
          </div>
          <button className="btn-close btn-close-white" onClick={() => setShowIncForm(false)}></button>
        </div>

        <div className="modal-body">
          <IncautacionForm />
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowIncForm(false)}>Cancelar</button>
        </div>
      </div>
    </div>
  </div>
)}

  </div>
);
}