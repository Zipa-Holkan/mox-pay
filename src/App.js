import React from 'react';
import './App.css';
import ConnectWalletButton from './components/ConnectWalletButton';
import AlgorandTransactions from './components/AlgorandTransactions';

function App() {
  return (
    <div className="App">
      <h1>Mi App con Algorand y Pera Wallet</h1>
      <ConnectWalletButton />
      <AlgorandTransactions />
    </div>
  );
}

export default App;