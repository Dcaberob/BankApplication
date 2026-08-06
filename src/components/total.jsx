import React, { useState, useEffect } from "react";
import {
  getTransactionRequest,
} from "../rest/resquest_api";

export default function Total({  totalNational,
  totalForeign,
  setFinalTotals,
  isEditingDisabled,
  setIsEditingDisabled,}) {
  const [start, setStart] = useState([]);
  const [allTransaction, setAllTransaction] = useState([]);
  const [showDifference, setShowDifference] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      console.log(localStorage.getItem("cycleId") === null);
      try {
        const resp_star = await getTransactionRequest({
          name: "Opening balance",
          user: JSON.parse(localStorage.getItem("user")).username,
          cycleId: localStorage.getItem("cycleId"),
        });
        console.log(resp_star);
        const resp_close = await getTransactionRequest({
          name: "Close balance",
          user: JSON.parse(localStorage.getItem("user")).username,
          cycleId: localStorage.getItem("cycleId"),
        });
        if ((resp_star === undefined) || (localStorage.getItem("cycleId") === null)) {
          setStart({
            name: "Opening balance",
            outBs: 0,
            inBs: 0,
            outSus: 0,
            user: JSON.parse(localStorage.getItem("user")).username,
            inSus: 0,
            cycleId: localStorage.getItem("cycleId"),
          });
          console.log(resp_star);
        } else {
          setStart(resp_star);
        }
        if (resp_close === undefined) {
          setAllTransaction({
            name: "Close balance",
            outBs: 0,
            inBs: 0,
            outSus: 0,
            user: JSON.parse(localStorage.getItem("user")).username,
            inSus: 0,
            cycleId: localStorage.getItem("cycleId"),
          });
        } else {
          setAllTransaction(resp_close);
        }
        console.log("--------------");
        console.log(start);
        console.log(allTransaction);
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      }
    };
    fetchData();
  }, []);

  const handleToggleDifference = () => {
    setIsEditingDisabled((prev) => !prev); // 🔄 Cambia entre habilitado/deshabilitado
  };
  const totalBol = (allTransaction.inBs + start.inBs - allTransaction.outBs).toFixed(2);
  const totalSus = (allTransaction.inSus + start.inSus - allTransaction.outSus).toFixed(2);

  const finalBol = totalNational - totalBol;
  const finalSus = totalForeign - totalSus;

  useEffect(() => {
    setFinalTotals({ totalBol: parseFloat(finalBol), totalSus: parseFloat(finalSus) });
  }, [finalBol, finalSus, setFinalTotals]);

  const toggleDifference = () => {
    setShowDifference(!showDifference);
    setIsEditingDisabled(!isEditingDisabled);
  };

  return (
    <div className="container mt-1">
      <table className="table table-striped table-bordered">
        <thead className="table-primary">
          <tr className="text-center">
            <th colSpan={3}>Total</th>
          </tr>
          <tr className="text-center">
            <th></th>
            <th>Bolivianos</th>
            <th>Dolares</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total, Fondos Arqueo</td>
            <td>{totalNational.toFixed(2)}</td>
            <td>{totalForeign.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Según Sistema</td>
            <td>{totalBol || 0}</td>
            <td>{totalSus || 0}</td>
          </tr>
          {isEditingDisabled && (
            <>
              <tr>
                <td>Diferencia</td>
                <td
                  style={{
                    color:  finalBol < 0 ? "red" : "green",
                  }}
                >
                  {(finalBol).toFixed(2)}
                </td>
                <td
                  style={{
                    color: finalSus < 0 ? "red" : "green",
                  }}
                >
                  {(finalSus).toFixed(2)}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      <div className="text-center mt-2">
        <button className="btn btn-info" onClick={handleToggleDifference}>
          {isEditingDisabled ? "No Mostrar Diferencia" : "Mostrar Diferencia"}
        </button>
      </div>
    </div>
  );
}