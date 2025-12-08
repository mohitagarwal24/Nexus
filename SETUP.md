# Nexus Local Setup Guide

## Prerequisites

- **Node.js** (v18+ recommended, though v24 is currently installed)
- **Python 3.8+**
- **Git**

## Quick Setup

Run the automated setup script:

```bash
./setup.sh
```

## Manual Setup

### 1. Python Backend Setup

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Frontend Setup

```bash
cd monorepo
npm install --legacy-peer-deps
```

## Environment Configuration

### Backend (.env)
Copy and configure the `.env` file in the root directory:

```bash
# GitHub API Token (for repository integration)
GITHUB_TOKEN=your_github_token_here

# Fetch.ai Agent Configuration  
AGENT_SEED=your_agent_seed_here

# Logging Level
LOG_LEVEL=INFO
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
source venv/bin/activate
python main_agent.py
```

### Start Frontend (Terminal 2)
```bash
cd monorepo
npm run dev
```

The frontend will be available at: **http://localhost:3000**

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

### Python Dependencies
If you encounter issues with Python packages, ensure you're using Python 3.8+ and have activated the virtual environment.

### Port Conflicts
- Frontend runs on port 3000
- Backend may use various ports depending on configuration
- Check for any running services on these ports

## Project Structure

```
├── main_agent.py          # Main Python backend
├── requirements.txt       # Python dependencies
├── monorepo/             # Next.js frontend
│   ├── src/              # Frontend source code
│   ├── package.json      # Node.js dependencies
│   └── .env.local        # Frontend environment variables
├── contracts/            # Smart contracts
├── uagent/              # Agent configurations
└── .env                 # Backend environment variables
```

## Additional Resources

- **Documentation**: https://ironjams-organization.gitbook.io/Nexusv0
- **Demo Video**: https://www.youtube.com/watch?v=BJkFdprHhmY
- **Contract**: Ethereum Sepolia Testnet - 0x14553856B61C2f653Cc167E31069068AC2c3f1d0
