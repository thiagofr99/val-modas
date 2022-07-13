import React,{useState, useEffect} from "react";
import { Link, useHistory} from "react-router-dom";
import FileDownload from "js-file-download";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'

import api from '../../services/api'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './style.css';
import CabechalhoManage from "../../layout/CabecalhoManage";
import Dialog from "../../layout/DialogConfirm";

export default function Manager(){

    const [empresaResponse, setEmpresaResponse] = useState();
    const [empresas, setEmpresas] = useState([]);
    const [cardapios, setCardapios] = useState([]);    

    const [cardapioNome, setCardapioNome] = useState("");    


    const [arquivo, setArquivo] = useState('');    

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
          deletar();
          handleDialog("", false);
        } else {
          
          handleDialog("", false);
        }
      };
    
    const history = useHistory();

    const accessToken = sessionStorage.getItem('accessToken');

    useEffect(()=> {
    
        api.get('api/empresa/v1/empresas-gerente', {
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            setEmpresas(response.data)
        })
        
    },[]);

    async function buscarCardapios(id){

        if(id===null || id===undefined){
            toast.warning('Selecione uma empresa vinculada ao Gerente.', {
                position: toast.POSITION.TOP_CENTER
              })
        } else {
            try{            
                const response = await api.get(`api/cardapio/v1/findAllByEmpresa/${id}`,{                
                  headers:{
                      Authorization: `Bearer ${accessToken}`
                  },
                  params: {
                    page: 0,
                    limit: 10,
                    direction: 'asc'
                  }
                }).then(responses=> {
                    setCardapios(responses.data._embedded.cardapioVoes)
                })                          
                
          
              } catch (err){
                toast.error('Erro ao carregar dados.', {
                    position: toast.POSITION.TOP_CENTER
                  })
              }
        }

    }  

    async function downloadArquivo(downloadLink){
        
        
            try{            
                 await api.get(downloadLink,{                
                  headers:{
                      Authorization: `Bearer ${accessToken}`
                  }, responseType: 'blob'
                }).then(response=>{
                    if(response.data.type==="application/pdf"){
                        FileDownload(response.data,"download.pdf")
                    }
                    if(response.data.type==="image/jpeg"){
                        FileDownload(response.data,"download.jpeg")
                    }
                    if(response.data.type==="image/png"){
                        FileDownload(response.data,"download.png")
                    }
                    
                    
                }

                )                                           

          
              } catch (err){
                toast.error('Erro ao carregar dados.', {
                    position: toast.POSITION.TOP_CENTER
                  })
              }
        

    } 

    async function downloadQrcode(idCardapio){
        
        
        try{            
             await api.get(`api/cardapio/v1/report-qrcode/${idCardapio}`,{                
              params:{
                acao: 'v'
              },
              headers:{
                  Authorization: `Bearer ${accessToken}`
              }, responseType: 'blob'
            }).then(response=>{
                if(response.data.type==="application/pdf"){
                    FileDownload(response.data,"qrcode.pdf")
                }
                if(response.data.type==="image/jpeg"){
                    FileDownload(response.data,"qrcode.jpeg")
                }
                if(response.data.type==="image/png"){
                    FileDownload(response.data,"qrcode.png")
                }                
                
            }

            )                                           

      
          } catch (err){
            toast.error('Erro ao fazer o download.', {
                position: toast.POSITION.TOP_CENTER
              })
          }
    

}

    async function upload(e){
        e.preventDefault();        

        if(arquivo===undefined || arquivo=== ''){
            var empresaId = empresaResponse;
            var urlCardapio = '';
            var urlQrcode   =  '';
            const data = {
                cardapioNome,
                empresaId,
                urlCardapio,
                urlQrcode
            }

            try{
    
                await api.post('api/cardapio/v1/salvar',data,{
                  headers:{
                      Authorization: `Bearer ${accessToken}`
                  }
                });
                              
                setCardapioNome('');
                buscarCardapios(empresaId);
                toast.success('Cardápio salvo com sucesso.', {
                    position: toast.POSITION.TOP_CENTER
                  });
              } catch (err){
                toast.success('Erro ao salvar cardapio.', {
                    position: toast.POSITION.TOP_CENTER
                  })
              }

        } else {
            const formData = new FormData();
        formData.append('file',arquivo);

        const headers = {
            'headers':{
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type' : 'multipart/form-data'
            }
        }

        try{
    
            const response = await api.post('/api/file/v1/uploadFile', formData, headers);
                            
            var empresaId = empresaResponse;
            var urlCardapio = response.data.fileDownloadUri;
            var urlQrcode   =  response.data.fileUrl;
            const data = {
                cardapioNome,
                empresaId,
                urlCardapio,
                urlQrcode
            }

            try{
    
                await api.post('api/cardapio/v1/salvar',data,{
                  headers:{
                      Authorization: `Bearer ${accessToken}`
                  }
                });
                              
                setCardapioNome('');
                setArquivo('');            
              } catch (err){
                toast.error('Erro ao salvar cardápio.', {
                    position: toast.POSITION.TOP_CENTER
                  });
              }
              
            buscarCardapios(empresaId);
            toast.success('Cardápio salvo com sucesso.', {
            position: toast.POSITION.TOP_CENTER
            });                    
          } catch (err){
            toast.error('Erro ao fazer upload do arquivo.', {
                position: toast.POSITION.TOP_CENTER
              });
          }
        }
        
      
        };

    async function deletar(){
        try {
            await api.delete(`api/cardapio/v1/${dialog.id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            
            toast.success('Cardápio deletado com sucesso.', {
                position: toast.POSITION.TOP_CENTER
              });
            setCardapios(cardapios.filter(c => c.id !== dialog.id))
        } catch (err) {
            toast.error('Erro ao deletar cardápio.', {
                position: toast.POSITION.TOP_CENTER
              });
        }
    }

    async function excluir(id, nome) {

    handleDialog("Deseja excluir o cardápio?", true, nome, id);
        
    }

    async function abrirProdutos(cdpId){
        history.push(`/produto/${cdpId}`);
    }

    return(
        <div id="container">
           
            <CabechalhoManage></CabechalhoManage>
            <body>                

            <select id="permissao" className="input-select" name="select" value={empresaResponse} onChange={e=> setEmpresaResponse(e.target.value)}>
                                <option value="">Selecione uma Empresa:</option>
                                {empresas.map( p=>(
                                          <option value={p.id}>{p.empresaNome}</option>                                     
                                ))}
                                
            </select>
            <button className="input-button-5" onClick={()=> buscarCardapios(empresaResponse)}>Buscar</button>
            
            { empresaResponse=== undefined || empresaResponse=== '' ? ' ':
            <div id="lista-1">
                <table>
                    <tr>
                        <th>Nome do Cardápio</th>
                        <th>URL para Download</th>
                        <th>URL QR CODE</th>
                        <th>Ultima Atualização</th>
                        <th>Ações</th>
                    </tr>
                    {cardapios.map( p=>(
                    <tr key={p.id}>
                        <td> {p.cardapioNome} </td>
                        <td> { p.urlCardapio===null || p.urlCardapio ==='' ? ' ':
                            <button className="input-button-6" onClick={()=> downloadArquivo(p.urlCardapio)}> Download Arquivo </button> 
                        }
                        </td>
                        <td> { p.urlQrcode===null || p.urlQrcode ==='' ? ' ':
                            <button className="input-button-6" onClick={()=> downloadQrcode(p.id)}> Download Qr Code </button> 
                        }   
                        </td>
                        <td>{ p.dataAtualizacao ===null || p.dataAtualizacao ==='' ? Intl.DateTimeFormat('pt-BR').format(new Date(p.dataCadastro)):Intl.DateTimeFormat('pt-BR').format(new Date(p.dataAtualizacao))}</td>
                        <td>{ p.urlCardapio===null || p.urlCardapio ==='' ? <button className="input-button-patch" onClick={()=> abrirProdutos(p.id)} >Produtos</button> :' '}
                            <button className="input-button-deletar" onClick={()=> excluir(p.id, p.cardapioNome)} >Excluir</button>
                        </td>
                    </tr>
                                ))}
                    
                </table>
            </div>  
            }                                    
            
            { empresaResponse=== undefined || empresaResponse=== '' ? ' ':
                <div id="consulta-2">
                    <div className="row-1">
                        <h2 className="text-consulta">SALVA UM NOVO CARDÁPIO.</h2>
                        
                    </div>
                    <div className="row-2">
                        <form className="consulta-1" onSubmit={upload}>
                            <input className="input-3" type="text" name="nomeEmpresa" value={cardapioNome} onChange={e => setCardapioNome(e.target.value)} placeholder="Cardapio nome."/>
                            <input id="selecao-arquivo" className="input-5" type="file" name="arquivo" onChange={e => setArquivo(e.target.files[0])}/>
                            <label for="selecao-arquivo">Selecionar um arquivo</label>                            
                            {arquivo==='' ?<p className="arquivo-selecao">Nenhum arquivo selecionado!</p> :<p className="arquivo-selecao">{arquivo.name}</p>}    
                            <input className="input-2" type="submit" value="Salvar" />
                        </form>
                    </div>
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
            {dialog.isLoading && (<Dialog
                //Update
                nameProduct={dialog.nome}
                onDialog={areUSure}
                message={dialog.message}
            />)}
        </div>
    );
}