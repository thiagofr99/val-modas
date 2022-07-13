import React,{useState, useEffect} from "react";
import { useHistory, useParams} from "react-router-dom";


import './style.css';

import api from '../../services/api'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'
import CabechalhoManage from "../../layout/CabecalhoManage";
import Dialog from "../../layout/DialogConfirm";



export default function ProdutoAlterar(){

    const {idProduto} = useParams();

    const [produtoNome, setProdutoNome] = useState('');
    const [valor, setValor] = useState('');
    const [cardapioId, setCardapioId] = useState('');    
    const [tipoProdutoVO, setTipoProdutoVO] = useState('');
    const [disponivel, setDisponivel] = useState('');
    const [atualizacao, setAtualizacao] = useState('');
    const [cadastro, setCadastro] = useState('');
    const [observacao, setObservacao] = useState('');

    const [tipo, setTipo] = useState([]);    

    const accessToken = sessionStorage.getItem('accessToken');    
    
    const history = useHistory();

    const [data, setData] = useState({
        id: 0,
        valorProduto: 0,
        tipoProdutoVO: "", 
        produtoNome: "",
        observacao: "",
        cardapioId: "",
        disponivel: true
    })

    const handleData = (id, valorProduto, tipoProdutoVO, produtoNome, observacao, cardapioId, disponivel) => {
        setData({
            id,
            valorProduto,            
            tipoProdutoVO,
            produtoNome,
            observacao,
            cardapioId,
            disponivel
        });
    };

    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        //Update
        nameProduct: ""   
      });

    const handleDialog = (message, isLoading, nameProduct) => {
    setDialog({
        message,
        isLoading,
        //Update
        nameProduct
    });
    };
    
    const areUSure = (choose) => {
        if (choose) {
          update();
          handleDialog("", false);
        } else {
          
          handleDialog("", false);
        }
      };

    useEffect(()=> {
        findProdutoById();

        api.get(`api/produto/v1/tipo-produto`, {
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            setTipo(response.data)
        })
       
    },[]);

    


    async function findProdutoById(){
        
        try{
    
            const response = await api.get(`api/produto/v1/${idProduto}`,{                                
                headers:{
                  Authorization: `Bearer ${accessToken}`
              }
            })
            
            let dataCadastro = response.data.dataCadastro === null || response.data.dataCadastro === '' ? '': response.data.dataCadastro.split("T", 10)[0];
            let dataAtualizacao = response.data.dataAtualizacao === null || response.data.dataAtualizacao === '' ? '': response.data.dataAtualizacao.split("T", 10)[0];
        
            setProdutoNome(response.data.produtoNome);
            setValor(response.data.valorProduto);            
            setTipoProdutoVO(response.data.tipoProdutoVO);      
            setObservacao(response.data.observacao);
            setCardapioId(response.data.cardapioId);
            setDisponivel(response.data.disponivel);
            setAtualizacao(dataAtualizacao);
            setCadastro(dataCadastro);                       
      
          } catch (err){
            toast.error('Erro ao carregar dados do produto.', {
                position: toast.POSITION.TOP_CENTER
              })
              history.push(`/manager/`);
          }
        

    }  

    async function salvar(e){
        e.preventDefault();

        let valorProduto = valor.replace(",",".");
        var id = idProduto;

        handleData(id, valorProduto, tipoProdutoVO, produtoNome, observacao, cardapioId, disponivel);                
        
        handleDialog("Deseja realmente salvar o Produto?",true, produtoNome)
    
    };

    async function update(){
        try{
        
            await api.put('api/produto/v1/atualizar',data,{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            });
                
            toast.success('Produto salvo com sucesso.', {
                position: toast.POSITION.TOP_CENTER
              })                  
            setProdutoNome('');
            setValor('');
            setTipoProdutoVO('');
            setDisponivel('');
            setAtualizacao('');
            setCadastro('');

            history.push('/manager/');
            } catch (err){
                toast.error('Erro ao salvar dados do produto.', {
                    position: toast.POSITION.TOP_CENTER
                  })
                  history.push(`/manager/`);
            }
    }    


    return (
        <div id="container">
           
            <CabechalhoManage></CabechalhoManage>
            <body>
                <h1>Cadastro de Produtos.</h1>          
                <div id="lista-1">                    
                    <div className="empresa-alterar">
                        <h3>Nome Produto:</h3>
                        <input type="text" value={produtoNome} className="" disabled={false} onChange={e=>setProdutoNome(e.target.value)} />
                        <h3>Valor Produto:</h3>
                        <input type="text" className={""} disabled={false}  value={valor} onChange={e=>setValor(e.target.value)} />
                        <h3>Observação:</h3>
                        <input type="text" className={""}  value={observacao} disabled={false} onChange={e=>setObservacao(e.target.value)} />
                        <h3>Tipo de Produto:</h3>
                        <select id="tipo" className="input-select-4" name="select" value={tipoProdutoVO} onChange={e=> setTipoProdutoVO(e.target.value)}>
                                <option value="">Selecione uma Opção!</option>
                                {tipo.map( p=>(
                                          <option selected={p.valorEnum===tipoProdutoVO ?"selected":""} value={p.valorEnum}>{p.descricao}</option>                                     
                                ))}
                            
                        </select>
                        
                        <h3>Data de Cadastro</h3>
                        <input type="date" className="disabled-input" disabled={true} value={cadastro} onChange={e=>setCadastro(e.target.value)}/>
                        <h3>Data de Atualização</h3>
                        <input type={atualizacao===null || atualizacao===''?"text":"date"} className="disabled-input" disabled={true} value={atualizacao} onChange={e=>setAtualizacao(e.target.value)}/>
                        <button onClick={salvar}>Salvar</button> 
                        
                    </div>

                    <div className="empresa-alterar-2">                        
                        
                    </div>
                    
                    <div className="clear"></div>
                    

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
                onDialog={areUSure}
                message={dialog.message}
            />)}
        </div>
        
    );
}