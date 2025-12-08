# ADK-TS Nexus Repository Analyzer

A powerful multi-agent repository analysis system built with ADK-TS framework, replacing the original Fetch AI and ASI implementation with modern TypeScript architecture.

## 🚀 Features

- **Multi-Agent Analysis**: Uses specialized AI agents for comprehensive repository analysis
- **ADK-TS Framework**: Built on the modern ADK-TS framework with Google Gemini integration
- **GitHub MCP Integration**: Seamless GitHub issue creation using Model Context Protocol
- **REST API**: Express.js server for frontend integration
- **CLI Interface**: Interactive command-line interface for direct usage
- **TypeScript**: Fully typed implementation for better development experience

## 🏗️ Architecture

### Multi-Agent System
- **Code Analyzer Agent**: Analyzes code structure and architecture
- **Feature Suggester Agent**: Suggests innovative features and enhancements
- **Security Auditor Agent**: Identifies security improvements and best practices
- **Performance Optimizer Agent**: Recommends performance optimizations

### Analysis Flow
1. **Discovery**: Initialize specialized analysis agents
2. **Analysis**: Each agent analyzes the repository from their perspective
3. **Synthesis**: Combine results using synthesis agent to select best feature
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

### Original vs ADK-TS
| Aspect | Original (Python) | ADK-TS (TypeScript) |
|--------|------------------|---------------------|
| Framework | Fetch AI + ASI | ADK-TS + Google Gemini |
| Agent Discovery | Agentverse API | Built-in specialized agents |
| Agent Communication | uAgents protocol | Direct ADK-TS integration |
| Synthesis | ASI:One API | ADK-TS synthesis agent |
| GitHub Integration | Direct API calls | MCP (Model Context Protocol) |
| Language | Python | TypeScript |
| Server | Flask | Express.js |

### Functional Equivalence
- ✅ Multi-agent repository analysis
- ✅ Feature suggestion synthesis  
- ✅ GitHub issue creation
- ✅ REST API for frontend integration
- ✅ Same output format and structure
- ✅ CLI interface compatibility

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
├── agents/                 # Specialized analysis agents
│   ├── BaseAnalysisAgent.ts
│   ├── CodeAnalyzerAgent.ts
│   ├── FeatureSuggesterAgent.ts
│   ├── SecurityAuditorAgent.ts
│   └── PerformanceOptimizerAgent.ts
├── github/                 # GitHub MCP integration
│   └── GitHubMCPClient.ts
├── NexusRepositoryAnalyzer.ts  # Main orchestrator
├── server.ts              # Express API server
├── index.ts               # CLI interface
├── test.ts                # Test suite
└── types.ts               # TypeScript definitions
```

### Adding New Agents
1. Extend `BaseAnalysisAgent`
2. Implement required abstract methods
3. Add to `NexusRepositoryAnalyzer` agents array
4. Update agent selection logic

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
