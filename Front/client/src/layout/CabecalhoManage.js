import React from "react";
import { useHistory} from "react-router-dom";

import logo from '../assets/mae-logo-2.png'

export default function CabechalhoManage(){
    
    const usuarioLogado = sessionStorage.getItem('username');    
    const cargo = sessionStorage.getItem('permission'); 
    
    const history = useHistory();

    async function logout(){
        sessionStorage.setItem('username', '');
        sessionStorage.setItem('accessToken', '');
        sessionStorage.setItem('permission', '');
        history.push(`/`);        
    }    
    
    async function voltar(){
        history.goBack();
    }

    return (
        <div>
            <header>
                <nav>
                    <ul>                    
                        <li> 
                            
                        </li>                        
                    </ul>                
                    <div id="cabecalho" className="flex">
                    <img className='logoCabecalho' src={logo} alt="" />
                        <h3 className="texto-bemvindo">Seja bem vindo {usuarioLogado+" - "+cargo}</h3>     
                        <button className="button-sair" onClick={logout}> Sair </button>            
                        <button className="button-voltar" onClick={voltar}> {"<< Voltar"}</button>        
                    </div>
                    
                </nav>
            </header>
        </div>
    );
}