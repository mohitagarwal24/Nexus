#!/bin/bash

echo "🚀 Nexus Deployment Setup Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}This script will help you prepare for deployment to Vercel + Render${NC}"
echo ""

# Check if required files exist
echo -e "${YELLOW}📋 Checking project structure...${NC}"

if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Frontend directory not found${NC}"
    exit 1
fi

if [ ! -d "adk-nexus" ]; then
    echo -e "${RED}❌ ADK-Nexus backend directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project structure looks good${NC}"
echo ""

# Generate NextAuth secret
echo -e "${YELLOW}🔐 Generating NextAuth secret...${NC}"
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}Generated NextAuth secret: ${NEXTAUTH_SECRET}${NC}"
echo ""

# Create environment variable templates
echo -e "${YELLOW}📝 Creating environment variable templates...${NC}"

# Frontend environment template
cat > frontend/.env.production.template << EOF
# Copy these to Vercel Environment Variables
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# GitHub OAuth App (create at: https://github.com/settings/applications/new)
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# WalletConnect (get from: https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Smart Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC381B1dd37B82810356EdD61Cb584e3228457aC7

# Backend API URL (will be provided after Render deployment)
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com

# Self.xyz Integration (Optional)
NEXT_PUBLIC_SELF_APP_NAME=Nexus
NEXT_PUBLIC_SELF_SCOPE=
NEXT_PUBLIC_SELF_ENDPOINT=
EOF

# Backend environment template
cat > adk-nexus/.env.production.template << EOF
# Copy these to Render Environment Variables
NODE_ENV=production
PORT=5000

# Google Gemini API (get from: https://makersuite.google.com/app/apikey)
GOOGLE_API_KEY=your_google_gemini_api_key

# Frontend URL (will be provided after Vercel deployment)
FRONTEND_URL=https://your-app-name.vercel.app

# Optional: GitHub token for server operations
GITHUB_TOKEN=your_github_token_optional

# Optional: Additional LLM providers
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
EOF

echo -e "${GREEN}✅ Environment templates created:${NC}"
echo -e "   📁 frontend/.env.production.template"
echo -e "   📁 adk-nexus/.env.production.template"
echo ""

# Check if dependencies are installed
echo -e "${YELLOW}📦 Checking dependencies...${NC}"

cd frontend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install --legacy-peer-deps
fi
cd ..

cd adk-nexus
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
fi
cd ..

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Build check
echo -e "${YELLOW}🔨 Testing builds...${NC}"

cd frontend
echo -e "${BLUE}Building frontend...${NC}"
if npm run build 2>&1 | tee build.log; then
    if grep -q "Failed to compile" build.log; then
        echo -e "${RED}❌ Frontend build failed with compilation errors${NC}"
        cd ..
        exit 1
    else
        echo -e "${GREEN}✅ Frontend build successful (warnings are OK for deployment)${NC}"
    fi
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    cd ..
    exit 1
fi
rm -f build.log
cd ..

cd adk-nexus
echo -e "${BLUE}Building backend...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Backend build successful${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    cd ..
    exit 1
fi
cd ..

echo ""
echo -e "${GREEN}🎉 Deployment setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "1. ${YELLOW}Create GitHub OAuth App:${NC}"
echo -e "   - Go to: https://github.com/settings/applications/new"
echo -e "   - Use callback URL: https://your-app-name.vercel.app/api/auth/callback/github"
echo ""
echo -e "2. ${YELLOW}Deploy Backend to Render:${NC}"
echo -e "   - Connect repository and select 'adk-nexus' directory"
echo -e "   - Copy environment variables from: adk-nexus/.env.production.template"
echo ""
echo -e "3. ${YELLOW}Deploy Frontend to Vercel:${NC}"
echo -e "   - Connect repository and select 'frontend' directory"
echo -e "   - Copy environment variables from: frontend/.env.production.template"
echo ""
echo -e "4. ${YELLOW}Update URLs:${NC}"
echo -e "   - Update NEXT_PUBLIC_API_URL in Vercel with your Render backend URL"
echo -e "   - Update FRONTEND_URL in Render with your Vercel frontend URL"
echo ""
echo -e "${BLUE}📖 Full deployment guide: DEPLOYMENT_GUIDE.md${NC}"
echo ""
echo -e "${GREEN}Your NextAuth secret: ${NEXTAUTH_SECRET}${NC}"
echo -e "${YELLOW}⚠️  Save this secret - you'll need it for Vercel environment variables${NC}"
