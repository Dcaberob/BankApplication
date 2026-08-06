import React, { useState, useEffect } from "react";
import TransactionRegister from "../components/transaction_register";
import { addTransactionRequest,  getExchangeDollar } from "../rest/resquest_api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ObjectId } from "bson";
import { cy, tr } from "date-fns/locale";
import AlertModal from "../components/alert_modal";

export default function Transaction() {
  const names = [
    { id: 1, name: "Compra Dolar", output: "in" },
    { id: 2, name: "Venta Dolar", output: "out" },
    { id: 3, name: "Deposito", output: "in" },
    { id: 4, name: "Retiro", output: "out" },
    { id: 5, name: "Envio de Giro", output: "in" },
    { id: 6, name: "Pago de Giro", output: "out" },
    { id: 13, name: "Pago Gestora", output: "in" },
    { id: 14, name: "Cobro de Impuestos", output: "in" },
    { id: 15, name: "Canje o Fraccionamiento", output: "in" },
    { id: 7, name: "Servicio", output: "in" },
    { id: 8, name: "Cobro Credito", output: "in" },
    { id: 9, name: "Pago de Cheque", output: "out" },
    { id: 10, name: "Deposito de Cheque", output: "in" }, // verificar que no sume en total de transactions, egreso e ingreso.
    { id: 11, name: "Aumento de Efectivo(Tesoreria)", output: "in" },
    { id: 12, name: "Disminucion de Efectivo(Tesoreria)", output: "out" },
  ];

  const serviceOptions = [
    "Luz(ELFEC)",
    "Agua(SEMAPA)",
    "Teléfono(COMTECO)",
    "Celular(ENTEL)",
    "Internet(TIGO,AXES,ENTEL,VIVA)",
    "Gas(YPFB)",
  ];

  const giroOptions = ["Nacional", "Extranjero"];
  const impuestoOptions = [
    "Ruat Inmuebles",
    "Ruat Vehiculos",
    "Impuestos Nacionales",
  ];
  const [cantidades, setCantidades] = useState({});
  const [name, setName] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedGiro, setSelectedGiro] = useState("");
  const [selectedImpuesto, setSelectedImpuesto] = useState("");
  const [registros, setRegistros] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  const [showBalanceWarning, setShowBalanceWarning] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [saldo, setSaldo] = useState(() => {
    const savedSaldo = localStorage.getItem("saldo");
    return savedSaldo ? JSON.parse(savedSaldo) : { bs: 0, sus: 0, buy: 0, sell: 0 };
  });
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(registros));
    const close = localStorage.getItem("close");

    if (close) {
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        navigate("/home");
      }, 3000);
    }
  }, [registros]);

  useEffect(() => {
    if (saldo.bs < 0 || saldo.sus < 0) {
      setShowBalanceWarning(true);
    } else {
      setShowBalanceWarning(false);
    }
  }, [saldo]);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const [totals, setTotals] = useState({
    outBs: 0,
    inBs: 0,
    outSus: 0,
    inSus: 0,
  });

  useEffect(() => {
    const fetchExchangeRates = async () => {
      if (saldo.buy === 0 || saldo.sell === 0) {
        try {
          console.log("No se detectaron tasas guardadas. Obteniendo cotización de la API...");
          const exchangeData = await getExchangeDollar();
          
          if (exchangeData) {
            setSaldo((prevSaldo) => {
              const updatedSaldo = {
                ...prevSaldo,
                buy: prevSaldo.buy !== 0 ? prevSaldo.buy : (exchangeData.buy || 0),
                sell: prevSaldo.sell !== 0 ? prevSaldo.sell : (exchangeData.sell || 0),
              };
              
              localStorage.setItem("saldo", JSON.stringify(updatedSaldo));
              return updatedSaldo;
            });
            console.log("Cotización inicial establecida desde la API.");
          }
        } catch (error) {
          console.error("Error al obtener la cotización oficial:", error);
        }
      } else {
        console.log("Se detectaron tasas existentes en el saldo. Conservando datos actuales:", {
          buy: saldo.buy,
          sell: saldo.sell
        });
      }
    };

    fetchExchangeRates();
  }, []);

  const navigate = useNavigate();

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
  };

  const handleImpuestoChange = (e) => {
    setSelectedImpuesto(e.target.value);
  };

  const handleChange = (e, id, tipo) => {
    const value = parseFloat(e.target.value) || 0;
    setCantidades((prev) => ({
      ...prev,
      [`${id}-${tipo}`]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const transaction = names.find((item) => item.id === selectedId);
    setSelectedTransaction(transaction || null);
    setInputValue("");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (!selectedTransaction) {
      console.error("No transaction selected");
      return;
    }

    const currentDate = format(new Date(), "dd-MM-yyyy");
    let cycleId = localStorage.getItem("cycleId");
    if (cycleId === null) {
      cycleId = Date.now().toString();
      localStorage.setItem("cycleId", cycleId);
    }
    const isDollarTransaction = selectedTransaction.name.includes("Dolar");
    const isIncome = selectedTransaction.output === "in";
    const user = JSON.parse(localStorage.getItem("user")).username;

    let amount = parseFloat(inputValue.amount) || 0;
    let bolivianos = parseFloat(inputValue.bolivianos) || 0;
    let dolares = parseFloat(inputValue.dolares) || 0;

    if (amount <= 0 && bolivianos <= 0 && dolares <= 0) {
      alert("⚠️ Ingrese un monto válido mayor a 0.");
      return;
    }

    let newBs, newSus, newBsOut, newBsIn, newSusIn, newSusOut;

    if (isDollarTransaction) {
      newBs = isIncome
        ? saldo.bs - amount * exchangeRate
        : saldo.bs + amount * exchangeRateSale;
      newSus = isIncome ? saldo.sus + amount : saldo.sus - amount;
      newBsOut = isIncome ? amount * exchangeRate : 0;
      newBsIn = isIncome ? 0 : amount * exchangeRateSale;
      newSusOut = isIncome ? 0 : amount;
      newSusIn = isIncome ? amount : 0;
    } else {
      newBs = isIncome ? saldo.bs + bolivianos : saldo.bs - bolivianos;
      newSus = isIncome ? saldo.sus + dolares : saldo.sus - dolares;
      newBsOut = isIncome ? 0 : bolivianos;
      newBsIn = isIncome ? bolivianos : 0;
      newSusOut = isIncome ? 0 : dolares;
      newSusIn = isIncome ? dolares : 0;
    }

    if (newBs < 0 || newSus < 0) {
      alert("⚠️ ¡Saldo insuficiente para realizar esta transacción!");
      return;
    }

    if (selectedTransaction.name.includes("Canje o Fraccionamiento")) {
      newBsOut = newBsIn = bolivianos;
      newSusOut = newSusIn = dolares;
      newBs = saldo.bs;
      newSus = saldo.sus;
    }

    const nuevoRegistro = {
      _id: new ObjectId().toString(),
      name:  selectedTransaction.name === "Servicio"
      ? `${selectedTransaction.name}, ${selectedService}`
      : selectedTransaction.name === "Cobro de Impuestos"
      ? `${selectedTransaction.name}, ${selectedImpuesto}`
      : ["Envio de Giro", "Pago de Giro"].includes(selectedTransaction.name)
      ? `${selectedTransaction.name}, ${selectedGiro}`
      : selectedTransaction.name,
      outBs: newBsOut,
      inBs: newBsIn,
      outSus: newSusOut,
      inSus: newSusIn,
      user,
      date: currentDate,
      cycleId: cycleId,
    };

    setSaldo({ bs: newBs, sus: newSus });
    localStorage.setItem("saldo", JSON.stringify({ bs: newBs, sus: newSus }));
    console.log(saldo);

    const pcc01RequiredTransactions = [
      "Servicio",
      "Aumento de Efectivo(Tesoreria)",
      "Disminucion de Efectivo(Tesoreria)",
      "Canje o Fraccionamiento",
    ];

    if (
      (amount >= 10000 || bolivianos >= 70000 || dolares >= 10000) &&
      !pcc01RequiredTransactions.includes(selectedTransaction.name)
    ) {
      if (!window.confirm("Por favor, Registre el formulario PCC01.")) return;
    }

    setRegistros((prev) => [...prev, nuevoRegistro]);

    setInputValue({ amount: 0, bolivianos: 0, dolares: 0 });

    const fetchData = async () => {
      try {
        await addTransactionRequest(nuevoRegistro);
      } catch (error) {
        console.error("Error saving transaction:", error.message);
      }
    };
    fetchData();
  };

  const handleSave = () => {
    const cycleId = localStorage.getItem("cycleId");
    if (showAlert) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate("/home");
      }, 3000);
      return;
    }
    localStorage.setItem("close", true);

    const closeBalance = {
      name: "Close balance",
      inBs: totals.inBs,
      outBs: totals.outBs,
      inSus: totals.inSus,
      outSus: totals.outSus,
      user: JSON.parse(localStorage.getItem("user")).username,
      date: format(new Date(), "dd-MM-yyyy"),
      cycleId: cycleId,
    };

    const fetchData = async () => {
      try {
        await addTransactionRequest(closeBalance);
        setRegistros([]);
        localStorage.removeItem("transactions");
        navigate("/home");
      } catch (error) {
        console.error("Error saving balance:", error.message);
      }
    };

    fetchData();
  };

  const cancelHandle = () => {
    navigate("/home");
  };

  return (
    <div className="container">
      <h1 className="text-center">Transacciones</h1>
      {showAlert && <AlertModal />}
      <div className="row w-100">
        <div className="col-md-4">
          <div className="table-responsive">
            <div>
              <label htmlFor="transaction-select">Tipo de Transacción:</label>
              <select
                id="transaction-select"
                className="form-control"
                onChange={handleSelectChange}
              >
                <option value="">Selecciona una opción</option>
                {names.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedTransaction && selectedTransaction.name === "Servicio" && (
              <div className="mt-3">
                <label htmlFor="service-type">Tipo de Servicio:</label>
                <select
                  id="service-type"
                  className="form-control"
                  value={selectedService}
                  onChange={handleServiceChange}
                >
                  <option value="">Selecciona un servicio</option>
                  {serviceOptions.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedTransaction &&
              selectedTransaction.name === "Envio de Giro" && (
                <div className="mt-3">
                  <label htmlFor="giro-type">Tipo de Envío:</label>
                  <select
                    id="giro-type"
                    className="form-control"
                    value={selectedGiro}
                    onChange={(e) => setSelectedGiro(e.target.value)}
                  >
                    <option value="">Selecciona tipo de giro</option>
                    {giroOptions.map((giro, index) => (
                      <option key={index} value={giro}>
                        {giro}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            {selectedTransaction &&
              selectedTransaction.name === "Pago de Giro" && (
                <div className="mt-3">
                  <label htmlFor="giro-type">Tipo de Pago:</label>
                  <select
                    id="giro-type"
                    className="form-control"
                    value={selectedGiro}
                    onChange={(e) => setSelectedGiro(e.target.value)}
                  >
                    <option value="">Selecciona tipo de pago</option>
                    {giroOptions.map((giro, index) => (
                      <option key={index} value={giro}>
                        {giro}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            {selectedTransaction &&
              selectedTransaction.name === "Cobro de Impuestos" && (
                <div className="mt-3">
                  <label htmlFor="impuesto-type">Tipo de Impuesto:</label>
                  <select
                    id="impuesto-type"
                    className="form-control"
                    value={selectedImpuesto}
                    onChange={(e) => setSelectedImpuesto(e.target.value)}
                  >
                    <option value="">Selecciona un impuesto</option>
                    {impuestoOptions.map((imp, index) => (
                      <option key={index} value={imp}>
                        {imp}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            {selectedTransaction && (
              <div className="mt-3">
                <label className="fw-bold">
                  Monto (
                  {selectedTransaction.output === "out" ? "Egreso" : "Ingreso"}
                  ):
                </label>
                {["Compra Dolar", "Venta Dolar"].includes(
                  selectedTransaction.name,
                ) ? (
                  <div>
                    <input
                      type="number"
                      className="form-control"
                      value={inputValue.amount || ""}
                      onChange={(e) =>
                        setInputValue((prev) => ({
                          ...prev,
                          amount: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                    <div className="small text-muted mt-2">
                      <strong>Tasa de cambio según BCB:</strong> Compra: {saldo.buy} Bs 
                      <p>Venta: {saldo.sell} Bs</p>
                    </div>
                    <p className="small">
                      Resultado en Bolivianos:{" "}
                      {selectedTransaction.output === "in"
                        ? (inputValue.amount * saldo.buy || 0).toFixed(2)
                        : (inputValue.amount * saldo.sell || 0).toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <div className="d-flex gap-3">
                    <div className="flex-grow-1">
                      <label htmlFor="bolivianos-amount">Bolivianos:</label>
                      <input
                        id="bolivianos-amount"
                        type="number"
                        min="0"
                        step="any"
                        className="form-control"
                        value={inputValue.bolivianos || ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setInputValue((prev) => ({
                            ...prev,
                            bolivianos: value > 0 ? value : "",
                          }));
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <label htmlFor="dolares-amount">Dólares:</label>
                      <input
                        id="dolares-amount"
                        type="number"
                        min="0"
                        step="any"
                        className="form-control"
                        value={inputValue.dolares || ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setInputValue((prev) => ({
                            ...prev,
                            dolares: value > 0 ? value : "",
                          }));
                        }}
                      />
                    </div>
                  </div>
                )}
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleKeyDown}
                >
                  Agregar Transacción
                </button>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h4 className="text-center">💰 Saldo Actual</h4>
            <table className="table table-bordered text-center w-75 mx-auto">
              <thead className="table-dark">
                <tr>
                  <th>Bolivianos (Bs)</th>
                  <th>Dólares (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    className={
                      saldo.bs < 0
                        ? "text-danger fw-bold"
                        : "text-success fw-bold"
                    }
                  >
                    {saldo.bs.toLocaleString("es-BO", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className={
                      saldo.sus < 0
                        ? "text-danger fw-bold"
                        : "text-success fw-bold"
                    }
                  >
                    {saldo.sus.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-md-8">
          <TransactionRegister
            key={registros.length}
            registros={registros}
            onTotalsCalculated={(calculatedTotals) =>
              setTotals(calculatedTotals)
            }
            saldo={saldo}
            setSaldo={setSaldo}
          />
        </div>
      </div>

      <div className="d-flex justify-content-center mt-4 gap-3">
        <button className="btn btn-primary btn-lg" onClick={handleSave}>
          Guardar
        </button>
        <button className="btn btn-secondary btn-lg" onClick={cancelHandle}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
