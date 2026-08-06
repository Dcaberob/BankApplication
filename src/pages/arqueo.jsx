import React, { useState, useEffect } from "react";
import National from "../components/national";
import Foreign from "../components/foreign";
import Total from "../components/total";
import { addBalanceRequest } from "../rest/resquest_api";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { isDisabled } from "@testing-library/user-event/dist/utils";

export default function Arqueo() {
  const [totalNational, setTotalNational] = useState(0);
  const [totalForeign, setTotalForeign] = useState(0);
  const [finalTotals, setFinalTotals] = useState({ totalBol: 0, totalSus: 0 });
  const [isEditingDisabled, setIsEditingDisabled] = useState(false);
 
  const navigate = useNavigate();

  const handleSave = () => {
      const balance = {
        sus : finalTotals.totalSus.toFixed(2),
        bs : finalTotals.totalBol.toFixed(2),
        user: JSON.parse(localStorage.getItem("user")).username,
        date: format(new Date(), "dd-MM-yyyy"),
        cycleId: localStorage.getItem("cycleId")
      };
      
      console.log( Date.now().toString())
    
      const fetchData = async () => {
        try {
          await addBalanceRequest(balance);
          localStorage.removeItem("transactions"); 
          localStorage.removeItem("cycleId"); 
          localStorage.removeItem("close"); 
          localStorage.removeItem("saldo"); 
          setTimeout(() => {
            navigate("/home"); 
          }, 500); 
        } catch (error) {
          console.error("Error saving balance:", error.message);
        }
      };
    
      fetchData();
    };

    
  const cancelHandle=()=>{
    navigate("/home")
  }

  return (
    <div>
      <h1 className="text-center mb-4 mt-3">Cierre de Caja</h1>
      <div class="row">
      <div class="col-md-1"></div>
      <div class="col-sm-5">
          <National setTotal={setTotalNational} isDisabled={isEditingDisabled} />
        </div>
        <div class="col-sm-5">
          <Foreign setTotal={setTotalForeign} isDisabled={isEditingDisabled} />
        </div>
      </div>
      <p />
      <div class="mt-4">
        <Total totalNational={totalNational} 
          totalForeign={totalForeign} 
          setFinalTotals={setFinalTotals} 
          isEditingDisabled={isEditingDisabled}
          setIsEditingDisabled={setIsEditingDisabled}
        />
      </div>
      <p />
      <div class="text-center">
      <button className="btn btn-primary btn-lg me-1" onClick={handleSave}>
          Cerrar Caja
        </button>
        <button type="button" class="btn btn-secondary btn-lg me-1" onClick={cancelHandle}>
          Cancelar </button>
      </div>
    </div>
  );
}
