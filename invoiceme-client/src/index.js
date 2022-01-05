import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './app';
import { AppProviders } from './context';
import { reportWebVitals } from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.querySelector('#root'),
);

reportWebVitals();
