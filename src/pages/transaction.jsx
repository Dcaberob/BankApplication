import React, { useState, useEffect } from "react";
import TransactionRegister from "../components/transaction_register";
import { addTransactionRequest, getExchangeDollar } from "../rest/resquest_api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ObjectId } from "bson";
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
    { id: 10, name: "Deposito de Cheque", output: "in" },
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

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [inputValue, setInputValue] = useState({
    amount: "",
    bolivianos: "",
    dolares: "",
  });

  const [totals, setTotals] = useState({
    outBs: 0,
    inBs: 0,
    outSus: 0,
    inSus: 0,
  });

  const navigate = useNavigate();

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
  }, [registros, navigate]);

  useEffect(() => {
    setShowBalanceWarning(saldo.bs < 0 || saldo.sus < 0);
  }, [saldo]);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      if (!saldo.buy || !saldo.sell || saldo.buy === 0 || saldo.sell === 0) {
        try {
          const exchangeData = await getExchangeDollar();
          if (exchangeData) {
            setSaldo((prevSaldo) => {
              const updatedSaldo = {
                ...prevSaldo,
                buy: exchangeData.buy || prevSaldo.buy || 0,
                sell: exchangeData.sell || prevSaldo.sell || 0,
              };
              localStorage.setItem("saldo", JSON.stringify(updatedSaldo));
              return updatedSaldo;
            });
          }
        } catch (error) {
          console.error("Error al obtener la cotización oficial:", error);
        }
      }
    };

    fetchExchangeRates();
  }, [saldo.buy, saldo.sell]);

  const handleServiceChange = (e) => setSelectedService(e.target.value);
  const handleImpuestoChange = (e) => setSelectedImpuesto(e.target.value);

  // CORREGIDO: Mantener siempre el objeto en inputValue
  const handleSelectChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const transaction = names.find((item) => item.id === selectedId);
    setSelectedTransaction(transaction || null);
    setInputValue({ amount: "", bolivianos: "", dolares: "" });
  };

  const handleKeyDown = () => {
    if (!selectedTransaction) return;

    const exchangeRate = saldo.buy || 0;
    const exchangeRateSale = saldo.sell || 0;

    const currentDate = format(new Date(), "dd-MM-yyyy");
    let cycleId = localStorage.getItem("cycleId") || Date.now().toString();
    localStorage.setItem("cycleId", cycleId);

    const isDollarTransaction = selectedTransaction.name.includes("Dolar");
    const isIncome = selectedTransaction.output === "in";
    const user = JSON.parse(localStorage.getItem("user"))?.username || "Usuario";

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
      name: selectedTransaction.name === "Servicio"
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

    const updatedSaldo = {
      bs: newBs,
      sus: newSus,
      buy: exchangeRate,
      sell: exchangeRateSale,
    };

    setSaldo(updatedSaldo);
    localStorage.setItem("saldo", JSON.stringify(updatedSaldo));

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
    setInputValue({ amount: "", bolivianos: "", dolares: "" });

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
      user: JSON.parse(localStorage.getItem("user"))?.username || "Usuario",
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

  // Cálculo seguro para prevenir NaN en el renderizado
  const currentAmount = parseFloat(inputValue.amount) || 0;
  const currentBuy = parseFloat(saldo.buy) || 0;
  const currentSell = parseFloat(saldo.sell) || 0;
  const calculatedBs = selectedTransaction
    ? selectedTransaction.output === "in"
      ? currentAmount * currentBuy
      : currentAmount * currentSell
    : 0;

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

            {selectedTransaction && selectedTransaction.name === "Envio de Giro" && (
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

            {selectedTransaction && selectedTransaction.name === "Pago de Giro" && (
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

            {selectedTransaction && selectedTransaction.name === "Cobro de Impuestos" && (
              <div className="mt-3">
                <label htmlFor="impuesto-type">Tipo de Impuesto:</label>
                <select
                  id="impuesto-type"
                  className="form-control"
                  value={selectedImpuesto}
                  onChange={handleImpuestoChange}
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
                  Monto ({selectedTransaction.output === "out" ? "Egreso" : "Ingreso"}):
                </label>
                {["Compra Dolar", "Venta Dolar"].includes(selectedTransaction.name) ? (
                  <div>
                    <input
                      type="number"
                      className="form-control"
                      value={inputValue.amount || ""}
                      onChange={(e) =>
                        setInputValue((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      placeholder="Ingrese el monto en dólares"
                    />
                    <div className="small text-muted mt-2">
                      <strong>Tasa de cambio según BCB:</strong> Compra: {saldo.buy || 0} Bs
                      <p>Venta: {saldo.sell || 0} Bs</p>
                    </div>
                    <p className="small">
                      Resultado en Bolivianos: {calculatedBs.toFixed(2)} Bs
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
                        onChange={(e) =>
                          setInputValue((prev) => ({
                            ...prev,
                            bolivianos: e.target.value,
                          }))
                        }
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
                        onChange={(e) =>
                          setInputValue((prev) => ({
                            ...prev,
                            dolares: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
                <button className="btn btn-primary mt-2" onClick={handleKeyDown}>
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
                  <td className={saldo.bs < 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                    {(saldo.bs || 0).toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                  </td>
                  <td className={saldo.sus < 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                    {(saldo.sus || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
            onTotalsCalculated={(calculatedTotals) => setTotals(calculatedTotals)}
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