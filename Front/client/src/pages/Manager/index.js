import React from "react";
import { useHistory} from "react-router-dom";

import './style.css';
import CabechalhoManage from "../../layout/CabecalhoManage";

export default function Manager(){   
    
    const history = useHistory();    

    async function produtos(){
        history.push('/produtos');
    }     
    
    async function clientes(){
        history.push('/clientes');
    }     

    return(
        <div id="containerPrincipal">
           
            <CabechalhoManage></CabechalhoManage>
            <body>
            <div class="container-info">
            <div class="item item1"><button onClick={produtos} className="btn-item">Produtos</button></div>
            <div class="item item2"><button onClick={clientes} className="btn-item">Clientes</button></div>
            <div class="item item3"><button className="btn-item">Fornecedores</button></div>
            <div class="item item3"><button className="btn-item">Iniciar Venda</button></div>
            </div>

            </body>                  
        </div>
    );
}