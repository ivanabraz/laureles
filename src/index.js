import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import i18n from './config/i18n';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Router>
        <Suspense fallback='loading'>
          <App />
        </Suspense>
      </Router>
    </I18nextProvider>
  </React.StrictMode>
);

reportWebVitals();