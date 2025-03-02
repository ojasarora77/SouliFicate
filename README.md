This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-onchain`]().
# SouliFicate: Blockchain-Verified Academic Credentials
## 🎓 Overview

SouliFicate enables educational institutions to issue tamper-proof, verifiable digital certificates to students. These certificates are minted as Soulbound Tokens (non-transferable NFTs) that remain permanently linked to a student's wallet address, ensuring authenticity and preventing fraud.

## ✨ Features

- **Soulbound Tokens**: Certificates are issued as non-transferable NFTs, preventing fraud and ensuring authenticity
- **Blockchain Verification**: All certificates are verifiable on-chain on Base Sepoia testnet
- **Certificate Approval Workflow**: Students must approve certificates before they can be modified or removed
- **Certificate Management**: View, approve, and verify academic credentials
- **Detailed Certificate View**: View comprehensive certificate details including skills, academic information, and blockchain verification
- **Document Upload**: Support for uploading certificate documents (PDF, PNG, JPG)

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Web3 Integration**: Base Onchain Kit, wagmi
- **Smart Contracts**: Solidity (ERC-721 extension)
- **Development**: TypeScript, Hardhat

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


