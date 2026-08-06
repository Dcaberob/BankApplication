import React, { useState, useEffect, useMemo } from "react";
import { editTransactionRequest } from "../rest/resquest_api";

export default function TransactionHistory({
  registros = [],
  onTotalsCalculated,
  onDataChange,
  saldo,
  setSaldo
}) {
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [tableData, setTableData] = useState([...registros]);
  const [diff, setDiff] = useState({ bs: 0, sus: 0 });

  const totals = useMemo(() => {
    return tableData.reduce(
      (acc, registro) => {
        acc.outBs += registro.outBs || 0;
        acc.inBs += registro.inBs || 0;
        acc.outSus += registro.outSus || 0;
        acc.inSus += registro.inSus || 0;
        return acc;
      },
      { outBs: 0, inBs: 0, outSus: 0, inSus: 0 }
    );
  }, [tableData]);

  useEffect(() => {
    if (onTotalsCalculated) {
      onTotalsCalculated(totals);
    }
  }, [totals, onTotalsCalculated]);

  useEffect(() => {
    localStorage.setItem("saldo", JSON.stringify(saldo));
  }, [saldo]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(tableData);
    }
  }, [tableData, onDataChange]);

  const handleEdit = (row, index) => {
    setEditingRow(index);
    setEditedData({ ...row });
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedData({});
  };

  const handleSave = async (index) => {
    try {
      const rowToEdit = { ...registros[index] };
      const response = await editTransactionRequest(rowToEdit);
      console.log("Edit the row table API Response:", response);

      setTableData((prevTableData) => {
        const old = prevTableData[index];
        const updatedTableData = [...prevTableData];
        updatedTableData[index] = { ...updatedTableData[index], ...editedData };
        localStorage.setItem("transactions", JSON.stringify(updatedTableData));
        const diffBs = updatedTableData[index].inBs - old.inBs -
          (updatedTableData[index].outBs - old.outBs);
        const diffSus = updatedTableData[index].inSus - old.inSus -
          (updatedTableData[index].outSus - old.outSus);
        const nuevoSaldo = {
          bs: saldo.bs + diffBs,
          sus: saldo.sus + diffSus,
        };
        setSaldo(nuevoSaldo);
        console.log(nuevoSaldo);
        localStorage.setItem("saldo", JSON.stringify(nuevoSaldo));
        return updatedTableData;
      });
      setEditingRow(null);
      setEditedData({});
    } catch (error) {
      console.error("Error while editing transaction:", error);
    }
  };

  const handleInputChange = (e, row) => {
    const { name, value } = e.target;
    let parsedValue = parseFloat(value) || 0;

    if (parsedValue <= 0) {
      parsedValue = " "; 
    }
    const exchangeRateSale = 6.86;
    const exchangeRate = 6.96;

    setEditedData((prevData) => {
      let updatedData = {
        ...prevData,
        [name]: ["outBs", "inBs", "outSus", "inSus"].includes(name)
          ? parsedValue
          : value,
      };
      if (["Compra Dolar", "Venta Dolar"].includes(row.name)) {
        if (name === "outBs") {
          updatedData["inSus"] = (parsedValue / exchangeRateSale).toFixed(2);
        } else if (name === "outSus") {
          updatedData["inBs"] = (parsedValue * exchangeRate).toFixed(2);
        } else if (name === "inBs") {
          updatedData["outSus"] = (parsedValue / exchangeRate).toFixed(2);
        } else if (name === "inSus") {
          updatedData["outBs"] = (parsedValue * exchangeRateSale).toFixed(2);
        }
      }
      return updatedData;
    });
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este registro?"
    );
    if (!confirmDelete) return;

    try {
      const rowToEdit = { ...registros[index] };
      rowToEdit.name = `(REMOVE) ${rowToEdit.name}`;

      const response = await editTransactionRequest(rowToEdit);
      console.log("Remove row table API Response:", response);

      setTableData((prevTableData) => {
        const updatedTableData = [...prevTableData];
        updatedTableData.splice(index, 1);
        setSaldo((prevSaldo) => {
          const nuevoSaldo = {
            bs: prevSaldo.bs - (rowToEdit.inBs - rowToEdit.outBs),
            sus: prevSaldo.sus - (rowToEdit.inSus - rowToEdit.outSus),
          };
  
          localStorage.setItem("saldo", JSON.stringify(nuevoSaldo)); 
          return nuevoSaldo;
        });
        return updatedTableData;
      });

      registros.splice(index, 1);
      console.log("Updated registros:", registros);
      localStorage.setItem("transactions", JSON.stringify(registros));
    } catch (error) {
      console.error("Error while editing transaction:", error);
    }
  };

  return (
    <div className="task">
      <table className="table-striped card-table table-vcenter text-nowrap mb-0 border dashboard-table me-1 table">
        <thead className="table-primary">
          <tr className="text-center">
            <th colSpan={6}>Historial de Transacciones</th>
          </tr>
          <tr className="text-center">
            <th>Tipo de Registro</th>
            <th>Bolivianos Egreso</th>
            <th>Bolivianos Ingreso</th>
            <th>$us Egreso</th>
            <th>$us Ingreso</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) =>
            editingRow === index ? (
              <tr key={index}>
                <td>
                  {editedData.name}
                </td>
                <td>
                  <input
                    type="number"
                    name="outBs"
                    min="0"
                    step="any"
                    value={editedData.outBs || 0}
                    onChange={(e) => handleInputChange(e, row)}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="inBs"
                    min="0"
                    step="any"
                    value={editedData.inBs || 0}
                    onChange={(e) => handleInputChange(e, row)}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="outSus"
                    min="0"
                    step="any"
                    value={editedData.outSus || 0}
                    onChange={(e) => handleInputChange(e, row)}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="inSus"
                    min="0"
                    step="any"
                    value={editedData.inSus || 0}
                    onChange={(e) => handleInputChange(e, row)}
                    className="form-control"
                  />
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => handleSave(index)}
                  >
                    Guardar
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row.outBs}</td>
                <td>{row.inBs}</td>
                <td>{row.outSus}</td>
                <td>{row.inSus}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(row, index)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(index)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            )
          )}
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td>
              <strong>{totals.outBs}</strong>
            </td>
            <td>
              <strong>{totals.inBs}</strong>
            </td>
            <td>
              <strong>{totals.outSus}</strong>
            </td>
            <td>
              <strong>{totals.inSus}</strong>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
