import React, { useState, useEffect } from "react";

export default function TotalInitial({ onTotalChange }) {
  const [totals, setTotals] = useState({
    totalNational: 0,
    totalForeign: 0,
    buy: 0,
    sell: 0,
  });

  useEffect(() => {
    onTotalChange(totals);
  }, [totals, onTotalChange]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);

    setTotals((prev) => ({
      ...prev,
      [name]: parsedValue >= 0 ? parsedValue : 0, 
    }));
  };

  return (
    <div className="container mt-1 w-50">
      <table className="table table-bordered text-center">
        <thead className="table-primary">
          <tr>
            <th colSpan={3}>Total Inicial</th>
          </tr>
          <tr>
            <th></th>
            <th>Bolivianos</th>
            <th>Dólares</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fw-bold">Total:</td>
            <td>
              <input
                type="number"
                name="totalNational"
                min="0"
                step="any"
                className="form-control"
                value={totals.totalNational || ""}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                type="number"
                name="totalForeign"
                min="0"
                step="any"
                className="form-control"
                value={totals.totalForeign || ""}
                onChange={handleChange}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <table className="table table-bordered text-center">
        <thead className="table-primary">
          <tr>
            <th colSpan={3}>Cotizacion del dolar</th>
          </tr>
          <tr>
            <th></th>
            <th>Compra</th>
            <th>Venta</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fw-bold">Bs:</td>
            <td>
              <input
                type="number"
                name="buy"
                min="0"
                step="any"
                className="form-control"
                value={totals.buy || ""}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                type="number"
                name="sell"
                min="0"
                step="any"
                className="form-control"
                value={totals.sell || ""}
                onChange={handleChange}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}