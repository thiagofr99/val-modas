import React,{useState, useEffect} from "react";
import { useHistory, useParams} from "react-router-dom";

import './style.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../../services/api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'

import CabechalhoEmpresa from "../../layout/CabecalhoEmpresa";
import Dialog from "../../layout/DialogConfirm";
import Loading from "../../layout/Loading";

export default function EmpresaConsulta(){


    const {nome} = useParams();
    
    const [empresas, setEmpresas] = useState([]);  

    const [page, setPage] = useState(0);

    const [paginacao, setPaginacao] = useState();

    const [totalPages, setTotalPages] = useState();

    const accessToken = sessionStorage.getItem('accessToken');

    const [loadOn, setLoadOn] = useState(false);
    
    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        //Update
        nameCompany: "",
        idEmpresa: "",
        operation: ""
      });

    const handleDialog = (message, isLoading, nameCompany, idEmpresa, operation) => {
    setDialog({
        message,
        isLoading,
        //Update
        nameCompany,
        idEmpresa,
        operation
    });
    };  

    const areUSureDelete = (choose) => {
        if (choose) {
          dialog.operation==="delete" ? excluirEmpresa() :
          disabledEmpresa();
          
          handleDialog("", false);
        } else {
          
          handleDialog("", false);
        }
      };

    const history = useHistory();

    useEffect(()=> {
        findAllByEmpresaName(0,true);
        
    },[]);

    async function proximaPage(){
        setLoadOn(true);
        let pagina = paginacao.number+1;
        setPage(pagina);
        findAllByEmpresaName(pagina,false);  
              
    }

    async function anteriorPage(){
        setLoadOn(true);
        let pagina = paginacao.number-1;
        setPage(pagina);
        findAllByEmpresaName(pagina,false);        
    }

    async function editEmpresa(id){
        try{
            sessionStorage.setItem('gerente', 'false');
            history.push(`/update/${id}`)
        } catch ( erro ){
            alert('Edit failed! Try again.')
        }
    }

    async function gerenteEmpresa(id){
        try{
            sessionStorage.setItem('gerente', 'true');
            history.push(`/update/${id}`)
        } catch ( erro ){
            alert('Edit failed! Try again.')
        }
    }

    async function findAllByEmpresaName(pagin, initial){

        var paramers = new URLSearchParams();
        nome===undefined ? paramers.append("empresaName",''):paramers.append("empresaName",nome)

        try{
    
            const response = await api.get('api/empresa/v1/findAllByEmpresaName/',{                                
              headers:{
                  Authorization: `Bearer ${accessToken}`
              },
              params: {
                empresaName:  nome === undefined ? '' :  nome,
                page: pagin,
                limit: 8,
                direction: 'asc'
              }
            }).then(responses=> {
                setEmpresas(responses.data._embedded.empresaVoes)
                setPaginacao(responses.data.page);
                setTotalPages(responses.data.page.totalPages);
            })
            
            if(initial){
                toast.success('Busca realizada com sucesso.', {
                    position: toast.POSITION.TOP_CENTER
                  })
            }
            
            
      
          } catch (err){
            toast.error('Busca não retornou dados.', {
                position: toast.POSITION.TOP_CENTER
              })
          }
        

    }  


    async function excluirEmpresa(){

        try {
            await api.delete(`api/empresa/v1/${dialog.idEmpresa}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            
            toast.success('Empresa deletada com sucesso.', {
                position: toast.POSITION.TOP_CENTER
              })
        
            setEmpresas(empresas.filter(emp => emp.id !== dialog.idEmpresa))
        } catch (err) {
            toast.error('Erro ao deletar empresa.', {
                position: toast.POSITION.TOP_CENTER
              })
        
        }

    }

    async function deleteCompany(id, nome) {
        setLoadOn(true);

        handleDialog("Deseja excluir a empresa?", true, nome, id, "delete")

        setLoadOn(false);
    }
    
    async function disabledEmpresa(){
        try{

            await api.patch(`/api/empresa/v1/desabilitar/${dialog.idEmpresa}`, {
                //dados que serão atualizados
            }, {
                headers: {
                'Authorization': `Bearer ${accessToken}`
            }
            })
            
            
            toast.success('Empresa desabilitada com sucesso.', {
                position: toast.POSITION.TOP_CENTER
              })
              setLoadOn(false);
            findAllByEmpresaName();          
    
        } catch (err){
            toast.error('Erro ao desabilitar empresa.', {
                position: toast.POSITION.TOP_CENTER
              })
              setLoadOn(false);
        }
    }

    async function desabilitar(id, nome){        
        setLoadOn(true);
        
        handleDialog("Deseja desativar a empresa?",true, nome, id,"disabled");
    
        setLoadOn(false);
    }

    return (
        <div id="container">
            {loadOn? <Loading></Loading>:
            <div>
            <CabechalhoEmpresa></CabechalhoEmpresa>
            <body>          
                <div id="lista-1">
                <table>
                    <tr>
                        <th>Nome da Empresa</th>
                        <th>CEP</th>
                        <th>Numero</th>
                        <th>Complemento</th>
                        <th>Data Cadastro</th>                        
                        <th>Ações</th>
                    </tr>
                    {empresas.map( p=>(
                    <tr>
                        <td> {p.empresaNome} </td>
                        <td> {p.cep} </td>
                        <td> {p.numero} </td>
                        <td> {p.complemento} </td>
                        <td> {p.dataCadastro} </td>                        
                        <td>
                            <button onClick={()=> deleteCompany(p.id, p.empresaNome)} className="input-button-deletar" type="submit" >Deletar</button>
                            <button onClick={(()=> gerenteEmpresa(p.id))} className="input-button-patch" type="submit" >Gerente</button>
                            <button onClick={()=> editEmpresa(p.id)} className="input-button-alterar" type="submit" >Alterar</button>
                            <button onClick={()=> desabilitar(p.id, p.empresaNome)} className="input-button-patch" type="submit" >Desabilitar</button>
                        </td>
                    </tr>                 
                                ))}
                    
                </table>
                </div>
                <div className="nav-page">
                        {page===0 ? '' : <button className="button-previous" onClick={anteriorPage}>{'<<Anterior'}</button>}      
                        <h3>{page+1}</h3>                         
                        { page+1== totalPages ? '': <button className="button-next" onClick={proximaPage}>{'Próxima>>'}</button>} 
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
            }
        </div>
    );
}