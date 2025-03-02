// app/page.tsx
'use client';

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import SBTCertificates from './components/SBTCertificates';

export default function App() {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
      <header className="pt-4 pr-4">
        <div className="flex justify-between items-center px-4">
          <h1 className="text-xl font-bold">SouliFicate</h1>
          <div className="wallet-container">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        {isConnected ? (
          <SBTCertificates />
        ) : (
          <div className="max-w-4xl w-full p-4 text-center">
            <div className="mb-12">
              {/* Custom Logo */}
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-4xl font-bold">S</span>
              </div>
              
              {/* Project Name */}
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                SouliFicate
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Blockchain-verified Soulbound Certificates
              </p>
            </div>
            
            <p className="mb-8 max-w-xl mx-auto">
              Connect your wallet to view and manage your soulbound university certificates.
              These certificates are non-transferable tokens that represent your academic achievements.
            </p>
            
            <button 
              onClick={() => document.querySelector('.wallet-container button')?.click()}
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        )}
      </main>
      
      <footer className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>SouliFicate — Blockchain-verified university credentials</p>
      </footer>
    </div>
  );
}