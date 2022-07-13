import React,{useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";


import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'

import api from '../../services/api'

import './style.css';
import CabechalhoManage from "../../layout/CabecalhoManage";
import Dialog from "../../layout/DialogConfirm";

export default function Produto(){

    const {cdpId} = useParams();

    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        //Update
        nameProduct: "",
        idProduct: "",
        operation: ""
      });

    const handleDialog = (message, isLoading, nameProduct, idProduct, operation) => {
    setDialog({
        message,
        isLoading,
        //Update
        nameProduct,
        idProduct,
        operation
    });
    };  

    const [produtos, setProdutos] = useState([]);
    const [tipo, setTipo] = useState([]);
    const [tipoResponse, setTipoResponse] = useState();
    const [observacao, setObservacao] = useState('');
    
    const[produtoNome, setProdutoNome] = useState('');
    const[valor, setValor] = useState('');
    

    

    const areUSureDelete = (choose) => {
        if (choose) {
          dialog.operation==="delete" ? deleteProduct() :
          disponibilityProduct();
          
          handleDialog("", false);
        } else {
          
          handleDialog("", false);
        }
      };


    const history = useHistory();

    const accessToken = sessionStorage.getItem('accessToken');

    useEffect(()=> {
    
        buscarPorCardapio();
        
        api.get(`api/produto/v1/tipo-produto`, {
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            setTipo(response.data)
        })
        
    },[]);

    async function alterar(id){
        history.push(`/editar/${id}`);
    }

    async function deleteProduct(){
        try {
            await api.delete(`api/produto/v1/${dialog.idProduct}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            
            toast.success('Produto deletado com sucesso.', {
                position: toast.POSITION.TOP_CENTER
              })     
            setProdutos(produtos.filter(c => c.id !== dialog.idProduct))
        } catch (err) {
            toast.error('Erro ao deletar produto.', {
                position: toast.POSITION.TOP_CENTER
              })
        }
    }

    async function disponibilityProduct(){
        try {
            await api.patch(`api/produto/v1/${dialog.idProduct}`,
            {},
            {    
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            toast.success('Produto alterado com sucesso.', {
                position: toast.POSITION.TOP_CENTER
              })   
            buscarPorCardapio();
        } catch (err) {
            toast.error('Erro ao alterar disponibilidade do produto.', {
                position: toast.POSITION.TOP_CENTER
              })   
        }

    }

    async function buscarPorCardapio(){
        api.get(`api/produto/v1/findAllByCardapio/${cdpId}`, {
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            setProdutos(response.data)
        })

    }

    async function excluir(id, nome) {
        handleDialog("Deseja excluir o item selecionado?", true, nome, id, "delete");
    }    

    async function alternarDisponivel(id, nome) {

        handleDialog("Deseja alterar disponibilidade do item selecionado?", true, nome, id, "disponibilidade");
    }    

    async function salvar(e) {
        e.preventDefault();

        var cardapioId = cdpId;
        var tipoProdutoVO = tipoResponse;
        var valorProduto = valor.replace(",",".");

        const data = {
            cardapioId,
            observacao,
            produtoNome,
            tipoProdutoVO,
            valorProduto,
        }

        try{
            await api.post('api/produto/v1/salvar',data,{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
              })
            
            setObservacao('');
            setProdutoNome('');
            setValor('');
            setTipoResponse('');
    
            toast.success('Produto salvo com sucesso.', {
                position: toast.POSITION.TOP_CENTER
              })   
            buscarPorCardapio();
        } catch( erro ){
            toast.error('Erro ao salvar produto.', {
                position: toast.POSITION.TOP_CENTER
              })   
        }

        
    }

    return(
        <div id="container">
           
            <CabechalhoManage></CabechalhoManage>
            <body>                

            <div id="consulta-2">
                    <div className="row-1">
                        <h2 className="text-consulta">SALVA UM NOVO PRODUTO.</h2>
                        
                    </div>
                    <div className="row-2">
                        <form className="consulta-1" onSubmit={salvar}>
                            <input className="input-3" type="text" name="produtoNome" value={produtoNome} onChange={e => setProdutoNome(e.target.value)} placeholder="Produto nome."/>
                            <input className="input-3" type="text" name="valorProduto" value={valor} onChange={e => setValor(e.target.value)} placeholder="Valor produto."/>
                            <input className="input-3" type="text" name="observacao" value={observacao} onChange={e => setObservacao(e.target.value)} placeholder="Observação."/>
                            <select id="tipo" className="input-select-3" name="select" value={tipoResponse} onChange={e=> setTipoResponse(e.target.value)}>
                                <option value="">Selecione uma Opção!</option>
                                {tipo.map( p=>(
                                          <option value={p.valorEnum}>{p.descricao}</option>                                     
                                ))}
                            
                            </select>
                            <input className="input-2" type="submit" value="Salvar" />
                        </form>
                    </div>
            </div>            
            
            <div id="lista-1">

                <table>
                    <tr>
                        <th>Nome do Produto</th>
                        <th>Valor Produto</th>
                        <th>Observação</th>
                        <th>Ultima Atualização</th>
                        <th>Ações</th>
                    </tr>
{produtos.map( p=>(                    

                            <tr key={p.id}>
                                <td> {p.produtoNome} </td>
                                <td> {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(p.valorProduto)} </td>
                                <td> {p.observacao} </td>
                                <td>{ p.dataAtualizacao ===null || p.dataAtualizacao ==='' ? Intl.DateTimeFormat('pt-BR').format(new Date(p.dataCadastro)):Intl.DateTimeFormat('pt-BR').format(new Date(p.dataAtualizacao))}</td>
                                <td>{ p.disponivel===true ? <button className="input-button-patch" onClick={()=> alternarDisponivel(p.id)} >Disponível</button> 
                                                            : <button className="input-button-deletar" onClick={()=> alternarDisponivel(p.id, p.produtoNome)} >Indisponível</button>}
                                    { p.disponivel===true ? <button className="input-button-alterar" onClick={()=> alterar(p.id)} >Alterar</button> :" "}
                                    <button className="input-button-deletar" onClick={()=> excluir(p.id, p.produtoNome)} >Excluir</button>
                                </td>
                            </tr>  
                    
                ))}                    
                </table>
             
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
            {dialog.isLoading && (<Dialog
                //Update
                nameProduct={dialog.nameProduct}
                onDialog={areUSureDelete}
                message={dialog.message}
            />)}
        </div>
    );
}