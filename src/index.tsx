import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import { Provider as AlertProvider } from "react-alert";

import reportWebVitals from './reportWebVitals';

import App from './App';
import AlertOptions from './AlertOptions';

ReactDOM.render(
    <React.StrictMode>
        <AlertProvider {...AlertOptions}>
            <HashRouter>
                <App />
            </HashRouter>
        </AlertProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
