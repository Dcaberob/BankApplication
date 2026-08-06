import React, { useState, useEffect } from "react";
import TotalInitial from "../../src/components/total_initial";
import { addTransactionRequest } from "../../src/rest/resquest_api";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "./alertOverlay.css";
import AlertModal from "../../src/components/alert_modal";

export default function InitialBalance() {
  const [showAlert, setShowAlert] = useState(false);
  const [totals, setTotals] = useState({ totalNational: 0, totalForeign: 0, buy:0, sell: 0, });

  const navigate = useNavigate();

  useEffect(() => {
    const cycleId = localStorage.getItem("cycleId");

    if (cycleId) {
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        navigate("/home");
      }, 3000);
    }
  }, [navigate]);

  const handleSave = () => {
    let cycleId = localStorage.getItem("cycleId");

    if (cycleId) {
      setShowAlert(true);
      return;
    }

    cycleId = Date.now().toString();
    const saldo = {
      bs: totals.totalNational,
      sus: totals.totalForeign,
      buy: totals.buy,
      sell: totals.sell,
    };
    localStorage.setItem("cycleId", cycleId);
    localStorage.setItem("saldo", JSON.stringify(saldo));
    const initBalance = {
      name: "Opening balance",
      inBs: totals.totalNational,
      outBs: 0,
      inSus: totals.totalForeign,
      outSus: 0,
      user: JSON.parse(localStorage.getItem("user")).username,
      date: format(new Date(), "dd-MM-yyyy"),
      cycleId: cycleId,
    };

    console.log(initBalance);

    const fetchData = async () => {
      try {
        const response = await addTransactionRequest(initBalance);
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      }
    };
    fetchData();
    navigate("/bankser");
  };

  const cancelHandle = () => {
    navigate("/bankser");
  };

  return (
    <div>
      <h1 class="text-center mt-3 mb-4">Apertura de Caja</h1>
      {showAlert && <AlertModal />}
      <h6 class="text-center mt-3 mb-4">
        {" "}
        Por favor introduzaca el monto inicial
      </h6>
      <div class="mt-4">
        <TotalInitial onTotalChange={setTotals} />
      </div>
      <p />
      <div class="text-center">
        <button
          type="button"
          class="btn btn-success btn-lg me-1"
          onClick={handleSave}
        >
          {" "}
          Aperturar Caja{" "}
        </button>
        <button
          type="button"
          class="btn btn-secondary btn-lg me-1"
          onClick={cancelHandle}
        >
          Cancelar{" "}
        </button>
      </div>
    </div>
  );
}