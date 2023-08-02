import React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BeaconProvider } from './contexts/Beacon'
import { SettingsProvider} from './contexts/Settings';
import { TaquitoProvider } from './contexts/Taquito';
import { ContractsProvider } from './contexts/Contracts';

ReactDOM.render(
  <React.StrictMode>
    <SettingsProvider>
      <TaquitoProvider>
        <BeaconProvider>
          <ContractsProvider>
            <App />
          </ContractsProvider>
        </BeaconProvider>
      </TaquitoProvider>
    </SettingsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
