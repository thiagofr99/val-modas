import React,{useState, useEffect} from "react";
import { useHistory} from "react-router-dom";

import './style.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../../services/api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'
import Loading from '../../layout/Loading';
import Cabechalho from "../../layout/Cabecalho";


export default function Usuario(){

    const [permissionsReturn, setPermissionsReturn] = useState([]);
    const [permissionsResponse, setPermissionsResponse] =useState([]);

    const [userName, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');    
    

    const [loadOn, setLoadOn] = useState(false);

    const [nome, setNome] =  useState('');    
    
    const accessToken = sessionStorage.getItem('accessToken');        

    const history = useHistory();

    useEffect(()=> {
    
        api.get('auth/permissions', {
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            setPermissionsReturn(response.data)
        })

    
        
    },[]);

    async function salvar(e){
        e.preventDefault();
        setLoadOn(true);
        var permissions = [permissionsResponse];
    
        const data = {
            userName,
            fullName,
            password,
            permissions
        }
    
        try{
    
          await api.post('auth/salvar',data,{
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
          });
            
          toast.success('Usuario salvo com sucesso.', {
            position: toast.POSITION.TOP_CENTER
          })
        setLoadOn(false);
        setFullName('');
        setPassword('');
        setUsername('');
        setPermissionsResponse([]);          
    
        } catch (err){
            toast.error('Erro ao salvar usuário.', {
                position: toast.POSITION.TOP_CENTER
              })
              setLoadOn(false);
        }
    
      };

    async function findAllByUserName(nome){        
        if(nome === undefined || nome===''){
            history.push(`/todos/`);
        } else {
            history.push(`/consulta/${nome}`);
        }
        

    }  
    
    return (
        
        <div id="container">
        {loadOn? <Loading></Loading>:
        <div>
            <Cabechalho></Cabechalho>
            <body>                
                <div id="consulta-1">
                    <div className="row-1">
                        <h2 className="text-consulta">CONSULTA TODOS OS USUÁRIO POR NOME.</h2>
                        
                    </div>
                    <div className="row-2">
                        <form className="consulta-1" onSubmit={()=>{findAllByUserName(nome)}}>
                            <input className="input-1" type="text" name="id" id="" value={nome} onChange={e => setNome(e.target.value)} placeholder="Digíte o nome ou parte do nome do Usuário."/>
                            <input className="input-2" type="submit" value="Consultar" />
                        </form>
                    </div>
                </div>

                <div id="consulta-2">
                    <div className="row-1">
                        <h2 className="text-consulta">SALVA UM NOVO USUÁRIO.</h2>
                        
                    </div>
                    <div className="row-2">
                        <form className="consulta-1" onSubmit={salvar}>
                            <input className="input-3" type="text" name="username" value={userName} onChange={e => setUsername(e.target.value)} placeholder="Login Usuário."/>
                            <input className="input-3" type="text" name="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nome Completo."/>
                            <input className="input-3" type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password."/>
                            <select id="permissao" className="input-select-3" name="select" value={permissionsResponse} onChange={e=> setPermissionsResponse(e.target.value)}>
                                <option value="">Selecione uma Opção!</option>
                                {permissionsReturn.map( p=>(
                                          <option value={p.valorEnum}>{p.descricao}</option>                                     
                                ))}
                            
                            </select>
                            <input className="input-2" type="submit" value="Salvar" />
                        </form>
                    </div>
                </div>
                <div className="load-1">               
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
}
        </div>
        
    );
}