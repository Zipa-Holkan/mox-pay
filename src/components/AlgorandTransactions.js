import React, { useState } from 'react';
import algosdk from 'algosdk';
import { PeraWalletConnect, closePeraWalletSignTxnToast } from '@perawallet/connect';

// Configura el cliente Algorand
const algod = new algosdk.Algodv2('', 'https://testnet-algorand.api.purestake.io/ps2', '');

// Crea la instancia de PeraWalletConnect fuera del componente
const peraWallet = new PeraWalletConnect();

function AlgorandTransactions() {
  const [transactionData, setTransactionData] = useState(null);

  const sendAssetTransaction = async (amount) => {
    try {
      // Configura la transacción
      const suggestedParams = await algod.getTransactionParams().do();
      const assetID = 667667557; // Asset ID constante
      const receiver = 'SOMXLRC7OD3W3FDL4L42YAZXAFZDRJQCFSVBC3AMBFT6KWKM4EKCMZ5GLM'; // Dirección del receptor
      const amountMicroAlgos = amount * 1000000; // Convertir el monto a microAlgos
      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: peraWallet.getAddress(), // Dirección del remitente obtenida de Pera Wallet
        to: receiver,
        assetIndex: assetID,
        amount: amountMicroAlgos,
        suggestedParams
      });

      // Firma la transacción usando Pera Wallet
      const signedTxn = await peraWallet.signTransaction([{ txn }]);
      
      // Envía la transacción firmada a la red de Algorand
      const txId = await algod.sendRawTransaction(signedTxn.blob).do();
      
      // Muestra el ID de la transacción
      setTransactionData(txId);

      // Cierra el brindis de Pera Wallet después de la firma
      closePeraWalletSignTxnToast();
    } catch (error) {
      console.error('Error al enviar la transacción:', error);
    }
  };

  return (
    <div>
      {/* Integración del código HTML y CSS */}
      <form id="paymentForm" style={{ maxWidth: '400px', margin: '20px auto', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div className="formColumn" style={{ flex: 1, padding: '8px' }}>
          <label htmlFor="amount">Monto:</label>
          <input type="number" id="amount" />
        </div>
        <button id="exchangeButton" type="button" style={{ width: '100%', height: '40px', padding: '10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }} onClick={() => sendAssetTransaction(document.getElementById('amount').value)}>
          Enviar transacción
        </button>
      </form>

      {/* Resultado de la transacción */}
      {transactionData && (
        <p>Última transacción: {transactionData}</p>
      )}
    </div>
  );
}

export default AlgorandTransactions;