import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Login from './pages/LoginValModas';
import Empresa from './pages/Empresa';
import Usuario from './pages/Usuario';
import Manager from './pages/Manager';
import UsuarioConsulta from './pages/UsuarioConsulta';
import UsuarioTodos from './pages/UsuarioTodos';
import EmpresaTodos from './pages/EmpresaTodos';
import EmpresaBusca from './pages/EmpresaConsulta'
import EmpresaAlterar from './pages/EmpresaAlterar';
import Produto from './pages/Produto';
import ProdutoAlterar from './pages/ProdutoAlterar';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login}/>
                <Route path="/empresa" exact component={Empresa}/>
                <Route path="/usuario" exact component={Usuario}/>
                <Route path="/manager" component={Manager}/>
                <Route path='/consulta/:nome' component={UsuarioConsulta}/>
                <Route path='/todos/' component={UsuarioTodos}/>
                <Route path='/todas/' exact component={EmpresaTodos}/>
                <Route path='/buscas/:nome' exact component={EmpresaBusca}/>
                <Route path='/update/:myId' exact component={EmpresaAlterar}/>
                <Route path='/produto/:cdpId' exact component={Produto}/>
                <Route path='/editar/:idProduto' exact component={ProdutoAlterar}/>
            </Switch>
        </BrowserRouter>
    );
}