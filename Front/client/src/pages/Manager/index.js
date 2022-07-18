import React from "react";
import { useHistory} from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'


import './style.css';
import CabechalhoManage from "../../layout/CabecalhoManage";

export default function Manager(){   
    
    const history = useHistory();    

    async function produtos(){
        history.push('/produtos');
    }      

    return(
        <div id="containerPrincipal">
           
            <CabechalhoManage></CabechalhoManage>
            <body>
            <div class="container-info">
            <div class="item item1"><button onClick={produtos} className="btn-item">Produtos</button></div>
            <div class="item item2"><button className="btn-item">Clientes</button></div>
            <div class="item item3"><button className="btn-item">Fornecedores</button></div>
            <div class="item item3"><button className="btn-item">Iniciar Venda</button></div>
            </div>

            </body>
            <footer>
                <div className="dados-pessoais">
                    <div className="endereco">
                        <h2> Granja Portugal </h2>
                        <h3> Fortaleza - CE</h3>  
                    </div>
                    <div className="rede-social">                        
                        <a className="link-href" href="https://github.com/thiagofr99"><FontAwesomeIcon icon={faGithub} className="github" /><h3>/thiagofr99</h3></a> 
                        <a className="link-href-yt" href="https://www.youtube.com/channel/UCxxFrDeO_yXxRe7EB5aTjfA"><FontAwesomeIcon icon={faYoutube} className="youtube" /><h3>Thiago Furtado</h3></a> 
                    </div>
                                   
                </div>
                <div className="copyright">
                        Copyright © www.devthiagofurtado.com 2022
                    </div> 
               
            </footer>            
        </div>
    );
}