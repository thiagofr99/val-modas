import React, { useState } from "react";

const menusData = [
  "Cadastrar","Excluir","Devolver"
];

function Form() {
  const [menusData, setData] = useState("Produto");

  const menus = menusData.map((menu) => (
    <option key={menu} value={menu}>
      {menu}
    </option>
  ));

  
  function handleCountryChange(event) {
    setData(data => (event.target.value ));
  }

  function handleStateChange(event) {
    setData(data => (event.target.value ));
  }

  return (
    <form onSubmit={() => console.log("Submitted")}>
      <div>
        <select value={menus} onChange={handleCountryChange}>
          {menus}
        </select>
      </div>          
    </form>
  );
}

export default Form;
