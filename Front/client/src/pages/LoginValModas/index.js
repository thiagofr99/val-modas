import React, {useState} from 'react';
import { useHistory} from 'react-router-dom';

import './style.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import perfil from '../../assets/perfil-2.png'

import logo from '../../assets/mae-logo.png'

import api from '../../services/api'
import Loading from '../../layout/Loading';


export default function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loadOn, setLoadOn] = useState(false);

  const history = useHistory();
  
  async function login(e){
    e.preventDefault();

    setLoadOn(true);

    const data = {
        username,
        password,
    }

    try{

      const response = await api.post('auth/signin',data);

      sessionStorage.setItem('username', username);
      sessionStorage.setItem('accessToken',response.data.token)
      sessionStorage.setItem('permission',response.data.permission.authority)

      if(response.data.permission.authority==="ADMIN"){
        history.push('/usuario')
      } 
      if(response.data.permission.authority==="MANAGER"){
        history.push('/manager')
      } 

    } catch (err){      
      toast.error('Login falhou! Tente novamente!', {
        position: toast.POSITION.TOP_CENTER
      })
      setLoadOn(false);      
      //alert('Login failed! Try agains!')
    }

  };

    return (
    <div className="containerPrincipal">
        {loadOn? <Loading></Loading>:
          <div>
            <section className='form'>
              <img className='perfil' src={perfil} alt=""/>
              <form onSubmit={login}>
                <h1>Acesse sua conta.</h1>
                <input className="email" type="text" name="userName" id="userName" placeholder="Digite o seu nome de usuário." value={username} onChange={e => setUsername(e.target.value)}/>
                <input className="senha" type="password" name="senha" id="senha" placeholder="Digite sua senha" value={password} onChange={e => setPassword(e.target.value)}/>
                <input className="submit" type="submit" value="Logar"/>
                <img className='logoTipo' src={logo} alt="" />
              </form>
            </section>
          </div>
        } 
        
    </div>
    
    
    );
  }
  
  