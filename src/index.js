import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Login from './components/login'
import Home from './components/home'
import Dashboard from './components/dashboard'
import Entry from './components/entry'
import Process from './components/process'
import PoDashboard from './components/poDashboard'
import DataEntry from './components/DataEntry'
import ProductEntry from './components/ProductEntry'

import { Route, BrowserRouter as Router, Switch, } from 'react-router-dom'


ReactDOM.render(
  <Router>

    <Switch>
    <Route exact path = "/dashboard" component = {Login}/>
    <Route exact path = "/login" component = {Login}/>
    <Route exact path = "/home" component = {Home}/>
    <Route exact path = "/home/entry" component = {Entry}/>
    <Route exact path = "/home/entry/dashboard" component = {Dashboard}/>
    <Route exact path = "/home/process" component = {Process}/>
    <Route exact path = "/home/process/dashboard" component = {PoDashboard}/>
    <Route exact path = "/dataentry" component = {DataEntry}/>
    <Route exact path = "/add/product" component = {ProductEntry}/>
    </Switch>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
