import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Axios from 'axios';

const dev = process.env.NODE_ENV !== 'production';

Axios.defaults.baseURL = dev ? 'http://127.0.0.1:8000/api/tasks' : 'https://pwg-task-list-api.herokuapp.com/api/tasks/';
Axios.defaults.withCredentials = true;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
