import React, { useEffect, useState } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';

// Crea la instancia de PeraWalletConnect fuera del componente
const peraWallet = new PeraWalletConnect();

function ConnectWalletButton() {
  const [accountAddress, setAccountAddress] = useState(null);
  const isConnectedToPeraWallet = !!accountAddress;

  useEffect(() => {
    // Reconectar a la sesión cuando el componente se monta
    peraWallet.reconnectSession().then((accounts) => {
      // Configura el listener del evento de desconexión
      peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);

      if (accounts.length) {
        setAccountAddress(accounts[0]);
      }
    });
  }, []);

  const handleConnectWalletClick = () => {
    peraWallet
      .connect()
      .then((newAccounts) => {
        // Configura el listener del evento de desconexión
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);

        setAccountAddress(newAccounts[0]);
      })
      .catch((error) => {
        // Debes manejar el reject ya que una vez que el usuario cierra el modal, la promesa peraWallet.connect() será rechazada.
        // Para la sintaxis async/await DEBES usar try/catch
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          // Maneja los errores necesarios
          console.error('Error al conectar con Pera Wallet:', error);
        }
      });
  };

  const handleDisconnectWalletClick = () => {
    peraWallet.disconnect();
    setAccountAddress(null);
  };

  return (
    <div>
      {!isConnectedToPeraWallet ? (
        <button onClick={handleConnectWalletClick}>Conectar con Pera Wallet</button>
      ) : (
        <p>Conectado a Pera Wallet</p>
      )}
    </div>
  );
}

export default ConnectWalletButton;