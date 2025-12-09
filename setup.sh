#!/bin/bash

echo "🚀 Setting up Nexus project with ADK-TS..."

# Setup ADK-TS backend dependencies
echo "🤖 Setting up ADK-TS backend..."
cd adk-nexus
npm install
echo "✅ ADK-TS backend dependencies installed"
cd ..

# Setup frontend dependencies
echo "⚛️  Setting up Next.js frontend..."
cd monorepo
npm install --legacy-peer-deps
echo "✅ Frontend dependencies installed"
cd ..

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure environment variables:"
echo "   - Edit adk-nexus/.env for ADK-TS backend (Google API key, GitHub token)"
echo "   - Edit monorepo/.env.local for Next.js frontend (GitHub OAuth, WalletConnect)"
echo ""
echo "2. To run the project:"
echo "   Backend:  cd adk-nexus && npm run server"
echo "   Frontend: cd monorepo && npm run dev"
echo ""
echo "🔗 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:5000"
