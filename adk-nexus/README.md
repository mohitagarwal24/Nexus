# ADK-TS Nexus Repository Analyzer

A powerful **unified intelligence agent** for comprehensive repository analysis, built with ADK-TS framework and optimized for Agent Tokenization Platform (ATP) deployment.

## 🚀 Features

- **Unified Intelligence Agent**: Single consolidated agent performing all analysis types
- **ADK-TS Framework**: Built on the modern ADK-TS framework with Google Gemini integration
- **ATP Optimized**: Designed for cost-effective deployment on Agent Tokenization Platform
- **Comprehensive Analysis**: Code analysis, security auditing, performance optimization, and feature suggestions
- **GitHub MCP Integration**: Seamless GitHub issue creation using Model Context Protocol
- **REST API**: Express.js server for frontend integration
- **CLI Interface**: Interactive command-line interface for direct usage
- **TypeScript**: Fully typed implementation for better development experience

## 🏗️ Architecture

### Unified Intelligence System
- **NexusIntelligenceAgent**: Single comprehensive agent that performs:
  - Code structure and architecture analysis
  - Security vulnerability assessment
  - Performance bottleneck identification
  - Feature enhancement suggestions
  - Result synthesis and prioritization

### Analysis Flow
1. **Initialization**: Initialize the unified intelligence agent
2. **Comprehensive Analysis**: Single agent performs all analysis types in sequence
3. **Intelligent Synthesis**: Built-in synthesis selects the best feature suggestion
4. **GitHub Integration**: Create GitHub issues using MCP for suggested features

## 📦 Installation

```bash
# Clone or navigate to the project
cd adk-Nexus

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your API keys
# GOOGLE_API_KEY=your_google_api_key_here
# GITHUB_TOKEN=your_github_token_here (optional)
```

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | ✅ Yes | Google Gemini API key for AI agents |
| `GITHUB_TOKEN` | ⚠️ Optional | GitHub token for MCP issue creation |
| `PORT` | ❌ No | Server port (default: 3000) |

## 🚀 Usage

### CLI Mode (Interactive)
```bash
npm start
# or
npm run dev
```

### API Server Mode
```bash
npm run server
```

### Run Tests
```bash
npm test
```

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### Analyze Repository
```http
POST /api/analyze-repo
Content-Type: application/json

{
  "repoUrl": "https://github.com/owner/repo",
  "analysisType": "full" // "quick" | "feature-focused" | "full"
}
```

### Create GitHub Issue
```http
POST /api/create-github-issue
Content-Type: application/json

{
  "owner": "owner",
  "repo": "repo", 
  "issueData": {
    "title": "Feature Title",
    "body": "Feature Description",
    "labels": ["enhancement", "ai-generated"]
  }
}
```

### Get Analysis Types
```http
GET /api/analysis-types
```

## 🔄 Migration from Fetch AI/ASI

This implementation replaces the original Python-based system with the following improvements:

### Original vs ADK-TS Nexus
| Aspect | Original (Python) | ADK-TS Nexus (TypeScript) |
|--------|------------------|---------------------------|
| Framework | Fetch AI + ASI | ADK-TS + Google Gemini |
| Agent Architecture | Multiple specialized agents | Single unified intelligence agent |
| Agent Communication | uAgents protocol | Internal unified processing |
| Synthesis | ASI:One API | Built-in intelligent synthesis |
| GitHub Integration | Direct API calls | MCP (Model Context Protocol) |
| Language | Python | TypeScript |
| Server | Flask | Express.js |
| ATP Deployment | 5 agents (high cost) | 1 agent (cost-optimized) |

### Functional Equivalence
- ✅ Comprehensive repository analysis (unified approach)
- ✅ Feature suggestion synthesis  
- ✅ GitHub issue creation
- ✅ REST API for frontend integration
- ✅ Same output format and structure
- ✅ CLI interface compatibility
- ✅ **ATP deployment ready** (single agent)

## 🧪 Testing

The system includes comprehensive testing:

```bash
# Run full test suite
npm test

# Test specific repository
npm start
# Then enter: https://github.com/mohitagarwal24/Pokemon-Explorer
```

## 🔧 Development

### Project Structure
```
src/
├── github/                      # GitHub MCP integration
│   └── GitHubMCPClient.ts
├── NexusIntelligenceAgent.ts    # Unified intelligence agent
├── NexusRepositoryAnalyzer.ts   # Main orchestrator
├── server.ts                    # Express API server
├── index.ts                     # CLI interface
├── test.ts                      # Test suite
└── types.ts                     # TypeScript definitions
```

### Extending the Intelligence Agent
The unified `NexusIntelligenceAgent` can be enhanced by:
1. Modifying the comprehensive analysis prompt
2. Adding new analysis dimensions to the prompt structure
3. Updating the JSON response format
4. Enhancing the synthesis logic

## 🌐 Frontend Integration

The API server provides the same endpoints as the original Flask implementation, ensuring seamless frontend integration:

```javascript
// Analyze repository
const response = await fetch('/api/analyze-repo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    repoUrl: 'https://github.com/owner/repo',
    analysisType: 'full'
  })
});

const result = await response.json();
// Use result.synthesizedAnalysis.selectedFeature for UI
```

## 🚀 Deployment

### Local Development
```bash
npm run dev    # CLI with hot reload
npm run server # API server
```

### Production
```bash
npm run build  # Compile TypeScript
npm start      # Run production build
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following TypeScript best practices
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project maintains the same license as the original implementation.

## 🆘 Support

For issues and questions:
1. Check the test suite for examples
2. Review the original Python implementation for reference
3. Ensure all environment variables are properly set
4. Check ADK-TS documentation for framework-specific issues

---

**Note**: This ADK-TS implementation provides the exact same functionality as the original Fetch AI/ASI system while offering improved performance, type safety, and maintainability.
