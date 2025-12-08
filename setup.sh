#!/bin/bash

echo "🚀 Setting up Nexus project..."

# Check if Python virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install Python dependencies
echo "🐍 Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt

# Setup frontend dependencies
echo "⚛️  Setting up Next.js frontend..."
cd monorepo
npm install --legacy-peer-deps

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure environment variables:"
echo "   - Edit .env for Python backend"
echo "   - Edit monorepo/.env.local for Next.js frontend"
echo ""
echo "2. To run the project:"
echo "   Backend:  source venv/bin/activate && python main_agent.py"
echo "   Frontend: cd monorepo && npm run dev"
echo ""
echo "🔗 The frontend will be available at http://localhost:3000"
