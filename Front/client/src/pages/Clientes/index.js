import React,{useState} from "react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loading from '../../layout/Loading';

import api from '../../services/api'


import './style.css';
import CabechalhoManage from "../../layout/CabecalhoManage";
import Dialog from "../../layout/DialogConfirm";

export default function Clientes(){
  
    //Visão tela
    const [visao, setVisao] = useState('default');

    //Tela Carregar
    const [loadOn, setLoadOn] = useState(false);

    const accessToken = sessionStorage.getItem('accessToken');  
    
    //Variavel para desativados
    const [ativado, setAtivado] = useState(true);
    const [varVisivel, setVarVisivel] = useState(false);
    const [editando, setEditando] = useState(false)

    //Variaveis cliente
    const [id, setId] = useState();
    const [nomeCliente, setNomeCliente] = useState('');    
    const [telefone, setTelefone] = useState('');    


    //variavel busca    
    const [nomeClienteBusca, setNomeClienteBusca] = useState('');
    const [clientes, setClientes] = useState([]);

    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        nome: "",
        id: 0,
      });

    const handleDialog = (message, isLoading, nome, id) => {
    setDialog({
        message,
        isLoading,        
        nome,
        id
    });
    };

    const areUSure = (choose) => {
        if (choose) {
          //deletar();
          handleDialog("", false);
        } else {
          
          handleDialog("", false);
        }
      };
    

    async function buscarClientes(e){
        e.preventDefault();
        try{              
               
            await api.get('cliente/findAllByFornecedorName',{                
                headers:{
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    nomeCliente: nomeClienteBusca,
                    page: 0,
                    limit: 10,
                    direction: 'asc'
                }
              }).then(responses => {
                setClientes(responses.data._embedded.clienteVoes);                  
              })          

            toast.success('Busca realizada com sucesso.', {
                position: toast.POSITION.TOP_CENTER
              })            

        } catch (erro){
            toast.error('Busca não retornou dados.', {
                position: toast.POSITION.TOP_CENTER
              })            
        }
    }

    async function editar(e){
        e.preventDefault();        
        setEditando(true);   
        setAtivado(true);
    }

    async function buscarClientesPorId(e){
        e.preventDefault();
        try{
                       
            setAtivado(false);   
            await api.get(`cliente/${id}`,{                
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
              }).then(response => {
                setNomeCliente(response.data.nomeCliente);
                setTelefone(response.data.telefone);                
              })          
            setVarVisivel(true);
            toast.success('Busca realizada com sucesso.', {
                position: toast.POSITION.TOP_CENTER
              })            

        } catch (erro){
            toast.error('Busca não retornou dados.', {
                position: toast.POSITION.TOP_CENTER
              })            
        }
    }
      
    async function mudarVisao(param){
        setVisao(param);        
    }

    async function salvar(e){
        e.preventDefault();
        setLoadOn(true);                
        const data = {
            id,
            nomeCliente,
            telefone
        }
    
        try{
    
          await api.post('cliente/salvar',data,{
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
          });
            
          toast.success('Cliente salvo com sucesso.', {
            position: toast.POSITION.TOP_CENTER
          })
        setLoadOn(false);
        setNomeCliente('');
        setTelefone('');
        
        setClientes([]);
        setVarVisivel(false);
        setVisao('default');
        setEditando(false);

        } catch (err){
            toast.error('Erro ao salvar produto.', {
                position: toast.POSITION.TOP_CENTER
              })
            setLoadOn(false);
        }
    
      };

    return(
        <div id="containerPrincipal">
            {loadOn? <Loading></Loading>:
            <div>
            <CabechalhoManage></CabechalhoManage>
            <body>
            {
            visao === 'default' ? 
                <div className="container-info">
                <div className="item item1"><button onClick={()=> mudarVisao('cadastrar')} className="btn-item">Cadastrar Cliente</button></div>                
                <div className="item item3"><button onClick={()=> mudarVisao('consultar')} className="btn-item">Consultar Cliente</button></div>
                </div> :
                visao === 'cadastrar' ?   
                <div>
                <form>                
                <div>
                    <label for="nome">Nome Cliente:</label>
                </div>
                <div className="inputs-produtos">
                    <input className="input-produto" type="text" id="nome" name="userName" placeholder="Digite o nome do cliente." value={nomeCliente} onChange={e => setNomeCliente(e.target.value)} />                                                                        
                </div>
                <div>
                    <label for="valorCompra">Telefone Cliente:</label>
                    <div className="inputs-produtos">                    
                        <input className="input-produto" type="number" id="valorCompra" placeholder="(xx) xxxx-xxxx" value={telefone} onChange={e => setTelefone(e.target.value)}/>
                    </div>                   
                    
                </div>
                <div className="inputs-produtos">
                <button className="btn-pdt-cadastrar" onClick={salvar}>Cadastrar</button>
                </div>
                </form>                  
                </div> :
                visao === 'consultar' ?   
                <div>
                <form>
                <div className="busca">
                    <input className= {editando ? "input-produto-desativado" : "input-busca-produto"}  type="text" placeholder="Buscar Clientes por nome." disabled={editando} value={nomeClienteBusca} onChange={e => setNomeClienteBusca(e.target.value)} />
                    <button onClick={ buscarClientes } className="button-buscar">Buscar</button>                      
                    { clientes.length > 0 ? 
                        <div className="select-produtos">
                        <select id="produto" className="input-select-busca" name="select" disabled={editando} value={id} onChange={e=> setId(e.target.value)}>
                                <option value="">Selecione uma Opção!</option>
                                {clientes.map( p=>(
                                          <option value={p.id}>{p.nomeCliente}</option>                                     
                                ))}
                            
                        </select>
                        <button onClick={ buscarClientesPorId } className="button-buscar">Buscar</button>
                        {
                            ativado ? '':<button onClick={ editar } className="button-editar">Editar</button>  
                        }
                        
                        </div>  
                    : "" }                                                                                                                                                   
                </div>
                { varVisivel ? 
                    <div>
                        <div>
                            <label for="nome">Nome Cliente:</label>
                            <div className="inputs-produtos">                    
                            <input className= { ativado ? "input-produto":"input-produto-desativado"}  type="text" id="nome" name="userName" disabled={!ativado} value={nomeCliente} onChange={e => setNomeCliente(e.target.value)} />
                            </div>                            
                    
                        </div>
                        <div>
                            <label for="valorCompra">Telefone:</label>
                            <div className="inputs-produtos">                    
                            <input className={ ativado ? "input-produto":"input-produto-desativado"} type="number" id="valorCompra" disabled={!ativado} value={telefone} onChange={e => setTelefone(e.target.value)}/>
                            </div>   
                            
                        </div>                        
                        <div className="inputs-produtos">                    
                            
                            <button hidden={!ativado} className="btn-pdt-cadastrar" onClick={salvar}>Salvar</button>
                        </div>
                        </div> : 
                        <div></div>
                }
                
                </form>                  
                </div> :
                <div></div>
            }
            

            </body>
            </div>            
}
            {dialog.isLoading && (<Dialog
                //Update
                nameProduct={dialog.nome}
                onDialog={areUSure}
                message={dialog.message}
            />)}
        </div>
    );
}