import { useState } from "react";

function DialogInput({ message, onDialog, valor, motivo }) {
  const[m ,setM] = useState();
  const[v ,setV] = useState();
  async function alterar(param){    
    
      
    onDialog({ validacao: param, valorDevolucao: v, motivoDevolucao: m });    
  }
  
  return (
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0,0,0,0.5)"
        }}
        onClick={() => onDialog(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            background: "white",
            padding: "40px",
            borderRadius: "10px"
          }}
        >
          <h3 stlye={{ color: "#111", fontSize: "20px" }}>{message}</h3>          
          <h4>Motivo Devolução</h4>
          <input type="text" placeholder="Digite um motivo." value={m} onChange={e=> setM(e.target.value) } />
          <h4>Valor Devolução</h4>
          <input type="number" value={v} onChange={e=> setV(e.target.value) } />
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => alterar(true)}
              style={{
                background: "red",
                color: "white",
                padding: "10px 25px",
                marginRight: "25px",
                marginTop: "20px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Sim
            </button>
            <button
              onClick={() => alterar(false)}
              style={{
                background: "green",
                color: "white",
                padding: "10px 25px",
                marginLeft: "25px",
                marginTop: "20px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Não
            </button>
          </div>
        </div>
      </div>
    );
  }
  export default DialogInput;
  