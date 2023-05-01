import React,{useState} from "react";
import api_cep from "../services/api_cep";
import { toast } from "react-toastify";




export default function EnderecoBase(){

    const [cep, setCep] = useState('');    
    const [nomeRua, setNomeRua] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');    
    const [complemento, setComplemento] = useState('');

    async function buscarCep(e){
        e.preventDefault();
        try{              
               
            await api_cep.get(`${cep}/json/`).then(responses => {
                setNomeRua(responses.data.logradouro);  
                setBairro(responses.data.bairro);             
              })          
            console.log(nomeRua)
            toast.success('Busca realizada com sucesso.', {
                position: toast.POSITION.TOP_CENTER
              })            

        } catch (erro){
            toast.error('Cep não encontrado no banco de dados.', {
                position: toast.POSITION.TOP_CENTER
              })            
        }
    }

    async function recuperarEndereco(e){
        e.preventDefault();
        try{

        let enderecoVO = {
            bairro: bairro,
            numero: numero,
            complemento: complemento,
            nomeRua: nomeRua,
            cep: cep
        };
            
        return enderecoVO;
       

        } catch (erro){
            toast.error('Erro ao recuperar Endereço.', {
                position: toast.POSITION.TOP_CENTER
              })            
        }
    }
    

    return (
        <div>
            <div>
                <label for="valorCompra">CEP:</label>
                <div className="inputs-produtos">                    
                    <input className="input-produto" type="number" id="valorCompra" placeholder="xx.xxx-xxx" value={cep} onChange={e => setCep(e.target.value)}/>
                    <button onClick={ buscarCep } className="button-buscar">Buscar</button>
                </div>                   
                
            </div>
            <div>
                <label for="valorCompra">Bairro:</label>
                <div className="inputs-produtos">                    
                <input className="input-produto" type="text" id="nome" name="userName" placeholder="Digite o bairro." value={bairro} onChange={e => setBairro(e.target.value)} />                                                                        
                </div>                   
                
            </div>
            <div>
                <label for="valorCompra">Endereço:</label>
                <div className="inputs-produtos">                    
                <input className="input-produto" type="text" id="nome" name="userName" placeholder="Digite o nome da rua/av/travessa." value={nomeRua} onChange={e => setNomeRua(e.target.value)} />                                                                        
                </div>                   
                
            </div>
            <div>
                <label for="valorCompra">Número:</label>
                <div className="inputs-produtos">                    
                <input className="input-produto" type="text" id="nome" name="userName" placeholder="Número da casa ou prédio." value={numero} onChange={e => setNumero(e.target.value)} />                                                                        
                </div>                   
                
            </div>
            <div>
                <label for="valorCompra">Complemento:</label>
                <div className="inputs-produtos">                    
                <input className="input-produto" type="text" id="nome" name="userName" placeholder="Ponto de referência/ Nº apt ou casa (para vilas)." value={complemento} onChange={e => setComplemento(e.target.value)} />                                                                        
                </div>                   
                
            </div>
        </div>
    );
}