import React, {useState, useEffect} from "react";


export default function Foreign({setTotal, isDisabled}) {
  const data = [
    { id: 2, value: 100 },
    { id: 3, value: 50 },
    { id: 4, value: 20 },
    { id: 5, value: 10 },
    { id: 6, value: 5 },
    { id: 7, value: 2 },
    { id: 8, value: 1 },
  ];

  const exchangeValue = 6.95
  const [cantidades, setCantidades] = useState({});
  useEffect(() => {
    const total = data.reduce((sum, item) => {
      return sum + (cantidades[item.id] || 0) * item.value;
    }, 0);
    setTotal(total); 
  }, [cantidades, setTotal]);

  const handleChange = (e, id) => {
    if (isDisabled) return;
    let value = parseFloat(e.target.value) || 0;
    if (value <= 0) {
      value = ""; 
    }
    setCantidades((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const totalGeneral = data.reduce((acc, item) => {
    const cantidad = cantidades[item.id] || 0;
    return acc + cantidad * item.value;
  }, 0);

  return (
    <div class="tasks">
      <h3 class="text-center mb-1">Moneda Extranjera</h3>
      <table class="table-striped card-table table-vcenter text-nowrap mb-0 border dashboard-table me-1 table">
        <thead class="table-primary text-center">
          <tr>
            <th>Corte</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>$us {item.value}</td>
              <td>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  step="any"
                  value={cantidades[item.id] || " "}
                  onChange={(e) => handleChange(e, item.id)}
                  disabled={isDisabled}
                />
              </td>
              <td>$us {((cantidades[item.id] || 0) * item.value).toFixed(2)}</td>
            </tr>
          ))}
          {/* Fila del total general */}
          <tr class="table-info">
            <td colSpan={2} class="fw-bold text-end">Total General</td>
            <td class="fw-bold">$us {totalGeneral.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
