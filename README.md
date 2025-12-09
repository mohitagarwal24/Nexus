# Nexus - Where Agentic Intelligence meets Trusted Collaboration

![Nexus Architecture]<img width="1496" height="658" alt="image" src="https://github.com/user-attachments/assets/1cf17294-5d53-4d87-aa74-53421c28ddbf" />

**Frontend:** *https://nexus-psi-sable.vercel.app/*

**Backend:** *https://nexus-fgqs.onrender.com/*

**Demo Video:** *https://youtu.be/siqbVogL6H8*

**Smart Contract:** [0xC381B1dd37B82810356EdD61Cb584e3228457aC7](https://sepolia.etherscan.io/address/0xC381B1dd37B82810356EdD61Cb584e3228457aC7) (Ethereum Sepolia)

---

## Introduction

**Nexus** is a blockchain-backed platform that makes open-source collaboration **trustless, fair, and secure**. It combines a **two-sided staking protocol** with **verifiable AI agents** and **secure user verification** to eliminate collusion, overruns, Sybil attacks, and identity fraud.

**Core Mission:** Replace trust-based open-source collaboration with deterministic, blockchain-enforced fairness.

**AI Agent Integration:** Built with **IQAI's ADK-TS Framework**, our **NexusIntelligenceAgent** provides verifiable repository analysis and issue generation as part of the broader trustless ecosystem.

**Deployed on:** Ethereum **Sepolia testnet** with full smart contract enforcement

---

## The Problem

* **Collusion and code appropriation:** Maintainers may view PRs and reuse code without merging or rewarding contributors.
* **Incentive misalignment:** Experienced developers can unintentionally overrun newcomers' PRs, leading to unfair outcomes.
* **Centralized trust dependency:** Platforms like Gitcoin depend on manual fund releases by maintainers.
* **Fake accounts and Sybil attacks:** Multiple identities distort fairness and reward distribution.
* **Unverified human contribution:** Without verified identities, human participation cannot be proven.
* **Opaque AI assistance:** Current AI tools lack transparency and verifiability in their recommendations.

---

## High-Level Solution

Nexus enforces fairness and transparency through:

1. **Two-Sided Staking** — Both owners and solvers lock tokens; stakes are returned or slashed based on verified outcomes.
2. **Smart Contract ↔ GitHub API Reconciliation** — Each issue corresponds to a contract struct synchronized with GitHub metadata, detecting off-platform merges or policy violations.
3. **Verifiable AI Agents** — Built with **ADK-TS**, our agents provide auditable repository analysis and issue generation, with actions and reputations tracked on-chain.

### ADK-TS Agent Integration

Our **NexusIntelligenceAgent** enhances the trustless platform by:
- **Automating repository analysis** to reduce maintainer coordination bottlenecks
- **Generating verifiable issue recommendations** with transparent reasoning
- **Providing audit trails** for all AI decisions through blockchain storage
- **Enabling autonomous operation** while maintaining human oversight and control

**📋 Detailed Implementation:** See [ADK-TS Implementation Guide](./ADK_TS_IMPLEMENTATION.md) for comprehensive technical details, code examples, and architecture documentation.

---

## How Staking Works

### Why Project Owners Stake

* **Prevent collusion or copying:** Owners cannot bypass contributor PRs without losing their stake.
* **Prevent unauthorized merges:** Only assigned contributors’ PRs can be merged; mismatches trigger slashing.
* **Align incentives:** Owners are economically motivated to follow Nexus’s workflow, ensuring fairness.

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

## ADK-TS Implementation Details

### NexusIntelligenceAgent Architecture

Our core agent is built using **IQAI's ADK-TS framework** with the following capabilities:

```typescript
// Core agent initialization using ADK-TS AgentBuilder
const { runner } = await AgentBuilder.create('NexusIntelligenceAgent')
    .withModel('gemini-2.5-flash')
    .withDescription('Comprehensive repository intelligence agent')
    .build();
```

**Key Features:**
- **Unified analysis pipeline** combining code, security, performance, and feature analysis
- **Structured JSON output** ensuring consistent, parseable recommendations
- **GitHub API integration** for real-time repository metadata
- **Fallback mechanisms** ensuring robust operation under all conditions

### Agent Workflow

1. **Repository Ingestion:** Parse GitHub URL and fetch metadata
2. **Multi-dimensional Analysis:** Code quality, security, performance, and feature opportunities
3. **Synthesis & Ranking:** Select highest-impact feature recommendations
4. **GitHub Issue Generation:** Create actionable issues with acceptance criteria
5. **On-chain Registration:** Store agent decisions and reputation data

### MCP Integration

```typescript
// GitHub MCP client for seamless issue creation
const githubClient = new GitHubMCPClient(process.env.GITHUB_TOKEN);
await githubClient.initialize();
const result = await githubClient.createIssue(owner, repo, issueData);
```

**Benefits:**
- **Modular agent composition** through MCP protocol
- **Interoperable toolsets** for GitHub operations
- **Scalable architecture** supporting multiple specialized agents

---

## Why Nexus Is Better Than Traditional Platforms

* **Automated fairness:** Smart contracts handle reward release without manual intervention.
* **Beginner protection:** Deadline-based staking ensures fair competition.
* **Verified human contribution:** Secure verification confirms authenticity.
* **Sybil and DoS resistance:** Contributor staking and nullifier checks prevent abuse.
* **Transparent AI:** All AI decisions are auditable and verifiable on-chain.
* **Economic accountability:** Agent reputation directly impacts future task selection through ATP-ready architecture.

---

## Tech Stack

### Blockchain & Smart Contracts (Core Platform)
* **Ethereum Sepolia Testnet** - Live deployment environment
* **Solidity Smart Contracts** - Trustless execution and verification
* **Foundry Framework** - Smart contract development and testing
* **Wagmi + Viem** - Web3 integration and wallet connectivity

### AI Agent Layer (AGENT ARENA Compliance)
* **ADK-TS (Agent Development Kit - TypeScript)** - Framework for verifiable AI agents
* **Google Gemini 2.5 Flash** - LLM integration for repository analysis
* **MCP Protocol** - Model Context Protocol for GitHub operations
* **ATP-Ready Architecture** - Built for Agent Tokenization Platform deployment

### Full-Stack Implementation
* **Frontend:** Next.js 14, TypeScript, TailwindCSS, RainbowKit
* **Backend:** Express.js server with smart contract integration
* **Identity Layer:** Secure verification using advanced cryptographic proofs
* **GitHub Integration:** Smart contract state continuously reconciled with GitHub data

### AI Agent Features
* **NexusIntelligenceAgent** - Unified repository analysis and issue generation
* **Verifiable outputs** - All agent decisions stored on-chain for transparency
* **Reputation tracking** - Long-term accountability through blockchain records
* **Economic incentives** - Token-based rewards aligned with platform fairness goals

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask wallet
- GitHub account
- Sepolia ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Nexus.git
cd Nexus
```

### 2. Environment Configuration

#### Frontend Environment (.env.local)
Create `frontend/.env.local`:

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# GitHub OAuth App (Create at: https://github.com/settings/applications/new)
# This allows users to connect ANY GitHub account, not just yours
GITHUB_CLIENT_ID=your-oauth-app-client-id
GITHUB_CLIENT_SECRET=your-oauth-app-client-secret

# WalletConnect Project ID (Get from: https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Smart Contract Address (Sepolia)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x14553856B61C2f653Cc167E31069068AC2c3f1d0

# Self.xyz Integration (Optional)
NEXT_PUBLIC_SELF_APP_NAME=Nexus
NEXT_PUBLIC_SELF_SCOPE=
NEXT_PUBLIC_SELF_ENDPOINT=
```

#### Backend Environment (adk-nexus/.env)
Create `.env` in adk-nexus directory:

```bash
# Google Gemini API Key (Get from: https://makersuite.google.com/app/apikey)
GOOGLE_API_KEY=your-google-api-key

# GitHub API Token (Optional - only for backend operations)
# Users will authenticate via OAuth, this is for server-side operations
GITHUB_TOKEN=your-server-github-token

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: Additional LLM providers
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 3. Install Dependencies

#### Frontend Setup
```bash
cd frontend
npm install
```

#### Backend Setup
```bash
# Install ADK-TS backend dependencies
cd adk-nexus
npm install

# Build the TypeScript project
npm run build
cd ..
```

### 4. Configuration Guide

#### GitHub OAuth Setup (For User Authentication)

**Important**: This OAuth app allows ANY user to connect their GitHub account to Nexus.

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create a new OAuth App:
   - **Application name:** Nexus Platform
   - **Homepage URL:** http://localhost:3000 (or your domain)
   - **Authorization callback URL:** http://localhost:3000/api/auth/callback/github
   - **Application description:** "Blockchain-backed platform for trustless open-source collaboration"
3. Copy Client ID and Client Secret to your `frontend/.env.local`

**Note**: Users will authenticate with their own GitHub accounts through this OAuth app.

#### GitHub Token Setup (Optional - For Server Operations)

**This is optional and only needed for server-side GitHub operations.**

1. Go to [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. Generate a new token with minimal scopes:
   - `public_repo` (Access public repositories)
   - `read:user` (Read user profile data)
3. Copy the token to `GITHUB_TOKEN` in your `adk-nexus/.env`

**Note**: User repositories are accessed through their OAuth tokens, not this server token.

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
After deployment, update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `frontend/.env.local` with your new contract address.

### 6. Start the Application

#### Terminal 1: Frontend
```bash
cd frontend
npm run dev
```

#### Terminal 2: ADK-TS Backend Server
```bash
cd adk-nexus
npm run server
```

### 7. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** Available at backend endpoints

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
cd frontend
npm run test
```

### Smart Contract Tests
```bash
cd contracts
forge test
```

### Backend Tests
```bash
cd adk-nexus
npm test
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel or your preferred platform
```

### Backend Deployment
```bash
# ADK-TS backend deployment
cd adk-nexus
npm run build
npm start

# Or with Docker
docker build -t nexus-adk-backend .
docker run -p 5000:5000 nexus-adk-backend
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

## AGENT ARENA Submission Details

### How We Used ADK-TS

**Primary Implementation:**
- **NexusIntelligenceAgent** built entirely with ADK-TS AgentBuilder
- **Gemini 2.5 Flash integration** through ADK-TS model configuration
- **Structured agent workflows** using ADK-TS best practices
- **MCP protocol integration** for GitHub operations

**Code Examples:**
```typescript
// Agent initialization with ADK-TS
const { runner } = await AgentBuilder.create('NexusIntelligenceAgent')
    .withModel('gemini-2.5-flash')
    .withDescription('Comprehensive repository intelligence agent')
    .build();

// Agent execution
const analysisResponse = await this.agent.ask(analysisPrompt);
const parsedResult = this.parseAnalysisResponse(analysisResponse);
```

**ATP Readiness:**
- Agent architecture designed for seamless ATP tokenization
- On-chain reputation and performance tracking
- Economic incentive alignment for autonomous operation
- Verifiable decision-making processes

**📋 Complete Technical Details:** [ADK-TS Implementation Guide](./ADK_TS_IMPLEMENTATION.md) - Comprehensive documentation with code examples, architecture diagrams, and integration details.

### Innovation & Impact

**Technical Innovation:**
- **Unified intelligence approach** replacing complex multi-agent systems
- **Blockchain-AI integration** ensuring verifiable autonomous operation
- **Real-world GitHub integration** bridging Web2 and Web3 ecosystems
- **Economic accountability** through smart contract enforcement

**Market Impact:**
- **Addresses $42B+ open-source economy** with trustless collaboration
- **Protects new developers** through automated fairness enforcement
- **Scales maintainer capacity** through intelligent automation
- **Enables verifiable AI** in critical development workflows

### Future ATP Deployment

Upon ATP launch, Nexus agents will:
- **Operate autonomously** with tokenized economic incentives
- **Maintain reputation scores** affecting task selection and rewards
- **Generate revenue** through successful issue resolution and analysis
- **Scale globally** across thousands of repositories simultaneously

---

## Summary

**Nexus** demonstrates the future of **autonomous AI agents** in open-source development. Built with **ADK-TS** and ready for **ATP deployment**, our **NexusIntelligenceAgent** combines **verifiable intelligence**, **blockchain enforcement**, and **real-world GitHub integration** to create a trustless, scalable platform for collaborative development.

**For AGENT ARENA judges:** This submission showcases practical AI agent development using IQAI's ADK-TS framework, with a live deployment demonstrating autonomous repository analysis, issue generation, and smart contract integration — ready for immediate ATP tokenization and global scaling.
