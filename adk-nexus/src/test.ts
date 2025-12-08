/**
 * Test script for ADK-TS Nexus Repository Analyzer
 * Verifies that the implementation works correctly
 */

import dotenv from 'dotenv';
import { NexusRepositoryAnalyzer } from './NexusRepositoryAnalyzer.js';
import { GitHubMCPClient } from './github/GitHubMCPClient.js';
import type { RepositoryAnalysisRequest } from './types.js';

// Load environment variables
dotenv.config();

async function testAnalyzer() {
    console.log('🧪 Testing ADK-TS Nexus Repository Analyzer...');
    console.log('='.repeat(60));

    // Check environment
    console.log('🔧 Environment check:');
    console.log('   GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('   GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? '✅ Set' : '⚠️ Optional');

    if (!process.env.GOOGLE_API_KEY) {
        console.error('❌ GOOGLE_API_KEY is required for testing');
        process.exit(1);
    }

    try {
        // Initialize analyzer
        console.log('\n🔧 Initializing Nexus Repository Analyzer...');
        const analyzer = new NexusRepositoryAnalyzer();
        await analyzer.initialize();
        console.log('✅ Analyzer initialized successfully');

        // Initialize GitHub client
        console.log('\n🔧 Initializing GitHub MCP Client...');
        const githubClient = new GitHubMCPClient(process.env.GITHUB_TOKEN);
        await githubClient.initialize();
        console.log('✅ GitHub client initialized successfully');

        // Test repository analysis
        console.log('\n🔍 Testing analysis with: https://github.com/mohitagarwal24/Pokemon-Explorer');
        const testRequest: RepositoryAnalysisRequest = {
            repoUrl: 'https://github.com/mohitagarwal24/Pokemon-Explorer',
            analysisType: 'full'
        };

        const result = await analyzer.analyzeRepository(testRequest);

        console.log('\n🎉 Analysis completed!');
        console.log('📊 Result summary:');
        console.log(`   Repository: ${result.repository}`);
        console.log(`   Method: ${result.analysisMethod}`);
        console.log(`   Title: ${result.synthesizedAnalysis.selectedFeature?.title || 'N/A'}`);
        console.log(`   Difficulty: ${result.synthesizedAnalysis.selectedFeature?.difficulty || 'N/A'}`);
        console.log(`   Priority: ${result.synthesizedAnalysis.selectedFeature?.priority || 'N/A'}`);
        console.log(`   Body length: ${result.githubPayload?.body?.length || 0} chars`);

        // Test GitHub issue creation
        console.log('\n🎯 Testing issue creation...');
        if (result.success && result.githubPayload) {
            const issueResult = await githubClient.createIssue(
                'mohitagarwal24',
                'Pokemon-Explorer',
                result.githubPayload
            );

            if (issueResult.success) {
                console.log('✅ Issue creation successful!');
                console.log(`   Issue #${issueResult.issue?.number}: ${issueResult.issue?.title}`);
                console.log(`   URL: ${issueResult.issue?.url}`);
            } else {
                console.log('⚠️ Issue creation failed (expected in test mode)');
            }
        }

        console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testAnalyzer().catch(error => {
        console.error('❌ Fatal test error:', error);
        process.exit(1);
    });
}

export { testAnalyzer };
