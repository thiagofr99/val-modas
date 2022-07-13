import React,{useState, useEffect} from "react";
import { useHistory, useParams} from "react-router-dom";
import InputMask from "react-input-mask";

import './style.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import imgEmpresa from '../../assets/default.jpg'

import api from '../../services/api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'

import CabechalhoEmpresa from "../../layout/CabecalhoEmpresa";
import Dialog from "../../layout/DialogConfirm";


export default function EmpresaAlterar(){

    const {myId} = useParams();

    const [empresaNome, setEmpresaNome] = useState('');
    const [cepMask, setCepMask] = useState('');
    const [numero, setNumero] = useState('');    
    const [complemento, setComplemento] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [atualizacao, setAtualizacao] = useState('');
    const [cadastro, setCadastro] = useState('');
    const [userFullName, setUserFullName] = useState('');

    const [manangers, setManangers] = useState(['']);
    const [mananger, setMananger] = useState('');    

    const accessToken = sessionStorage.getItem('accessToken');
    const gerente = sessionStorage.getItem('gerente');
    
    const history = useHistory();

    const [data, setData] = useState({
        id: 0,
        cep: 0,
        complemento: "", 
        empresaNome: "",
        numero: 0
    })

    const handleData = (id, cep, complemento, empresaNome, numero) => {
        setData({
            id,
            cep,
            complemento, 
            empresaNome,            
            numero
        });
    };

    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        nome: "",
        operation:"",
        empresaId:0,
        gerenteUser:""
      });

    const handleDialog = (message, isLoading, nome, operation, empresaId, gerenteUser) => {
    setDialog({
        message,
        isLoading,        
        nome,
        operation,
        empresaId,
        gerenteUser
    });
    };
    
    const areUSure = (choose) => {
        if (choose) {
          if(dialog.operation=="salvar"){
            update();
          } else {
            managerDefined();
          }
          
          handleDialog("", false);
        } else {
          
          handleDialog("", false);
        }
      };
    

    useEffect(()=> {
        findByEmpresaId();
        if(gerente==='true')
        findAllManangers();
    },[]);

    async function findAllManangers(){
        api.get('auth/manangers', {
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            setManangers(response.data)
        })
    }


    async function findByEmpresaId(){
        
        try{
    
            const response = await api.get(`api/empresa/v1/${myId}`,{                                
                headers:{
                  Authorization: `Bearer ${accessToken}`
              }
            })
            
            let dataCadastro = response.data.dataCadastro === null || response.data.dataCadastro === '' ? '': response.data.dataCadastro.split("T", 10)[0];
            let dataAtualizacao = response.data.dataAtualizacao === null || response.data.dataAtualizacao === '' ? '': response.data.dataAtualizacao.split("T", 10)[0];
        
            setEmpresaNome(response.data.empresaNome);
            setCepMask(response.data.cep);
            setNumero(response.data.numero);
            setComplemento(response.data.complemento);
            setImageUrl(response.data.imageUrl);
            setAtualizacao(dataAtualizacao);
            setCadastro(dataCadastro);
            response.data.user===null || response.data.user===''? setUserFullName(''): setUserFullName(response.data.user.fullName);                        
      
          } catch (err){
            toast.error('Erro ao carregar dados.', {
                position: toast.POSITION.TOP_CENTER
              })
            history.push(`/empresa`);
          }
        

    }
    
    async function update(){
        try{
        
            await api.put('api/empresa/v1/atualizar',data,{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            });
                
            toast.success('Salvo com sucesso.', {
                position: toast.POSITION.TOP_CENTER
              })        
            setEmpresaNome('');
            setCepMask('');
            setComplemento('');
            setNumero('');
            setAtualizacao('');
            setCadastro('');

            history.push('/empresa');
            } catch (err){
                toast.error('Erro ao salvar dados.', {
                    position: toast.POSITION.TOP_CENTER
                  })
            }
    }

    async function salvar(e){
        e.preventDefault();

        var cep = cepMask.replace('-','');
        
        var id = myId;

        handleData(id, cep, complemento, empresaNome, numero);

        handleDialog("Deseja realmente alterar a empresa?", true, empresaNome, "salvar");
                        
    };

    async function managerDefined(){
        try{
            
            await api.patch(`/api/empresa/v1/${dialog.empresaId}/gerente/${dialog.gerenteUser}`, {
                //dados que serão atualizados
              }, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
               }
              })
            
              toast.success('Gerente definido com sucesso!', {
                position: toast.POSITION.TOP_CENTER
              })                  
            history.push('/empresa');
      
          } catch (err){
            toast.error('Erro ao tentar definir gerente!', {
                position: toast.POSITION.TOP_CENTER
              })     
          }
    }

    async function definirGerente(userGerente, idEmpresa){        
        
        handleDialog("Deseja definir "+userGerente+" como gerente da empresa?", true, empresaNome, "gerente", idEmpresa, userGerente);

    }  

    return (
        <div id="container">
           
           <CabechalhoEmpresa></CabechalhoEmpresa>
            <body>
                <h1>Cadastro de Empresas.</h1>          
                <div id="lista-1">                    
                    <div className="empresa-alterar">
                        <h3>Nome empresa:</h3>
                        <input type="text" value={empresaNome} className="disabled-input" disabled={true} onChange={e=>setEmpresaNome(e.target.value)} />
                        <h3>Cep:</h3>
                        <InputMask type="text" className={gerente==='true' ?"disabled-input":""} disabled={gerente==='true' ?true:false}  mask="99999-999" value={cepMask} onChange={e=>setCepMask(e.target.value)} />
                        <h3>Numero:</h3>
                        <input type="text" className={gerente==='true' ?"disabled-input":""}  value={numero} disabled={gerente==='true' ?true:false} onChange={e=>setNumero(e.target.value)} />
                        <h3>Complemento:</h3>
                        <input type="text" className={gerente==='true' ?"disabled-input":""} value={complemento} disabled={gerente==='true' ?true:false} onChange={e=>setComplemento(e.target.value)} />
                        <h3>Data de Cadastro</h3>
                        <input type="date" className="disabled-input" disabled={true} value={cadastro} onChange={e=>setCadastro(e.target.value)}/>
                        <h3>Data de Atualização</h3>
                        <input type={atualizacao===null || atualizacao===''?"text":"date"} className="disabled-input" disabled={true} value={atualizacao} onChange={e=>setAtualizacao(e.target.value)}/>
                        {gerente === 'true' ? '': <button onClick={salvar}>Salvar</button>} 
                        
                    </div>

                    <div className="empresa-alterar-2">
                        <img className="image-empresa" src={imageUrl===null || imageUrl==='' ? imgEmpresa : imageUrl} alt="" />                        
                        {gerente==='true' && userFullName==='' ?                            
                            <select id="permissao" className="input-select-2" name="select" value={mananger} onChange={e=> setMananger(e.target.value)}>
                            <option value="">Selecione um gerente!</option>
                            {manangers.map( p=>(
                                    <option value={p.userName}>{p.fullName}</option>                                     
                            ))}
                        
                            </select>                            
                            : gerente==='false' ? '' : <input type="text" className={gerente==='true' ?"disabled-input":""}  value={"Gerente: "+userFullName} disabled={gerente==='true' ?true:false} onChange={e=>setUserFullName(e.target.value)} />    
                        }
                        {gerente==='true' && userFullName==='' ? <button onClick={()=> definirGerente(mananger,myId)}>Definir</button>: ''}                           
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
                nameProduct={dialog.nome}
                onDialog={areUSure}
                message={dialog.message}
            />)}
        </div>
        
    );
}