# Helix 

![Helix Architecture](https://github.com/user-attachments/assets/9f872e33-3233-4f3f-91c6-28ce6b3cb165)

**Demo / Video:** *https://youtu.be/K63IxGqn9iA*

**Contract Deployment:** *Ethereum Sepolia Testnet - 0xC381B1dd37B82810356EdD61Cb584e3228457aC7* 

**Pitch Deck:** *https://docs.google.com/presentation/d/16OzAvUcfoifWxi6DJ5HUZrg5FovBUR2P-ktCL7ZGiJ0/edit?usp=sharing*

---

## Introduction

**Helix** is a blockchain-backed platform that makes open-source collaboration **trustless, fair, and secure**. It combines a **two-sided staking protocol** (for both repository owners and issue solvers) with **verifiable AI agents** and **secure user verification** to eliminate collusion, overruns, Sybil attacks, and identity fraud.

**Deployed on:** Ethereum **Sepolia testnet**

This ensures predictable incentives, protected contributors (especially new developers), and verified AI assistance — all enforced through smart contracts and on-chain identity proofs.

---

## The Problem

* **Collusion and code appropriation:** Maintainers may view PRs and reuse code without merging or rewarding contributors.
* **Incentive misalignment:** Experienced developers can unintentionally overrun newcomers’ PRs, leading to unfair outcomes.
* **Centralized trust dependency:** Platforms like Gitcoin depend on manual fund releases by maintainers.
* **Fake accounts and Sybil attacks:** Multiple identities distort fairness and reward distribution.
* **Unverified human contribution:** Without verified identities, human participation cannot be proven.

---

## High-Level Solution

Helix enforces fairness and transparency through:

1. **Two-Sided Staking** — Both owners and solvers lock tokens; stakes are returned or slashed based on verified outcomes.
2. **Smart Contract ↔ GitHub API Reconciliation** — Each issue corresponds to a contract struct synchronized with GitHub metadata, detecting off-platform merges or policy violations.
3. **Verifiable AI Agents** — Auditable AI models assist in PR review and code evaluation. Their actions and reputations are tracked on-chain.

---

## How Staking Works

### Why Project Owners Stake

* **Prevent collusion or copying:** Owners cannot bypass contributor PRs without losing their stake.
* **Prevent unauthorized merges:** Only assigned contributors’ PRs can be merged; mismatches trigger slashing.
* **Align incentives:** Owners are economically motivated to follow Helix’s workflow, ensuring fairness.

### Why Solvers (Contributors) Stake

* **Sybil resistance:** Staking deters spam and fake registrations.
* **Exclusive assignment:** Stakers gain exclusive rights and deadlines to resolve issues.
* **Beginner protection:** Unstaked overruns are excluded from rewards, ensuring fair opportunity.
* **Verified identity:** Secure verification proves genuine human participation.

---

## Release and Slashing Rules

* Each issue is a smart contract struct containing metadata and state.
* Owner stakes are released only when all associated issues are resolved and validated.
* Off-platform actions, unauthorized merges, or violations lead to slashing or redistribution of stakes.

---

## Verifiable AI Layer

* **Auditable computation:** AI agents generate outputs backed by verifiable proofs.
* **Reputation system:** Agent performance and trust metrics are stored on-chain, influencing task selection.
* **Collaborative review:** Multiple AI agents analyze PRs collectively to produce verifiable recommendations.

---

## Why Helix Is Better Than Traditional Platforms

* **Automated fairness:** Smart contracts handle reward release without manual intervention.
* **Beginner protection:** Deadline-based staking ensures fair competition.
* **Verified human contribution:** Secure verification confirms authenticity.
* **Sybil and DoS resistance:** Contributor staking and nullifier checks prevent abuse.
* **Transparent AI:** All AI decisions are auditable and verifiable on-chain.

---

## Tech Stack

* **Frontend:** Next.js 14, TypeScript, TailwindCSS, Wagmi, Viem
* **Backend:** Python FastAPI, uAgents Framework
* **Blockchain:** Ethereum Sepolia testnet, Solidity Smart Contracts
* **Smart Contract Development:** Foundry (Forge, Cast, Anvil)
* **AI:** MCP Protocol, Multi-Agent Systems, ASI One API
* **Identity Layer:** Secure verification using advanced cryptographic proofs
* **AI Agents:** Distributed verifiable agents for code analysis, PR evaluation, and trust scoring
* **GitHub Integration:** Smart contract state continuously reconciled with GitHub issue and PR data

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+
- MetaMask wallet
- GitHub account
- Sepolia ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/helix.git
cd helix
```

### 2. Environment Configuration

#### Frontend Environment (.env.local)
Create `monorepo/.env.local`:

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# GitHub OAuth (Create at: https://github.com/settings/applications/new)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# WalletConnect Project ID (Get from: https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Smart Contract Address (Sepolia)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x14553856B61C2f653Cc167E31069068AC2c3f1d0

# Self.xyz Integration (Optional)
NEXT_PUBLIC_SELF_APP_NAME=Helix
NEXT_PUBLIC_SELF_SCOPE=
NEXT_PUBLIC_SELF_ENDPOINT=
```

#### Backend Environment (.env)
Create `.env` in root directory:

```bash
# GitHub API Token (Create at: https://github.com/settings/tokens)
GITHUB_TOKEN=your-github-personal-access-token

# Fetch.ai Agent Configuration
AI_IDENTITY_SEED=your-agent-identity-seed

# ASI One API Key (Get from: https://asi.one/)
ASI_ONE_API_KEY=your-asi-one-api-key

# Logging Configuration
LOG_LEVEL=INFO
```

### 3. Install Dependencies

#### Frontend Setup
```bash
cd monorepo
npm install
```

#### Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install uAgent dependencies
cd uagent
pip install -r requirements.txt
cd ..

cd uagent2
pip install -r requirements.txt
cd ..
```

### 4. Configuration Guide

#### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create a new OAuth App:
   - **Application name:** Helix
   - **Homepage URL:** http://localhost:3000
   - **Authorization callback URL:** http://localhost:3000/api/auth/callback/github
3. Copy Client ID and Client Secret to your `.env.local`

#### GitHub Token Setup

1. Go to [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. Generate a new token with these scopes:
   - `repo` (Full control of private repositories)
   - `read:user` (Read user profile data)
   - `user:email` (Access user email addresses)
3. Copy the token to `GITHUB_TOKEN` in your `.env`

#### WalletConnect Setup

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID to `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

### 5. Smart Contract Setup

The contract is already deployed on Sepolia at `0x14553856B61C2f653Cc167E31069068AC2c3f1d0`.

#### Deploy Your Own Contract (Optional)
If you want to deploy your own contract:

**Prerequisites:**
- Install [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Get Sepolia ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- Get API keys from [Infura](https://infura.io/) or [Alchemy](https://alchemy.com/)

**Setup Environment:**
```bash
cd contracts
cp .env.example .env
# Edit .env with your private key and API keys
```

**Deploy Contract:**
```bash
# Compile contracts
forge build

# Deploy using the interactive script
chmod +x deploy.sh
./deploy.sh

# Or deploy manually with Foundry
forge script script/Deploy.s.sol:DeployDecentralizedIssueTracker \
    --rpc-url https://rpc.sepolia.org \
    --broadcast \
    --verify \
    --etherscan-api-key YOUR_ETHERSCAN_API_KEY \
    -vvvv
```

**Update Frontend:**
After deployment, update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `monorepo/.env.local` with your new contract address.

### 6. Start the Application

#### Terminal 1: Frontend
```bash
cd monorepo
npm run dev
```

#### Terminal 2: Python API Server
```bash
python api_server.py
```

#### Terminal 3: AI Agents
```bash
# Start main agent
python main_agent.py

# In another terminal, start secondary agent
cd uagent2
python agent.py
```

### 7. Access the Application

- **Frontend:** http://localhost:3000
- **API Server:** http://localhost:5000
- **Agent Dashboard:** Check console logs for agent endpoints

---

## 🏗️ Architecture Overview

### Smart Contract Features

- **Issue Management:** Create, assign, and resolve issues on-chain
- **Two-Sided Staking:** Both maintainers and contributors stake ETH
- **Reputation System:** Track contributor and maintainer performance
- **Automated Payouts:** Smart contract handles fund distribution
- **Slashing Mechanism:** Penalize bad actors automatically

### AI Agent Capabilities

- **Repository Analysis:** Understand codebase structure and needs
- **Issue Generation:** Create meaningful issues based on repo analysis
- **PR Review:** Multi-agent code review with consensus
- **Vulnerability Detection:** Identify security issues and bugs
- **Market Alignment:** Suggest features based on market demand

### Dashboard Features

- **Wallet login (MetaMask)**
- **GitHub OAuth integration**
- **Issue listing + difficulty tiers**
- **AI-powered repo analysis view**
- **Automated PR review terminal**
- **Stake deposits + withdrawals**
- **Fairness verification logs**

---

## 🧪 Testing

### Frontend Tests
```bash
cd monorepo
npm run test
```

### Smart Contract Tests
```bash
cd contracts
forge test
```

### Backend Tests
```bash
python -m pytest tests/
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
cd monorepo
npm run build
# Deploy to Vercel or your preferred platform
```

### Backend Deployment
```bash
# Docker deployment
docker build -t helix-backend .
docker run -p 5000:5000 helix-backend
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Summary

Helix brings **trustless accountability** to open-source collaboration through a hybrid of **staking, verifiable AI, and zk-identity verification**. By ensuring that every contribution is genuine, auditable, and economically aligned, Helix restores transparency, fairness, and trust to the open-source ecosystem.

