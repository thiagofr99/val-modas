import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Login from './pages/LoginValModas';

import Usuario from './pages/Usuario';
import Manager from './pages/Manager';
import UsuarioConsulta from './pages/UsuarioConsulta';
import UsuarioTodos from './pages/UsuarioTodos';
import Produtos from './pages/Produtos';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login}/>                
                <Route path="/usuario" exact component={Usuario}/>
                <Route path="/produtos" exact component={Produtos}/>
                <Route path="/manager" component={Manager}/>
                <Route path='/consulta/:nome' component={UsuarioConsulta}/>
                <Route path='/todos/' component={UsuarioTodos}/>                
            </Switch>
        </BrowserRouter>
    );
}