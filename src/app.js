import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom'
import LandingPage from './landingpage';
import Login from './Login'
import Signup from './Signup'
import 'bootstrap/dist/css/bootstrap.css';
import './app.css';

class App extends Component {
  render() {
    return (
      <div className="App container">
        <p className="placeholder_style">Navbar Placeholder</p>
        <BrowserRouter>
          <div className="main_body_wrapper">
            <Route path="/" exact component={LandingPage}/>
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
          </div>
        </BrowserRouter>
        <p className="placeholder_style footer">Footer Placeholder</p>
      </div>
    );
  }
}

export default App;