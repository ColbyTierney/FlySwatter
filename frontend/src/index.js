import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

import { UserProvider } from './UserContext'; // Import UserProvider

ReactDOM.render(
  <React.StrictMode>
    <UserProvider> {/* Wrap your app with UserProvider */}
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
