import React,{useState} from "react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loading from '../../layout/Loading';

import api from '../../services/api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'

import './style.css';
import CabechalhoManage from "../../layout/CabecalhoManage";
import Dialog from "../../layout/DialogConfirm";

export default function Produtos(){
  
    //Visão tela
    const [visao, setVisao] = useState('default');

    //Tela Carregar
    const [loadOn, setLoadOn] = useState(false);

    const accessToken = sessionStorage.getItem('accessToken');  
    
    //Variavel para desativados
    const [ativado, setAtivado] = useState(true);
    const [varVisivel, setVarVisivel] = useState(false);

    //Variaveis produto
    const [id, setId] = useState();
    const [nomeProduto, setNomeProduto] = useState('');
    const [valorCompra, setValorCompra] = useState('');
    const [valorVenda, setValorVenda] = useState('');
    const [codigoBarra, setCodigoBarra] = useState('');
    const [fornecedorId, setFornecedorId] = useState();    
    const [fornecedores, setFornecedores] = useState([]);
    const [produtos, setProdutos] = useState([]);    

    //variavel busca
    const [nomeFornecedor, setNomeFornecedor] = useState('');
    const [nomeProdutoBusca, setNomeProdutoBusca] = useState('');

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

    async function salvar(e){
        e.preventDefault();
        setLoadOn(true);                
        const data = {
            id,
            nomeProduto,
            valorCompra,
            valorVenda,
            codigoBarra,
            fornecedorId
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
        
        setProdutos([]);
        setVarVisivel(false);
    
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
                <div className="item item1"><button onClick={()=> mudarVisao('cadastrar')} className="btn-item">Cadastrar Produto</button></div>
                <div className="item item2"><button className="btn-item">Devolver Produto</button></div>
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
                    <input className="input-produto-2" type="number" id="codigoBarra" placeholder="Utilizar leitor ou digite" value={codigoBarra} onChange={e => setCodigoBarra(e.target.value)}/>                   
                </div>
                <div>
                <button className="btn-pdt-cadastrar" onClick={salvar}>Cadastrar</button>
                </div>
                </form>                  
                </div> :
                visao === 'consultar' ?   
                <div>
                <form>
                <div className="busca">
                    <input className="input-busca-produto" type="text" placeholder="Buscar Produtos por nome." value={nomeProdutoBusca} onChange={e => setNomeProdutoBusca(e.target.value)} />
                    <button onClick={ buscarProdutos } className="button-buscar">Buscar</button>                      
                    { produtos.length > 0 ? 
                        <div>
                        <select id="produto" className="input-select-busca" name="select" value={id} onChange={e=> setId(e.target.value)}>
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
                            <input className= { ativado ? "input-produto":"input-produto-desativado"}  type="text" id="nome" name="userName" disabled={!ativado} value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} />
                            <label for="fornecedor">Fornecedor:</label>
                            <input className= { ativado ? "input-produto":"input-produto-desativado"} type="text" id="fornecedor" disabled={!ativado} value={nomeFornecedor} onChange={e => setNomeFornecedor(e.target.value)} />
                    
                        </div>
                        <div>
                            <label for="valorCompra">Valor Compra:</label>
                            <input className={ ativado ? "input-produto":"input-produto-desativado"} type="number" id="valorCompra" disabled={!ativado} value={valorCompra} onChange={e => setValorCompra(e.target.value)}/>
                            <label for="valorVenda">Valor Venda:</label>
                            <input className={ ativado ? "input-produto":"input-produto-desativado"} type="number" id="valorVenda"  disabled={!ativado} value={valorVenda} onChange={e => setValorVenda(e.target.value)}/>
                        </div>
                        <div>
                            <label for="codigoBarra">Código de Barra:</label>
                            <input className={ ativado ? "input-produto-2": "input-produto-desativado-2"} type="number" id="codigoBarra" disabled={!ativado} value={codigoBarra} onChange={e => setCodigoBarra(e.target.value)}/>                   
                        </div>
                        <div>
                            <button hidden={!ativado} className="btn-pdt-cadastrar" onClick={salvar}>Salvar</button>
                        </div>
                        </div> : 
                        <div></div>
                }
                
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
                    <input className="input-produto-2" type="number" id="codigoBarra" placeholder="Utilizar leitor ou digite" value={codigoBarra} onChange={e => setCodigoBarra(e.target.value)}/>                   
                </div>
                <div>
                <button className="btn-pdt-cadastrar" onClick={salvar}>Cadastrar</button>
                </div>
                </form>                  
                </div>
            }
            

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
            {dialog.isLoading && (<Dialog
                //Update
                nameProduct={dialog.nome}
                onDialog={areUSure}
                message={dialog.message}
            />)}
        </div>
    );
}