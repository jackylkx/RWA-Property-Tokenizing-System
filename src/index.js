import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Buffer } from 'buffer';
import process from 'process';

window.Buffer = Buffer;
window.process = process;
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);