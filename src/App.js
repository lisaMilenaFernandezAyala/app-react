import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Route, NavLink, HashRouter } from "react-router-dom";
import Dashboard from './Dashboard';
import Table from './Table';
import Form from './Form';
import Media from './Media';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>App - React</h1>
        </header>

        <HashRouter >
          <div>
            <nav>
              <ul className="header">              
                <li><NavLink exact to="/">Dashboard</NavLink></li>
                <li><NavLink exact to="/table">Table</NavLink></li>
                <li><NavLink exact to="/form">Form</NavLink></li>
                <li><NavLink exact to="/media">Media</NavLink></li>
              </ul>
            </nav>

            <div className="content">
              <Route exact path="/" component={Dashboard}/>
              <Route exact path="/table" component={Table}/>
              <Route exact path="/form" component={Form}/>
              <Route exact path="/media" component={Media}/>
            </div>
          </div>
        </HashRouter>
      </div>
    );
  }
}

export default App;
