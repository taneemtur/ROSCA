import React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
<<<<<<< HEAD
import { BeaconProvider } from './contexts/Beacon'
import { SettingsProvider} from './contexts/Settings';
import { TaquitoProvider } from './contexts/Taquito';

ReactDOM.render(
  <React.StrictMode>
    <SettingsProvider>
      <TaquitoProvider>
        <BeaconProvider>
          <App />
        </BeaconProvider>
      </TaquitoProvider>
    </SettingsProvider>
=======
import { DAppProvider } from './dapp/dapp';
import { APP_NAME } from './dapp/defaults';

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider appName={APP_NAME}>
      <App />
    </DAppProvider>
>>>>>>> main
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
