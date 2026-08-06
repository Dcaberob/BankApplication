import React, { useState } from "react";
import { format } from "date-fns";
import generatePCC01PDF from "./pcc_pdf"


export default function PCC01Form() {
  const operations = [
    { id: 1, name: "Cuenta Corriente"},
    { id: 2, name: "Caja de Ahorro"},
    { id: 3, name: "DPF"},
    { id: 4, name: "Giros/Transferencias"},
    { id: 5, name: "Moneda Extranjera"},
    { id: 6, name: "Compra de Cheques"},
    { id: 7, name: "Creditos Personales"},
    { id: 8, name: "Creditos Comerciales"},
    { id: 10, name: "Tarjetas Prepagadas"},
    { id: 11, name: "Boletas de Garantia"},
    { id: 12, name: "Carta de Credito" },
    { id: 9, name: "Tarjetas de Creditos"},
    ];
  const detalle = [
    { id: 1, name: "Deposito"},
    { id: 2, name: "Recibido"},
    { id: 3, name: "Compra"},
    { id: 4, name: "Bancario"},
    { id: 5, name: "Cancelacion"},
    { id: 6, name: "Emision"},
    { id: 7, name: "Carga"},
    { id: 8, name: "Retiro"},
    { id: 10, name: "Enviado"},
    { id: 11, name: "Venta"},
    { id: 12, name: "Viajero" },
    { id: 9, name: "Amortizacion"},
    { id: 13, name: "Ejecucion"},
    { id: 14, name: "Recarga"},
    { id: 15, name: "Cobro de Cheque"},
    ];

  const [formData, setFormData] = useState({
    oficina: "",
    ciudad: "",
    fecha: format(new Date(), "yyyy-MM-dd"),
    razonSocial: "",
    direccion: "",
    zona: "",
    formaOperacion: "",
    montoNumeral: "",
    montoLiteral: "",
    moneda: "",
    tipoOperacion: "",
    detalleOperacion: "",
    cuentaOrigen: "",
    monedaOrigen: "",
    cuentaDestino: "",
    monedaDestino: "",
    origenRecursos: "",
    destinoRecursos: "",
    nombreDeclarante: "",
    apellidoDeclarante: "",
    ciDeclarante: "",
    extensionDeclarante: "",
    nacionalidadDeclarante: "",
    paisResidente: "",
    profesion: "",
    actividad: "",
    direccionDeclarante: "",
    empresaTrabajo: "",
    cargo: "",
    propio: false,
    nombre:"",
    apellido:"",
    ciProp:"",
    extensionProp:"",
    NitProp:"",
    actividadEconomica:"",
    razonSocialPropietario:"",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;
    if (type === "number") {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue < 0) {
        newValue = ""; 
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    alert("Formulario enviado correctamente.");
  };

  return (
    <div className="container mt">
      <h2 className="text-center mb-2 text-primary">
        Formulario PCC-01.
      </h2>
      <form onSubmit={handleSubmit} className="p-4 bg-light shadow rounded">
        
        <div className="row">
          <div className="col-md-4">
            <label className="form-label">Oficina/Agencia:</label>
            <input type="text" className="form-control" name="oficina" value={formData.oficina} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Ciudad:</label>
            <input type="text" className="form-control" name="ciudad" value={formData.ciudad} onChange={handleChange} />
          </div>
          <div className="col-md-4">
          <div className="col">
            <label className="form-label">📅 Fecha:</label>
            <input
              type="date"
              className="form-control"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
            />
          </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-6">
            <label className="form-label">Razón Social:</label>
            <input type="text" className="form-control" name="razonSocial" value={formData.razonSocial} placeholder="Razon social o Nombre del banco" onChange={handleChange}/>
          </div>
          <div className="mt-3">
            <label className="form-label">Dirección:</label>
            <input type="text" className="form-control" name="direccion" value={formData.direccion} placeholder="Direccion del Banco" onChange={handleChange} />
          </div>
        </div>

        

        <div className="row mt-3">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre del Declarante:</label>
            <input type="text" className="form-control" name="nombreDeclarante" value={formData.nombreDeclarante} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Apellido del Declarante:</label>
            <input type="text" className="form-control" name="apellidoDeclarante" value={formData.apellidoDeclarante} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">C.I.:</label>
            <input type="text" className="form-control" name="ciDeclarante" value={formData.ciDeclarante} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Extensión:</label>
            <input type="text" className="form-control" name="extensionDeclarante" value={formData.extensionDeclarante} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Nacionalidad:</label>
            <input type="text" className="form-control" name="nacionalidadDeclarante" value={formData.nacionalidadDeclarante} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Residencia:</label>
            <input type="text" className="form-control" name="paisResidente" value={formData.paisResidente} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Dirección:</label>
            <input type="text" className="form-control" name="direccionDeclarante" value={formData.direccionDeclarante} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Profesion:</label>
            <input type="text" className="form-control" name="profesion" value={formData.profesion} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Actividad:</label>
            <input type="text" className="form-control" name="actividadEconomica" value={formData.actividadEconomica} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Empresa:</label>
            <input type="text" className="form-control" name="empresaTrabajo" value={formData.empresaTrabajo} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Cargo:</label>
            <input type="text" className="form-control" name="cargo" value={formData.cargo} onChange={handleChange} />
          </div>
          
        </div>
        <div className="row">
          <div className="col-md-12 mb-3">
            <p className="mb-1 fw-semibold">
              El dinero de la presente operación es de su propiedad:</p>
            <div className="form-check d-flex align-items-center gap-2">
                <input type="checkbox" className="form-check-input" name="propio" id="propioCheck" checked={formData.propio} onChange={handleChange}/> <label className="form-check-label mb-0" 
                  htmlFor="propioCheck"> Sí </label>
            </div>
          </div>
        </div>

        {!formData.propio && (
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">👤 Nombre del Propietario:</label>
              <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">👤 Apellido del Propietario:</label>
              <input type="text" className="form-control" name="apellido" value={formData.apellido} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">CI del Propietario:</label>
              <input type="text" className="form-control" name="ciProp" value={formData.ciProp} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">NIT del Propietario:</label>
              <input type="text" className="form-control" name="NitProp" value={formData.NitProp} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">🏢 Extension del Propietario:</label>
              <input type="text" className="form-control" name="extensionProp" value={formData.extensionProp} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">🏢 Razón Social:</label>
              <input type="text" className="form-control" name="razonSocialPropietario" value={formData.razonSocialPropietario} onChange={handleChange} />
            </div>
            
            <div className="col-md-6 mb-3">
              <label className="form-label">Actividad Economica:</label>
              <input type="text" className="form-control" name="actividad" value={formData.actividad} onChange={handleChange} />
            </div>
          </div>
        )}
        <div className="row mt-3">
        <div className="col-md-6 mb-3">
            <label className="form-label">🔄 Forma de Operación:</label>
            <select className="form-control" name="formaOperacion" value={formData.formaOperacion} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia Propia Cuenta">Transferencia Propia Cuenta</option>
              <option value="Transferencia Otras Cuenta">Transferencia Otras Cuenta</option>
              <option value="Cheque Propia">Cheque Propia</option>
              <option value="Cheque Ajena">Cheque Ajena</option>

            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Moneda de la Operacion:</label>
            <select className="form-control" name="moneda" value={formData.moneda} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Bolivianos">Bolivianos</option>
              <option value="Dolares">Dolares</option>
              <option value="Otra">Otra</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Monto Numeral:</label>
            <input type="number" className="form-control" 
            min="0"  
            step="any"
            name="montoNumeral" value={formData.montoNumeral} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Monto Literal:</label>
            <input type="text" className="form-control" name="montoLiteral" value={formData.montoLiteral} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">🔄 Tipo de Operación:</label>
            <select className="form-control" name="tipoOperacion" value={formData.tipoOperacion} onChange={handleChange} required>
            <option value="">Selecciona una opción</option>
                {operations.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">🔄 Detalle de Operación:</label>
            <select className="form-control" name="detalleOperacion" value={formData.detalleOperacion} onChange={handleChange} required>
            <option value="">Selecciona una opción</option>
                {detalle.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-6">
            <label className="form-label">Cuenta Origen:</label>
            <input type="text" className="form-control" name="cuentaOrigen" value={formData.cuentaOrigen} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Moneda Origen:</label>
            <select className="form-control" name="monedaOrigen" value={formData.monedaOrigen} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Bolivianos">Bolivianos</option>
              <option value="Dolares">Dolares</option>
              <option value="Otra">Otra</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Cuenta Destino:</label>
            <input type="text" className="form-control" name="cuentaDestino" value={formData.cuentaDestino} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Moneda Destino:</label>
            <select className="form-control" name="monedaDestino" value={formData.monedaDestino} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Bolivianos">Bolivianos</option>
              <option value="Dolares">Dolares</option>
              <option value="Otra">Otra</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Origen de los Recursos:</label>
            <input type="text" className="form-control" name="origenRecursos" value={formData.origenRecursos} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Destino de los Recursos:</label>
            <input type="text" className="form-control" name="destinoRecursos" value={formData.destinoRecursos} onChange={handleChange} />
          </div>
        </div>

        

        <button onClick={() => generatePCC01PDF(formData)} className="btn btn-primary">
  📄 Descargar PDF
</button>
      </form>
    </div>
  );
}
