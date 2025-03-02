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
import ArrowSvg from './svg/ArrowSvg';
import ImageSvg from './svg/Image';
import OnchainkitSvg from './svg/OnchainKit';

export default function App() {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
      <header className="pt-4 pr-4">
        <div className="flex justify-between items-center px-4">
          <h1 className="text-xl font-bold">University Certificate SBT</h1>
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

      <main className="flex-grow flex items-start justify-center mt-8">
        {isConnected ? (
          <SBTCertificates />
        ) : (
          <div className="max-w-4xl w-full p-4 text-center">
            <div className="w-1/3 mx-auto mb-6">
              <ImageSvg />
            </div>
            <div className="flex justify-center mb-6">
              <a target="_blank" rel="_template" href="https://onchainkit.xyz">
                <OnchainkitSvg className="dark:text-white text-black" />
              </a>
            </div>
            <p className="mb-6">
              Connect your wallet to view and manage your university certificates.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}