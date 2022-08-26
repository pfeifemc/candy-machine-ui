import "./App.css";
import { useMemo } from "react";
import * as anchor from "@project-serum/anchor";
import Home from "./Home";
import { DEFAULT_TIMEOUT } from "./connection";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";

import { createTheme, ThemeProvider } from "@material-ui/core";

import { CrossmintPayButton } from '@crossmint/client-sdk-react-ui';

const theme = createTheme({
  palette: {
    type: "dark",
  },
});

const getCandyMachineId = (): anchor.web3.PublicKey | undefined => {
  try {
    return new anchor.web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_ID!);
  } catch (e) {
    console.log("Failed to construct CandyMachineId", e);
    return undefined;
  }
};

let error: string | undefined = undefined;

if (process.env.REACT_APP_SOLANA_NETWORK === undefined) {
  error =
    "Your REACT_APP_SOLANA_NETWORK value in the .env file doesn't look right! The options are devnet and mainnet-beta!";
} else if (process.env.REACT_APP_SOLANA_RPC_HOST === undefined) {
  error =
    "Your REACT_APP_SOLANA_RPC_HOST value in the .env file doesn't look right! Make sure you enter it in as a plain-text url (i.e., https://metaplex.devnet.rpcpool.com/)";
}

const candyMachineId = getCandyMachineId();
const network = (process.env.REACT_APP_SOLANA_NETWORK ??
  "devnet") as WalletAdapterNetwork;
const rpcHost =
  process.env.REACT_APP_SOLANA_RPC_HOST ?? anchor.web3.clusterApiUrl("devnet");
const connection = new anchor.web3.Connection(rpcHost);

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getSlopeWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    []
  );

  return (
    <div style={{height:"100vh"}}>
    <ThemeProvider theme={theme}>
      <div className='mint-title'>D3G3N TR!PS</div>
      <div className='mint-subtitle'>Everbody wins.</div>
      <div className='wallet-container'>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletDialogProvider>
              <Home
                candyMachineId={candyMachineId}
                connection={connection}
                txTimeout={DEFAULT_TIMEOUT}
                rpcHost={rpcHost}
                network={network}
                error={error}
              />
            </WalletDialogProvider>
          </WalletProvider>
        </ConnectionProvider>
        <div className='crossmint-container'>
          <CrossmintPayButton
            collectionTitle='D3G3N P!CKS by JetGetter Club'
            collectionDescription='JetGetter Club is a brand utilizing web3 to make travel accessible. Your jet is access to exclusive pricing, rewards, and a community sharing the best spots around the world.'
            collectionPhoto='https://pbs.twimg.com/profile_images/1492014207125975040/UTA0SVNO_400x400.jpg'
            clientId='bcb0bf9f-adc2-48be-91d8-06be5b2583da'
            mintConfig={{"type":"candy-machine"}}
            paymentMethod="ETH"
            className="my-crossmint"
          />
          <CrossmintPayButton
            collectionTitle='D3G3N P!CKS by JetGetter Club'
            collectionDescription='JetGetter Club is a brand utilizing web3 to make travel accessible. Your jet is access to exclusive pricing, rewards, and a community sharing the best spots around the world.'
            collectionPhoto='https://pbs.twimg.com/profile_images/1492014207125975040/UTA0SVNO_400x400.jpg'
            clientId='bcb0bf9f-adc2-48be-91d8-06be5b2583da'
            mintConfig={{"type":"candy-machine"}}
            paymentMethod="fiat"
            className="my-crossmint"
          />
        </div>
      </div>
    </ThemeProvider>
    </div>
  );
};

export default App;
