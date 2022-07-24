import React,{useState, useEffect} from "react";
import { useHistory} from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loading from '../../layout/Loading';

import api from '../../services/api'


import './style.css';
import CabechalhoManage from "../../layout/CabecalhoManage";
import Dialog from "../../layout/DialogConfirm";

export default function Vendas(){    

    //Tela Carregar
    const [loadOn, setLoadOn] = useState(false);

    const accessToken = sessionStorage.getItem('accessToken');  

    //Variaveis produto
    const [id, setId] = useState();    
    const [nomeProduto, setNomeProduto] = useState('');
    const [clienteId, setClienteId] = useState(0);    
    const [produtoId, setProdutoId] = useState(0);        
    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [produtosCarrinho, setProdutosCarrinho] = useState([]);
    const [valorTotal, setValorTotal] = useState(0);
    const [formasPagamento, setFormasPagamento] = useState([]);

    const[faltaReceber, setFaltaReceber] = useState(0);
    const[formaPagamentos, setFormaPagamentos] = useState('');
    const[valorPagamento, setValorPagamento] = useState();
    const[numeroParcelas, setNumeroParcelas] = useState(0);
    const[pagamentoVOS, setPagamentoVOS] = useState([]);

    const history = useHistory();


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
    
    useEffect(()=> {
        try{              

            api.get('venda/formas-pagamento',{                
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
              }).then(responses => {
                  setFormasPagamento(responses.data);                  
              })          
        

        } catch (erro){
            toast.error('Busca não retornou dados.', {
                position: toast.POSITION.TOP_CENTER
              })            
        }

    },[accessToken])

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
    

    async function incluirProduto(e){
        e.preventDefault();
        let produtosRestantes =  [];
        let produtosAdicionados = [];
        if(produtosCarrinho.length > 0){
            produtosAdicionados = produtosCarrinho;
        }

        
                
        produtos.forEach( pdt =>{
            let value = Number(pdt.id);
            let value2 = Number(produtoId);
            if( value !== value2 ){
                console.log('Passou aqui');
                produtosRestantes.push(pdt);
            } else {
                console.log('Passou acula');
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
        
        setFaltaReceber(total)
        
    }

    async function incluirPagamento(e){
        e.preventDefault();


        if(formaPagamentos==='default'){
            
            toast.warning('Informe o uma forma de pagamento.', {
                position: toast.POSITION.TOP_CENTER
              })
            
        } else {
            if(!valorPagamento){
                toast.warning('Informe o valor do pagamento.', {
                    position: toast.POSITION.TOP_CENTER
                  })
                
            } else {

                if(valorPagamento > faltaReceber){
                    toast.warning('Valor do pagamento deve ser igual ou menor que o total a pagar.', {
                        position: toast.POSITION.TOP_CENTER
                      })
                    
                } else {

                    if(formaPagamentos === 'CARTAO_A_PRAZO' && numeroParcelas<2){
                        toast.warning('Incluir número de parcelas válidos. Em caso de 1 parcela, utilizar Cartão á vista.', {
                            position: toast.POSITION.TOP_CENTER
                          })
                    } else {
                        let pagamentosAdicionados = [];
                        if(pagamentoVOS.length > 0){
                            pagamentosAdicionados = pagamentoVOS;
                        }
                                
                        let pagamentoVO = {
                            valorPagamento,
                            numeroParcelas,
                            formaPagamentos
                        }
                
                        let falta = faltaReceber - valorPagamento;
                
                
                        pagamentosAdicionados.push(pagamentoVO);
                
                        setPagamentoVOS(pagamentosAdicionados);
                
                        setFormaPagamentos('default');
                        setValorPagamento('');
                        setFaltaReceber(falta);
                    
                    }
                    
                    
                }

            }

        }

        
    }
      

    async function salvar(e){
        e.preventDefault();
        setLoadOn(true); 
        
        let produtosVOS = produtosCarrinho;
        const data = {
            id,
            clienteId,
            produtosVOS,
            pagamentoVOS            
        }
    
        try{
    
          await api.post('venda/salvar',data,{
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
          });
            
          toast.success('Venda salva com sucesso.', {
            position: toast.POSITION.TOP_CENTER
          })
        setLoadOn(false);
        setId('');
        
        setProdutos([]);

        history.push('/manager');
                

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
                        <div className="select-produtos">
                                <select id="fornecedor" className="input-select-busca" name="select" value={formaPagamentos} onChange={e=> setFormaPagamentos(e.target.value)}>
                                        <option value="default">Selecione uma Opção!</option>
                                        {formasPagamento.map( p=>(
                                                <option value={p.valorEnum}>{p.descricao}</option>                                     
                                        ))}
                                    
                                </select>  
                                <button onClick={ incluirPagamento } className="button-buscar">Inlcuir</button>                              
                        </div>

                        {
                            formaPagamentos === '' || formaPagamentos === 'default'? '':
                            formaPagamentos !== 'CARTAO_A_PRAZO' ?
                            <div className="inputs-produtos">                    
                                <input className="input-produto" type="number" value={valorPagamento} onChange={e=> setValorPagamento(e.target.value)}/>
                            </div> : 
                            
                            <div>
                                <div className="inputs-produtos">                    
                                    <input className="input-produto" type="number" placeholder="Valor do pagamento." value={valorPagamento} onChange={e=> setValorPagamento(e.target.value)}/>
                                </div>
                                <div className="inputs-produtos">                    
                                    <input className="input-produto" type="number" placeholder="Número de Parcelas." value={numeroParcelas} onChange={e=> setNumeroParcelas(e.target.value)}/>
                                </div>
                            </div>
                                                        
                        }

                        {
                            produtosCarrinho.length>0 ?
                            <div>
                                <label for="valorVenda">Falta pagar:</label>
                                <div className="inputs-produtos">                                            
                                    <input className="input-produto-desativado" disabled type="number" value={faltaReceber} onChange={e=> setFaltaReceber(e.target.value)}/>                            
                                </div>
                            </div>
                            
:''
                        }
                        
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