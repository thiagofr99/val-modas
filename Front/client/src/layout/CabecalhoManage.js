import React from "react";
import { useHistory} from "react-router-dom";

import logo from '../assets/mae-logo-2.png'

export default function CabechalhoManage(){
    
    const usuarioLogado = sessionStorage.getItem('username');        
    
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
                <div id="cabecalho" className="flex">
                    <img className='logoCabecalho' src={logo} alt="" />
                    <h3 className="texto-bemvindo">Bem vindo(a) {usuarioLogado}</h3>     
                    <button className="button-sair" onClick={logout}> Sair </button>            
                    <button className="button-voltar" onClick={voltar}> {"<< Voltar"}</button>        
                </div>
            </header>
        </div>
    );
}