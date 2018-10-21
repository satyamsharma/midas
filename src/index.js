import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import LandingPage from './landingpage'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
