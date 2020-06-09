import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

let root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
