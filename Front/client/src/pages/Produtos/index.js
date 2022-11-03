import React,{useState} from "react";
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Collapse} from 'react-collapse';
import moment from 'moment';
import DialogInput from "../../layout/DialogInput";

import Loading from '../../layout/Loading';

import api from '../../services/api'


import './style.css';
import CabechalhoManage from "../../layout/CabecalhoManage";


export default function Produtos(){
  
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
    const [fornecedorId, setFornecedorId] = useState();    
    const [fornecedores, setFornecedores] = useState([]);
    const [produtos, setProdutos] = useState([]);

    //Variaveis Venda
    const [clientes ,setClientes] = useState([]);
    const [clienteId, setClienteId] = useState();
    const [vendas, setVendas] = useState([]);
    

    //variavel busca
    const [nomeFornecedor, setNomeFornecedor] = useState('');
    const [nomeProdutoBusca, setNomeProdutoBusca] = useState('');
    const [nomeCliente, setNomeCliente] = useState('');    

    const [dialogInput, setDialogInput] = useState({
        message: "",
        isLoading: false,
        motivo: "",
        valor: 0,
        idVenda: 0,
        produto: [],
        evento: null
    });

   
    const handleDialogInput = (message, isLoading, motivo, valor, idVenda, produto, evento) => {
        setDialogInput({
            message,
            isLoading,        
            motivo,
            valor,
            idVenda,
            produto,
            evento
    });
    };      

    const areUSureDevolucao = (params) => {
        if (params.validacao) {
            console.log(params.validacao);
            let jsonEnviar = {
                
                vendaId: dialogInput.idVenda,
                produtosVOS:[
                    dialogInput.produto
                ],
                motivo: params.motivoDevolucao,
                valorDevolucao: params.valorDevolucao
            }
            
            salvarDevolucao(dialogInput.evento, jsonEnviar);
            
            handleDialogInput("", false);
        } else {          
            console.log(params);  
            handleDialogInput("", false);
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
                    nomeFornecedor: nomeFornecedor,
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

    async function buscarClientes(e){
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
                    let opcoes = [];
                  responses.data._embedded.clienteVoes.forEach(c=>{
                    let opcao = {value: c.id, label: c.nomeCliente};
                    opcoes.push(opcao)                    
                  })
                  setClientes(opcoes);
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

    async function buscarVendas(e){
        e.preventDefault();        
        try{              

            await api.get(`venda/findAllByClienteForDevolution/${clienteId.value}`,{                
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
              }).then(responses => {
                    let vendas = [];
                    
                  responses.data._embedded.vendaVoes.forEach(v=>{
                    
                    let venda = {value: v.id, 
                                 label: "Venda:"+v.id+" Data:"+ moment(v.cadastradoEm).format("DD/MM/YYYY")+" Valor total: "+v.valorTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
                                 vendaDevolucao: v,
                                 exibeCollapse: false };
                    vendas.push(venda)                    
                  })
                  setVendas(vendas);
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
                    nomeProduto: nomeProdutoBusca,
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
                setFornecedorId(response.data.fornecedorId); 
                setEstoque(response.data.estoque);                
                setNomeFornecedor(response.data.fornecedorVO.nomeFornecedor);
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
        console.log(fornecedores.length)
    }

    async function expandir(e, param){        
        e.preventDefault();
        const index = vendas.findIndex((t) => {
            return t.value === param;
        });
            
        const tempTest = [...vendas];
        
        tempTest[index].exibeCollapse = !tempTest[index].exibeCollapse;
            
        setVendas(tempTest);        
        
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
            fornecedorId,
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

      async function salvarDevolucao(e, json){
        e.preventDefault();
        setLoadOn(true);                
        const data = json;
    
        try{
    
          await api.post('devolucao/salvar',data,{
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
          });
            
          toast.success('Devolução realizada com sucesso.', {
            position: toast.POSITION.TOP_CENTER
          })
        setLoadOn(false);                      
        setVisao('default');
        

        } catch (err){
            toast.error('Erro ao devolver produto.', {
                position: toast.POSITION.TOP_CENTER
              })
            setLoadOn(false);
        }
    
      };  

    async function devolver(e, motivo, valor, idVenda, produto) {        
        e.preventDefault();
        handleDialogInput("Deseja devolver o produto?", true, motivo, valor, idVenda, produto, e);
    } 

    return(
        <div id="containerPrincipal">
            {loadOn? <Loading></Loading>:
            <div>
            <CabechalhoManage></CabechalhoManage>
            <body>
            {
            visao === 'default' ? 
                <div className="container-info">
                <div className="item item1"><button onClick={()=> mudarVisao('cadastrar')} className="btn-item">Cadastrar Produto</button></div>
                <div className="item item2"><button onClick={()=> mudarVisao('devolver')} className="btn-item">Devolver Produto</button></div>
                <div className="item item3"><button className="btn-item">Excluir Produto</button></div>
                <div className="item item3"><button onClick={()=> mudarVisao('consultar')} className="btn-item">Consultar Produto</button></div>
                </div> :
                visao === 'cadastrar' ?   
                <div>
                <form>
                <div className="busca">
                    <input className="input-busca-produto" type="text" placeholder="Buscar Fornecedor" value={nomeFornecedor} onChange={e => setNomeFornecedor(e.target.value)} />
                    <button onClick={ buscarFornecedores } className="button-buscar">Buscar</button>                                                                                                                                                     
                </div>
                <div>
                    <label for="nome">Nome Produto:</label>
                </div>
                <div className="inputs-produtos">
                    <input className="input-produto" type="text" id="nome" name="userName" placeholder="Ex: Calça numero 42, Relógio marca..." value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} />
                <div>                    
                    <label for="fornecedor">Fornecedor:</label>
                </div>
                    
                    { fornecedores.length > 0 ? 
                        <select id="fornecedor" className="input-select-busca" name="select" value={fornecedorId} onChange={e=> setFornecedorId(e.target.value)}>
                                <option value="">Selecione uma Opção!</option>
                                {fornecedores.map( p=>(
                                          <option value={p.id}>{p.nomeFornecedor}</option>                                     
                                ))}
                            
                        </select>
                    : <input className="input-produto" type="text" id="fornecedor" disabled readonly/>}
                    
                </div>
                <div>
                    <label for="valorCompra">Valor Compra:</label>
                    <div className="inputs-produtos">                    
                        <input className="input-produto" type="number" id="valorCompra" placeholder="Ex: 49,90" value={valorCompra} onChange={e => setValorCompra(e.target.value)}/>
                    </div>                    
                    <label for="valorVenda">Valor Venda:</label>
                    <div className="inputs-produtos">                    
                        <input className="input-produto" type="number" id="valorVenda"  placeholder="Ex: 49,90" value={valorVenda} onChange={e => setValorVenda(e.target.value)}/>
                    </div> 
                    
                </div>
                <div>
                    <label for="codigoBarra">Código de Barra:</label>
                    <div className="inputs-produtos">                    
                        <input className="input-produto-2" type="number" id="codigoBarra" placeholder="Utilizar leitor ou digite" value={codigoBarra} onChange={e => setCodigoBarra(e.target.value)}/>                   
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
                    <input className= {editando ? "input-produto-desativado" : "input-busca-produto"}  type="text" placeholder="Buscar Produtos por nome." disabled={editando} value={nomeProdutoBusca} onChange={e => setNomeProdutoBusca(e.target.value)} />
                    <button onClick={ buscarProdutos } className="button-buscar">Buscar</button>                      
                    { produtos.length > 0 ? 
                        <div className="select-produtos">
                        <select id="produto" className="input-select-busca" name="select" disabled={editando} value={id} onChange={e=> setId(e.target.value)}>
                                <option value="">Selecione uma Opção!</option>
                                {produtos.map( p=>(
                                          <option value={p.id}>{p.nomeProduto}</option>                                     
                                ))}
                            
                        </select>
                        <button onClick={ buscarProdutosPorId } className="button-buscar">Buscar</button>
                        {
                            ativado ? '':<button onClick={ editar } className="button-editar">Editar</button>  
                        }
                        
                        </div>  
                    : "" }                                                                                                                                                   
                </div>
                { varVisivel ? 
                    <div>
                        <div>
                            <label for="nome">Nome Produto:</label>
                            <div className="inputs-produtos">                    
                            <input className= { ativado ? "input-produto":"input-produto-desativado"}  type="text" id="nome" name="userName" disabled={!ativado} value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} />
                            </div>
                            <label for="fornecedor">Fornecedor:</label>
                            <div className="inputs-produtos">                    
                            <input className= { ativado ? "input-produto":"input-produto-desativado"} type="text" id="fornecedor" disabled={!ativado} value={nomeFornecedor} onChange={e => setNomeFornecedor(e.target.value)} />
                            </div>
                    
                        </div>
                        <div>
                            <label for="valorCompra">Valor Compra:</label>
                            <div className="inputs-produtos">                    
                            <input className={ ativado ? "input-produto":"input-produto-desativado"} type="number" id="valorCompra" disabled={!ativado} value={valorCompra} onChange={e => setValorCompra(e.target.value)}/>
                            </div>    
                            
                            
                            <label for="valorVenda">Valor Venda:</label>
                            <div className="inputs-produtos">                    
                            <input className={ ativado ? "input-produto":"input-produto-desativado"} type="number" id="valorVenda"  disabled={!ativado} value={valorVenda} onChange={e => setValorVenda(e.target.value)}/>
                            </div>    
                            
                        </div>
                        <div>
                            <label for="codigoBarra">Código de Barra:</label>
                            <div className="inputs-produtos">                    
                            <input className={ ativado ? "input-produto-2": "input-produto-desativado-2"} type="number" id="codigoBarra" disabled={!ativado} value={codigoBarra} onChange={e => setCodigoBarra(e.target.value)}/>                   
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
                visao === 'devolver' ?
                <div>
                    <form>
                        <div className="busca">
                            <input className="input-busca-produto" type="text" placeholder="Buscar Clientes" value={nomeCliente} onChange={e => setNomeCliente(e.target.value)} />
                            <button onClick={ buscarClientes } className="button-buscar">Buscar</button>                                                                                                                                                     
                        </div>
                        <label for="fornecedor">Clientes:</label>
                    { clientes.length > 0 ? 
                        <div>                                                
                        <Select 
                        options={clientes} 
                        isSearchable={true}
                        onChange={(item)=> setClienteId(item)}
                        
                        />
                        <button onClick={ buscarVendas } className="button-buscar-novo-select">Buscar</button>
                            {vendas.length > 0 ?
                            
                            <div>
                            {vendas.map( v=>(                                    
                                    <div>                                        
                                        <button onClick={ e=> expandir(e, v.value) }className="button-item-expandir">{v.label}</button>
                                        <Collapse isOpened={v.exibeCollapse} theme={{collapse: 'foo', content: 'bar'}}>
                                        
                                        <div className="exibir-venda">
                                            <label className="label-devolucao">Número Venda</label>
                                            <input className="input-devolucao" disabled={true} value={v.vendaDevolucao.id}></input>                                            
                                            <label className="label-devolucao">Data Venda</label>
                                            <input className="input-devolucao" disabled={true} value={ moment(v.vendaDevolucao.cadastradoEm).format("DD/MM/YYYY")}></input>                                            
                                            <br/>
                                            {v.vendaDevolucao.produtosVOS.map( p=>(
                                                <div className="container-devolucao">                                                
                                                    <label className="label-devolucao">Nome produto</label>
                                                    <input className="input-devolucao" disabled={true} value={ p.nomeProduto }></input>                                            
                                                    <label className="label-devolucao">Valor de Venda</label>
                                                    <input className="input-devolucao" disabled={true} value={ p.valorVenda.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) }></input>                                            
                                                    {p.possuiDevolucao ? 
                                                    <button className="button-devolucao-disabled" disabled={true}>Já devolvido</button>:
                                                    <button className="button-devolucao" onClick={e=> devolver( e, "Digite o motivo", 0, v.value, p )} >Devolver</button>
                                                    }
                                                </div>
                                            ) )

                                            }
                                            <br/>
                                            <label className="label-devolucao">Total Venda</label>
                                            <input className="input-devolucao" disabled={true} value={v.vendaDevolucao.valorTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}></input>                                            

                                        </div>
                                        </Collapse>
                                    </div>
                                    
                                ))}
                            

                            </div> : ""
                            }


                        </div>                        
                                
                            
                        
                    : <input className="input-produto" type="text" id="fornecedor" disabled readonly/>}

                    </form>
                    

                </div> :
                <div>
                <form>
                <div className="busca">
                    <input className="input-busca-produto" type="text" placeholder="Buscar Fornecedor" value={nomeFornecedor} onChange={e => setNomeFornecedor(e.target.value)} />
                    <button onClick={ buscarFornecedores } className="button-buscar">Buscar</button>                                                                                                                                                     
                </div>
                <div>
                    <label for="nome">Nome Produto:</label>
                    <input className="input-produto" type="text" id="nome" name="userName" placeholder="Ex: Calça numero 42, Relógio marca..." value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} />
                    <label for="fornecedor">Fornecedor:</label>
                    { fornecedores.length > 0 ? 
                        <select id="fornecedor" className="input-select-busca" name="select" value={fornecedorId} onChange={e=> setFornecedorId(e.target.value)}>
                                <option value="">Selecione uma Opção!</option>
                                {fornecedores.map( p=>(
                                          <option value={p.id}>{p.nomeFornecedor}</option>                                     
                                ))}
                            
                        </select>
                    : <input className="input-produto" type="text" id="fornecedor" disabled readonly/>}
                    
                </div>
                <div>
                    <label for="valorCompra">Valor Compra:</label>
                    <input className="input-produto" type="number" id="valorCompra" placeholder="Ex: 49,90" value={valorCompra} onChange={e => setValorCompra(e.target.value)}/>
                    <label for="valorVenda">Valor Venda:</label>
                    <input className="input-produto" type="number" id="valorVenda"  placeholder="Ex: 49,90" value={valorVenda} onChange={e => setValorVenda(e.target.value)}/>
                </div>
                <div>
                    <label for="codigoBarra">Código de Barra:</label>
                    <div className="inputs-produtos">                    
                    <input className="input-produto-2" type="number" id="codigoBarra" placeholder="Utilizar leitor ou digite" value={codigoBarra} onChange={e => setCodigoBarra(e.target.value)}/>                   
                    </div>                     
                </div>
                <div>
                <button className="btn-pdt-cadastrar" onClick={salvar}>Cadastrar</button>
                </div>
                </form>                  
                </div>
            }
            

            </body>
            </div>            
}
            
            {dialogInput.isLoading && (<DialogInput
                                
                onDialog={areUSureDevolucao}
                message={dialogInput.message}
                    
            />)}             
        </div>
    );
}