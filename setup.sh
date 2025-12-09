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
cd frontend
npm install --legacy-peer-deps
echo "✅ Frontend dependencies installed"
cd ..

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure environment variables:"
echo "   - Edit adk-nexus/.env for ADK-TS backend (Google API key)"
echo "   - Edit frontend/.env.local for Next.js frontend (GitHub OAuth app)"
echo ""
echo "2. Create GitHub OAuth App (allows ANY user to connect their GitHub):"
echo "   - Go to: https://github.com/settings/applications/new"
echo "   - Set callback URL: http://localhost:3000/api/auth/callback/github"
echo ""
echo "3. To run the project:"
echo "   Backend:  cd adk-nexus && npm run server"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "🔗 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:5000"
