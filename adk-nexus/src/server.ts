/**
 * Express API Server for ADK-TS Nexus Repository Analyzer
 * Provides REST endpoints for frontend integration
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { NexusRepositoryAnalyzer } from './NexusRepositoryAnalyzer.js';
import { GitHubMCPClient } from './github/GitHubMCPClient.js';
import type { RepositoryAnalysisRequest } from './types.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
// Configure CORS for production and development
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    // Add production frontend URL from environment
    process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global instances
let analyzer: NexusRepositoryAnalyzer | null = null;
let githubClient: GitHubMCPClient | null = null;

/**
 * Initialize the analyzer
 */
async function initializeAnalyzer(): Promise<boolean> {
    try {
        analyzer = new NexusRepositoryAnalyzer();
        await analyzer.initialize();
        console.log('✅ Nexus Repository Analyzer initialized successfully');

        // Initialize GitHub MCP client
        githubClient = new GitHubMCPClient(process.env.GITHUB_TOKEN);
        await githubClient.initialize();
        console.log('✅ GitHub MCP Client initialized successfully');

        return true;
    } catch (error) {
        console.error('❌ Failed to initialize analyzer:', error);
        return false;
    }
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'ADK-TS Nexus Repository Analysis API',
        analyzer_ready: analyzer !== null,
        timestamp: new Date().toISOString()
    });
});

/**
 * Analyze repository endpoint
 * POST /api/analyze-repo
 * Body: { "repoUrl": "https://github.com/owner/repo", "analysisType": "full" }
 */
app.post('/api/analyze-repo', async (req, res) => {
    try {
        console.log('📥 API: Received repository analysis request');
        console.log('📋 Request body:', JSON.stringify(req.body, null, 2));

        // Extract user's GitHub token from Authorization header
        const authHeader = req.headers.authorization;
        const userGitHubToken = authHeader?.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;

        console.log('🔐 User GitHub token present:', !!userGitHubToken);

        // Support both repoUrl and repo_url for frontend compatibility
        const repoUrl = req.body.repoUrl || req.body.repo_url;
        const analysisType = req.body.analysisType || req.body.analysis_type || 'full';

        console.log(`🔍 Extracted repoUrl: ${repoUrl}`);
        console.log(`🔍 Extracted analysisType: ${analysisType}`);

        if (!repoUrl) {
            return res.status(400).json({
                success: false,
                error: 'repoUrl or repo_url is required'
            });
        }

        // Validate request
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Request body must be a valid JSON object'
            });
        }

        if (!repoUrl || typeof repoUrl !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'repoUrl is required and must be a string'
            });
        }

        // Validate GitHub URL format
        if (!repoUrl.match(/^https:\/\/github\.com\/[^\/]+\/[^\/\?#]+/)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid GitHub repository URL format'
            });
        }

        // Check if analyzer is initialized
        if (!analyzer) {
            return res.status(500).json({
                success: false,
                error: 'Analysis service not properly initialized'
            });
        }

        console.log(`🔍 API: Analyzing repository: ${repoUrl}`);

        // Perform analysis with user's GitHub token
        const request: RepositoryAnalysisRequest = {
            repoUrl,
            analysisType: analysisType as 'full' | 'quick' | 'feature-focused',
            userGitHubToken: userGitHubToken || undefined // Pass user's token for repository access
        };

        const result = await analyzer.analyzeRepository(request);

        if (result.success) {
            console.log(`✅ API: Analysis completed for ${repoUrl}`);

            // Transform response to match frontend expected format (snake_case)
            const frontendResponse = {
                success: result.success,
                agents_discovered: result.agentsDiscovered,
                agents_used: result.agentsUsed,
                analysis_method: result.analysisMethod,
                repository: result.repository,
                selected_agents: result.selectedAgents,
                github_payload: {
                    title: result.githubPayload?.title || '',
                    body: result.githubPayload?.body || '',
                    labels: result.githubPayload?.labels || [],
                    assignees: result.githubPayload?.assignees || []
                },
                synthesized_analysis: {
                    title: result.synthesizedAnalysis?.selectedFeature?.title || '',
                    body: result.synthesizedAnalysis?.selectedFeature?.description || '',
                    difficulty: result.synthesizedAnalysis?.selectedFeature?.difficulty || 'Medium',
                    priority: result.synthesizedAnalysis?.selectedFeature?.priority || 'Medium',
                    implementation_estimate: result.synthesizedAnalysis?.selectedFeature?.implementationTime || '2-3 weeks',
                    technical_requirements: result.synthesizedAnalysis?.selectedFeature?.technicalRequirements || [],
                    acceptance_criteria: result.synthesizedAnalysis?.selectedFeature?.acceptanceCriteria || [],
                    labels: result.githubPayload?.labels || []
                }
            };

            return res.json(frontendResponse);
        } else {
            console.error(`❌ API: Analysis failed for ${repoUrl}:`, result.error);
            return res.status(500).json({
                success: false,
                error: result.error
            });
        }

    } catch (error) {
        console.error('❌ API: Unexpected error in analyze-repo:', error);
        return res.status(500).json({
            success: false,
            error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
    }
});

/**
 * Create GitHub issue endpoint (using MCP)
 * POST /api/create-github-issue
 * Body: { "owner": "owner", "repo": "repo", "issueData": {...} }
 */
app.post('/api/create-github-issue', async (req, res) => {
    try {
        const { owner, repo, issueData } = req.body;

        if (!owner || !repo || !issueData) {
            return res.status(400).json({
                success: false,
                error: 'owner, repo, and issueData are required'
            });
        }

        console.log(`📝 API: Creating GitHub issue for ${owner}/${repo}`);

        if (!githubClient) {
            return res.status(500).json({
                success: false,
                error: 'GitHub MCP client not initialized'
            });
        }

        // Use GitHub MCP to create the issue
        const result = await githubClient.createIssue(owner, repo, issueData);

        if (result.success && result.issue) {
            console.log(`✅ API: GitHub issue created: #${result.issue.number}`);
            return res.json({
                success: true,
                issue: result.issue
            });
        } else {
            console.error(`❌ API: Failed to create GitHub issue: ${result.error}`);
            return res.status(500).json({
                success: false,
                error: result.error || 'Failed to create GitHub issue'
            });
        }
    } catch (error) {
        console.error('❌ API: Error creating GitHub issue:', error);
        return res.status(500).json({
            success: false,
            error: `Failed to create GitHub issue: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
    }
});

/**
 * Get available analysis types
 */
app.get('/api/analysis-types', (req, res) => {
    res.json({
        success: true,
        analysisTypes: [
            {
                type: 'quick',
                name: 'Quick Analysis',
                description: 'Fast feature suggestions using single agent',
                estimatedTime: '30-60 seconds'
            },
            {
                type: 'feature-focused',
                name: 'Feature-Focused Analysis',
                description: 'Detailed feature analysis using multiple agents',
                estimatedTime: '1-2 minutes'
            },
            {
                type: 'full',
                name: 'Comprehensive Analysis',
                description: 'Complete analysis including security, performance, and features',
                estimatedTime: '2-3 minutes'
            }
        ]
    });
});

/**
 * Error handling middleware
 */
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

/**
 * 404 handler - catch all unmatched routes
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

/**
 * Start the server
 */
async function startServer() {
    console.log('🚀 Starting ADK-TS Nexus Repository Analysis API Server...');
    console.log('='.repeat(80));

    // Check environment variables
    const requiredEnvVars = ['GOOGLE_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:', missingVars);
        console.error('Please check your .env file');
        process.exit(1);
    }

    console.log('🔧 Environment check:');
    console.log('   GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('   GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? '✅ Set' : '⚠️ Optional');

    // Initialize analyzer
    const initialized = await initializeAnalyzer();
    if (!initialized) {
        console.error('❌ Failed to initialize analyzer. Exiting...');
        process.exit(1);
    }

    // Start server
    app.listen(port, () => {
        console.log('='.repeat(80));
        console.log(`🌐 Server running on http://localhost:${port}`);
        console.log('📡 Available endpoints:');
        console.log('  GET  /health - Health check');
        console.log('  GET  /api/analysis-types - Get available analysis types');
        console.log('  POST /api/analyze-repo - Analyze repository');
        console.log('  POST /api/create-github-issue - Create GitHub issue');
        console.log('='.repeat(80));
        console.log('✅ ADK-TS Nexus Repository Analyzer ready for requests!');
    });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    startServer().catch(error => {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    });
}

export { app, startServer };
