import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {browserHistory} from 'react-router';
import Login from './Login'
import Signup from './Signup'
import './landingpage.css';


class LandingPage extends Component {
    

    handleSubmit() {
          
    }

    render(){
        return (
            <div className="landing-page">
                <div className="welcome">
                    <div className="heading">Midas</div>
                    <div className="heading-2">Your financial network</div>
                    <div className="btn-container">
                            <div className="form-group">
                                <Link to="/signup" className="btn btn-dark">Sign Up</Link>
                            </div>
                            <div className="form-group">
                                <Link to="/login" className="btn btn-dark">Login</Link>
                            </div>
                    </div>
                </div>
               
             
                <div className="midas-about">
                        <p>stuff</p>
                </div>
                <div className="team-about">

                </div>
                <div className="footer">

                </div>

                
            </div>
            
        );
    }
}

export default LandingPage;