# Nexus Local Setup Guide

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Git**

## Quick Setup

Run the automated setup script:

```bash
./setup.sh
```

## Manual Setup

### 1. ADK-TS Backend Setup

```bash
# Navigate to ADK-TS backend
cd adk-nexus

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Frontend Setup

```bash
cd monorepo
npm install --legacy-peer-deps
```

## Environment Configuration

### Backend (adk-nexus/.env)
Copy and configure the `.env` file in the adk-nexus directory:

```bash
# Google Gemini API Key (required for ADK-TS)
GOOGLE_API_KEY=your_google_api_key_here

# GitHub API Token (for repository integration)
GITHUB_TOKEN=your_github_token_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: Additional LLM providers
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### Frontend (monorepo/.env.local)
Copy and configure the `.env.local` file in the monorepo directory:

```bash
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# GitHub OAuth (Get from GitHub Developer Settings)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# WalletConnect (Get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Smart Contract Address (Already configured for Ethereum Sepolia Testnet)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x14553856B61C2f653Cc167E31069068AC2c3f1d0
```

## Running the Application

### Start Backend (Terminal 1)
```bash
cd adk-nexus
npm run server
```

### Start Frontend (Terminal 2)
```bash
cd monorepo
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Required API Keys & Setup

### 1. GitHub OAuth App
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env.local`

### 2. WalletConnect Project ID
1. Visit https://cloud.walletconnect.com/
2. Create a new project
3. Copy the Project ID to `.env.local`

### 3. GitHub Personal Access Token
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with repo permissions
3. Add to backend `.env` file

## Troubleshooting

### Node.js Version Issues
If you encounter engine compatibility warnings, they can usually be ignored. The `--legacy-peer-deps` flag resolves most dependency conflicts.

### ADK-TS Dependencies
If you encounter issues with the ADK-TS backend, ensure you have Node.js 18+ and all dependencies are properly installed in the adk-nexus directory.

### Port Conflicts
- Frontend runs on port 3000
- ADK-TS backend runs on port 5000
- Check for any running services on these ports

## Project Structure

```
├── adk-nexus/            # ADK-TS backend
│   ├── src/              # TypeScript source code
│   ├── package.json      # Node.js dependencies
│   └── .env              # Backend environment variables
├── monorepo/             # Next.js frontend
│   ├── src/              # Frontend source code
│   ├── package.json      # Node.js dependencies
│   └── .env.local        # Frontend environment variables
├── contracts/            # Smart contracts (Foundry)
└── setup.sh             # Automated setup script
```

## Additional Resources

- **Documentation**: https://ironjams-organization.gitbook.io/Nexusv0
- **Demo Video**: https://www.youtube.com/watch?v=BJkFdprHhmY
- **Contract**: Ethereum Sepolia Testnet - 0x14553856B61C2f653Cc167E31069068AC2c3f1d0
