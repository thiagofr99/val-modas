import React,{useState} from "react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loading from '../../layout/Loading';

import api from '../../services/api'


import './style.css';
import CabechalhoManage from "../../layout/CabecalhoManage";
import Dialog from "../../layout/DialogConfirm";

export default function Fornecedores(){
  
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
    const [nomeFornecedor, setNomeFornecedor] = useState('');    
    const [telefone, setTelefone] = useState('');    


    //variavel busca    
    const [nomeFornecedorBusca, setNomeFornecedorBusca] = useState('');
    const [fornecedores, setFornecedores] = useState([]);

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
    

    async function buscarFornecedores(e){
        e.preventDefault();
        try{              
               
            await api.get('fornecedor/findAllByFornecedorName',{                
                headers:{
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    nomeFornecedor: nomeFornecedorBusca,
                    page: 0,
                    limit: 10,
                    direction: 'asc'
                }
              }).then(responses => {
                setFornecedores(responses.data._embedded.fornecedorVoes);                  
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

    async function buscarFornecedoresPorId(e){
        e.preventDefault();
        try{
                       
            setAtivado(false);   
            await api.get(`fornecedor/${id}`,{                
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
              }).then(response => {
                setNomeFornecedor(response.data.nomeFornecedor);
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
            nomeFornecedor,
            telefone
        }
    
        try{
    
          await api.post('fornecedor/salvar',data,{
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
          });
            
          toast.success('Cliente salvo com sucesso.', {
            position: toast.POSITION.TOP_CENTER
          })
        setLoadOn(false);
        setNomeFornecedor('');
        setTelefone('');
        
        setFornecedores([]);
        setVarVisivel(false);
        setVisao('default');
        setEditando(false);

        } catch (err){
            toast.error('Erro ao salvar Fornecedor.', {
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
                <div className="item item1"><button onClick={()=> mudarVisao('cadastrar')} className="btn-item">Cadastrar Fornecedor</button></div>                
                <div className="item item3"><button onClick={()=> mudarVisao('consultar')} className="btn-item">Consultar Fornecedor</button></div>
                </div> :
                visao === 'cadastrar' ?   
                <div>
                <form>                
                <div>
                    <label for="nome">Nome Fornecedor:</label>
                </div>
                <div className="inputs-produtos">
                    <input className="input-produto" type="text" id="nome" name="userName" placeholder="Digite o nome do Fornecedor." value={nomeFornecedor} onChange={e => setNomeFornecedor(e.target.value)} />                                                                        
                </div>
                <div>
                    <label for="valorCompra">Telefone Fornecedor:</label>
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
                    <input className= {editando ? "input-produto-desativado" : "input-busca-produto"}  type="text" placeholder="Buscar Fornecedores por nome." disabled={editando} value={nomeFornecedorBusca} onChange={e => setNomeFornecedorBusca(e.target.value)} />
                    <button onClick={ buscarFornecedores } className="button-buscar">Buscar</button>                      
                    { fornecedores.length > 0 ? 
                        <div className="select-produtos">
                        <select id="produto" className="input-select-busca" name="select" disabled={editando} value={id} onChange={e=> setId(e.target.value)}>
                                <option value="">Selecione uma Opção!</option>
                                {fornecedores.map( p=>(
                                          <option value={p.id}>{p.nomeFornecedor}</option>                                     
                                ))}
                            
                        </select>
                        <button onClick={ buscarFornecedoresPorId } className="button-buscar">Buscar</button>
                        {
                            ativado ? '':<button onClick={ editar } className="button-editar">Editar</button>  
                        }
                        
                        </div>  
                    : "" }                                                                                                                                                   
                </div>
                { varVisivel ? 
                    <div>
                        <div>
                            <label for="nome">Nome Fornecedor:</label>
                            <div className="inputs-produtos">                    
                            <input className= { ativado ? "input-produto":"input-produto-desativado"}  type="text" id="nome" name="userName" disabled={!ativado} value={nomeFornecedor} onChange={e => setNomeFornecedor(e.target.value)} />
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