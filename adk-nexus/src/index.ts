/**
 * Main entry point for ADK-TS Nexus Repository Analyzer
 * CLI interface similar to the original main_agent.py
 */

import dotenv from 'dotenv';
import { NexusRepositoryAnalyzer } from './NexusRepositoryAnalyzer.js';
import type { RepositoryAnalysisRequest } from './types.js';

// Load environment variables
dotenv.config();

/**
 * CLI interface for repository analysis
 */
async function runCLI() {
    console.log('╔═════════════════════════════════════════════════════════════════════════════╗');
    console.log('║           🚀 Enhanced Nexus Repository Analyzer                             ║');
    console.log('║              ADK-TS Multi-Agent Analysis System                             ║');
    console.log('╚═════════════════════════════════════════════════════════════════════════════╝');
    console.log();
    console.log('This tool analyzes GitHub repositories and suggests feature enhancements');
    console.log('-'.repeat(80));

    // Check environment variables
    console.log('🔧 Environment check:');
    console.log('   GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('   GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? '✅ Set' : '⚠️ Optional');
    console.log();

    if (!process.env.GOOGLE_API_KEY) {
        console.error('❌ GOOGLE_API_KEY is required. Please set it in your .env file');
        process.exit(1);
    }

    // Initialize analyzer
    const analyzer = new NexusRepositoryAnalyzer();

    try {
        console.log('🔧 Initializing Nexus Repository Analyzer...');
        await analyzer.initialize();
        console.log('✅ Nexus Repository Analyzer initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize analyzer:', error);
        process.exit(1);
    }

    console.log('-'.repeat(80));

    // Interactive CLI loop
    const readline = await import('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const askQuestion = (question: string): Promise<string> => {
        return new Promise((resolve) => {
            rl.question(question, resolve);
        });
    };

    try {
        while (true) {
            const repoUrl = await askQuestion('📂 Enter GitHub repository URL (or \'quit\' to exit): ');

            if (repoUrl.toLowerCase() === 'quit') {
                break;
            }

            if (!repoUrl.match(/^https:\/\/github\.com\/[^\/]+\/[^\/\?#]+/)) {
                console.log('❌ Invalid GitHub repository URL format');
                continue;
            }

            console.log(`📊 Analyzing repository: ${repoUrl}`);

            try {
                const request: RepositoryAnalysisRequest = {
                    repoUrl,
                    analysisType: 'full'
                };

                const result = await analyzer.analyzeRepository(request);

                if (result.success) {
                    console.log('\n🎉 Analysis complete!');
                    console.log(`Repository: ${result.repository}`);
                    console.log(`Agents discovered: ${result.agentsDiscovered}`);
                    console.log(`Agents used: ${result.agentsUsed}`);
                    console.log(`Selected agents: ${result.selectedAgents.join(', ')}`);
                    console.log(`Suggested Feature: ${result.synthesizedAnalysis.selectedFeature.title}`);
                    console.log(`Difficulty: ${result.synthesizedAnalysis.selectedFeature.difficulty} | Priority: ${result.synthesizedAnalysis.selectedFeature.priority}`);
                    console.log(`Implementation Estimate: ${result.synthesizedAnalysis.selectedFeature.implementationTime}`);
                    console.log(`Description: ${result.synthesizedAnalysis.selectedFeature.description}`);
                    console.log(`Analysis Method: ${result.analysisMethod}`);
                } else {
                    console.log(`❌ Analysis failed: ${result.error}`);
                }
            } catch (error) {
                console.error('❌ Analysis failed:', error);
            }

            console.log('\n' + '-'.repeat(80));
        }
    } finally {
        rl.close();
    }

    console.log('\n👋 Thank you for using Nexus Repository Analyzer!');
}

/**
 * Main function
 */
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log('ADK-TS Nexus Repository Analyzer');
        console.log('');
        console.log('Usage:');
        console.log('  npm start              # Run interactive CLI');
        console.log('  npm run server         # Start API server');
        console.log('  npm run dev            # Start in development mode');
        console.log('');
        console.log('Environment variables:');
        console.log('  GOOGLE_API_KEY         # Required: Google Gemini API key');
        console.log('  GITHUB_TOKEN           # Optional: GitHub API token');
        console.log('  PORT                   # Optional: Server port (default: 3000)');
        return;
    }

    if (args.includes('--server')) {
        // Start server mode
        const { startServer } = await import('./server.js');
        await startServer();
    } else {
        // Start CLI mode
        await runCLI();
    }
}

// Run main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    });
}

export { main };
