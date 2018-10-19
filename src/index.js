import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './simulator_components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App userId={1}/>, document.getElementById('root'));
registerServiceWorker();
