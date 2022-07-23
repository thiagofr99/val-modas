import React,{useState} from "react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loading from '../../layout/Loading';

import api from '../../services/api'


import './style.css';
import CabechalhoManage from "../../layout/CabecalhoManage";
import Dialog from "../../layout/DialogConfirm";

export default function Vendas(){
  
    //Visão tela
    const [visao, setVisao] = useState('default');

    //Tela Carregar
    const [loadOn, setLoadOn] = useState(false);

    const accessToken = sessionStorage.getItem('accessToken');  
    
    //Variavel para desativados
    const [ativado, setAtivado] = useState(true);
    const [varVisivel, setVarVisivel] = useState(false);
    const [editando, setEditando] = useState(false)

    //Variaveis produto
    const [id, setId] = useState();
    const [estoque, setEstoque] = useState();
    const [nomeProduto, setNomeProduto] = useState('');
    const [valorCompra, setValorCompra] = useState('');
    const [valorVenda, setValorVenda] = useState('');
    const [codigoBarra, setCodigoBarra] = useState('');
    const [clienteId, setClienteId] = useState(0);    
    const [produtoId, setProdutoId] = useState(0);    
    const [fornecedores, setFornecedores] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [produtosCarrinho, setProdutosCarrinho] = useState([]);
    const [valorTotal, setValorTotal] = useState(0);


    //variavel busca
    const [nomeCliente, setNomeCliente] = useState('');
    

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

            await api.get('cliente/findAllByClienteName',{                
                headers:{
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    nomeCliente: nomeCliente,
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

    async function buscarProdutos(e){
        e.preventDefault();
        try{              
               
            await api.get('produto/findAllByProdutoName',{                
                headers:{
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    nomeProduto: nomeProduto,
                    page: 0,
                    limit: 10,
                    direction: 'asc'
                }
              }).then(responses => {
                setProdutos(responses.data._embedded.produtoVoes);                  
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

    async function buscarProdutosPorId(e){
        e.preventDefault();
        try{
                       
            setAtivado(false);   
            await api.get(`produto/${id}`,{                
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
              }).then(response => {
                setNomeProduto(response.data.nomeProduto);
                setValorCompra(response.data.valorCompra);
                setValorVenda(response.data.valorVenda);
                setCodigoBarra(response.data.codigoBarra);  
                setClienteId(response.data.clienteId); 
                setEstoque(response.data.estoque);
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

    async function incluirProduto(e){
        e.preventDefault();
        let produtosRestantes =  [];
        let produtosAdicionados = [];
        if(produtosCarrinho.length > 0){
            produtosAdicionados = produtosCarrinho;
        }
                
        produtos.map( pdt =>{
            if( pdt.id != produtoId ){
                produtosRestantes.push(pdt);
            } else {
                produtosAdicionados.push(pdt);
            }
        })

        let total = 0;

        produtosAdicionados.forEach(p=>{
            total += p.valorVenda;
        })

        setProdutos(produtosRestantes);

        setProdutosCarrinho(produtosAdicionados);

        setValorTotal(total)
        
        
    }
      
    async function mudarVisao(param){
        setVisao(param);
        console.log(fornecedores.length)
    }

    async function salvar(e){
        e.preventDefault();
        setLoadOn(true);                
        const data = {
            id,
            nomeProduto,
            valorCompra,
            valorVenda,
            codigoBarra,
            clienteId,
            estoque
        }
    
        try{
    
          await api.post('produto/salvar',data,{
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
          });
            
          toast.success('Produto salvo com sucesso.', {
            position: toast.POSITION.TOP_CENTER
          })
        setLoadOn(false);
        setNomeProduto('');
        setValorCompra('');
        setValorVenda('');
        setCodigoBarra(''); 
        setId('');
        
        setProdutos([]);
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
                <div>
                <form>
                <div className="busca">
                    <input className="input-busca-produto" type="text" placeholder="Buscar Cliente" value={nomeCliente} onChange={e => setNomeCliente(e.target.value)} />
                    <button onClick={ buscarFornecedores } className="button-buscar">Buscar</button>                                                                                                                                                     
                </div>
                { clientes.length > 0 ?
                    <div className="select-produtos"> 
                        <select id="fornecedor" className="input-select-busca" name="select" value={clienteId} onChange={e=> setClienteId(e.target.value)}>
                                <option value="">Selecione uma Opção!</option>
                                {clientes.map( p=>(
                                          <option value={p.id}>{p.nomeCliente}</option>                                     
                                ))}
                            
                        </select>
                    </div> 
                    :''}
                {
                clienteId>0 ?
                    <div>
                        <div className="busca">
                        <input className="input-busca-produto" type="text" placeholder="Buscar Produto" value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} />
                        <button onClick={ buscarProdutos } className="button-buscar">Buscar</button>                                                                                                                                                     
                        </div>
                                                                            
                            {produtos.length > 0 ?
                                <div className="select-produtos">
                                <select id="fornecedor" className="input-select-busca" name="select" value={produtoId} onChange={e=> setProdutoId(e.target.value)}>
                                        <option value="">Selecione uma Opção!</option>
                                        {produtos.map( p=>(
                                                <option value={p.id}>{p.nomeProduto}</option>                                     
                                        ))}
                                    
                                </select>
                                <button onClick={ incluirProduto } className="button-buscar">Inlcuir</button>
                                </div>
                            : ''}

                        

                        {produtosCarrinho.length>0 ?
                            <div>                         
                            <label for="valorVenda">Carrinho:</label>
                            
                            {produtosCarrinho.map( p=>( 
                                <div className="inputs-produtos">                    
                                <input className="input-carrinho-desativado" disabled type="text" value={p.nomeProduto}/>
                                <input className="input-carrinho-desativado" disabled type="number" value={p.valorVenda}/>
                                </div> 
                            ))}   
                            </div> 
                            : ''                        
                        }

                        <div>                         
                            <label for="valorVenda">Valor total da Venda:</label>
                            <div className="inputs-produtos">                    
                                <input className="input-produto-desativado" disabled type="number" value={valorTotal}/>
                            </div> 
                            
                        </div>                        
                        <div className="inputs-produtos">
                        <button className="btn-pdt-cadastrar" onClick={salvar}>Vender</button>
                        </div>
                    </div>
                : ''
                }
                
                </form>                  
                </div>                         

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