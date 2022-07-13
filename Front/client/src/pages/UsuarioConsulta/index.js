import React,{useState, useEffect} from "react";
import { Link, useHistory, useParams} from "react-router-dom";

import './style.css';

import api from '../../services/api'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'

import Loading from '../../layout/Loading';
import Cabechalho from "../../layout/Cabecalho";

export default function UsuarioConsulta(){

    const {nome} = useParams();
    
    const [users, setUsers] = useState([]);

    const [page, setPage] = useState(0);

    const [paginacao, setPaginacao] = useState();

    const [totalPages, setTotalPages] = useState();

    const [loadOn, setLoadOn] = useState(false);
    
    const accessToken = sessionStorage.getItem('accessToken');    
    const usuarioLogado = sessionStorage.getItem('username');    
    const cargo = sessionStorage.getItem('permission');    

    const history = useHistory();


    async function buscarTodosPorNome(pagin){

        try{
    
            const response = await api.get('auth/findAllByUserName',{                
              headers:{
                  Authorization: `Bearer ${accessToken}`
              },
              params: {
                userName:  nome === undefined ? '' :  nome,
                page: pagin,
                limit: 10,
                direction: 'asc'
              }
            }).then(responses=> {
                setUsers(responses.data._embedded.usuarioVoes);
                setPaginacao(responses.data.page);
                setTotalPages(responses.data.page.totalPages);
            })                      
            
      
          } catch (err){
            toast.error('Erro ao buscar Usuarios.', {
                position: toast.POSITION.TOP_CENTER
              })            
          }
        

    }  

    async function proximaPage(){

        let pagina = paginacao.number+1;
        setPage(pagina);
        buscarTodosPorNome(pagina);       
    }

    async function anteriorPage(){
       
        let pagina = paginacao.number-1;
        setPage(pagina);
        buscarTodosPorNome(pagina);        
    }
    
    async function renovar(id){        
        
        setLoadOn(true);

        try{
            

            await api.patch(`/auth/${id}`, {
                //dados que serão atualizados
              }, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
               }
              })
            
              
              toast.success('Licença renovada com sucesso.', {
                position: toast.POSITION.TOP_CENTER
              })
            buscarTodosPorNome();          
            setLoadOn(false);
          } catch (err){
            toast.error('Erro ao renovar licença.', {
                position: toast.POSITION.TOP_CENTER
              })
              setLoadOn(false);
          }

    }  

    async function logout(){
        sessionStorage.setItem('username', '');
        sessionStorage.setItem('accessToken', '');
        sessionStorage.setItem('permission', '');
        history.push(`/`);        
    }
 
    useEffect(()=> {
        try{
            setLoadOn(true)
            buscarTodosPorNome();
            toast.success('Busca realizada com sucesso.', {
                position: toast.POSITION.TOP_CENTER
              })
            setLoadOn(false);

        } catch (erro){
            toast.error('Erro ao realizar busca.', {
                position: toast.POSITION.TOP_CENTER
              })
            history.push(`/usuario/`)
        }
        
        
    },[]);

    return (
        <div id="container">
            {loadOn? <Loading></Loading>:
            <div>
            <Cabechalho></Cabechalho>
            <body>                
            
                <div id="lista-1">
                <table>
                    <tr>
                        <th>Nome de Usuário</th>
                        <th>Nome completo</th>
                        <th>Cargo</th>
                        <th>Data Licença</th>
                        <th>Ações</th>
                    </tr>
                    {users.map( p=>(
                    <tr key={p.id}>
                        <td> {p.userName} </td>
                        <td> {p.fullName} </td>
                        <td>{p.permissions.at(0).descricao}</td>
                        <td>{ p.dateLicense===null || p.dateLicense==='' ? 'Licença Permanente': p.dateLicense }</td>
                        <td>{ p.dateLicense===null || p.dateLicense==='' || new Date(p.dateLicense) >= Date.now() ? '':<button onClick={()=> renovar(p.id)} className="input-button-3" type="submit" >Renovar</button>} </td>
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
            </div>
}
        </div>
        
    );
}