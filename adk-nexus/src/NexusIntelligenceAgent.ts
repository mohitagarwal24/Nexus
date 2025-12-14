/**
 * Nexus Intelligence Agent - Consolidated single agent for comprehensive repository analysis
 * Replaces multiple specialized agents with one unified intelligent agent
 * Optimized for Agent Tokenization Platform (ATP) deployment
 */

import { AgentBuilder } from '@iqai/adk';
import type {
    RepositoryAnalysisRequest,
    AnalysisResponse,
    GitHubRepository,
    FeatureSuggestion,
    GitHubIssueData,
    SynthesizedAnalysis
} from './types.js';

export class NexusIntelligenceAgent {
    private agent: any;
    private initialized: boolean = false;

    constructor() { }

    /**
     * Initialize the consolidated intelligence agent
     */
    async initialize(): Promise<void> {
        console.log('🚀 Initializing Nexus Intelligence Agent...');

        try {
            const { runner } = await AgentBuilder.create('NexusIntelligenceAgent')
                .withModel('gemini-2.5-flash-lite')
                .withDescription('Comprehensive repository intelligence agent that performs code analysis, security auditing, performance optimization, and feature suggestion in a single unified analysis')
                .build();

            this.agent = runner;
            this.initialized = true;

            console.log('✅ Nexus Intelligence Agent initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Nexus Intelligence Agent:', error);
            throw error;
        }
    }

    /**
     * Analyze a repository using unified intelligence approach
     */
    async analyzeRepository(request: RepositoryAnalysisRequest): Promise<AnalysisResponse> {
        if (!this.initialized) {
            throw new Error('Agent not initialized. Call initialize() first.');
        }

        console.log(`🧠 Analyzing repository with Nexus Intelligence: ${request.repoUrl}`);
        console.log('⏳ Performing comprehensive analysis...');

        try {
            // Parse repository information
            const repository = this.parseRepositoryUrl(request.repoUrl);

            // Get repository metadata
            const repoMetadata = await this.getRepositoryMetadata(repository);

            // Perform unified analysis
            const analysisResult = await this.performUnifiedAnalysis(repoMetadata, request.analysisType || 'full');

            console.log('🎉 Unified analysis complete!');

            return {
                success: true,
                repository: request.repoUrl,
                analysisMethod: 'ADK-TS Unified Intelligence Analysis',
                agentsDiscovered: 1,
                agentsUsed: 1,
                selectedAgents: ['NexusIntelligenceAgent'],
                synthesizedAnalysis: analysisResult,
                githubPayload: analysisResult.githubIssueData
            };

        } catch (error) {
            console.error('❌ Analysis failed:', error);
            return {
                success: false,
                repository: request.repoUrl,
                analysisMethod: 'ADK-TS Unified Intelligence Analysis',
                agentsDiscovered: 1,
                agentsUsed: 0,
                selectedAgents: [],
                synthesizedAnalysis: {} as SynthesizedAnalysis,
                githubPayload: {} as GitHubIssueData,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Perform unified analysis combining all specialized capabilities
     */
    private async performUnifiedAnalysis(
        repository: GitHubRepository,
        analysisType: string
    ): Promise<SynthesizedAnalysis> {
        console.log('🔬 Performing unified repository intelligence analysis...');

        const analysisPrompt = this.buildComprehensiveAnalysisPrompt(repository, analysisType);

        try {
            console.log('🤖 Calling Gemini API for analysis...');
            const analysisResponse = await this.agent.ask(analysisPrompt);
            console.log('✅ Gemini API response received');
            
            const parsedResult = this.parseAnalysisResponse(analysisResponse);
            console.log('✅ Analysis parsed successfully');

            return {
                repository: repository.url,
                analysisMethod: 'ADK-TS Unified Intelligence Analysis',
                agentsUsed: ['NexusIntelligenceAgent'],
                agentsDiscovered: 1,
                selectedFeature: parsedResult.selectedFeature,
                githubIssueData: this.createGitHubIssuePayload(parsedResult.selectedFeature)
            };

        } catch (error) {
            console.error('❌ Analysis failed:', error);
            // Don't return fallback - throw error so user knows API failed
            throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check API quota or try again later.`);
        }
    }

    /**
     * Build comprehensive analysis prompt that combines all analysis types
     */
    private buildComprehensiveAnalysisPrompt(repository: GitHubRepository, analysisType: string): string {
        const intensityLevel = this.getAnalysisIntensity(analysisType);

        return `You are Nexus, an expert repository intelligence agent. Perform a comprehensive analysis of this GitHub repository:

**Repository:** ${repository.url}
**Owner:** ${repository.owner}
**Name:** ${repository.repo}
**Description:** ${repository.description || 'No description available'}
**Primary Language:** ${repository.language || 'Unknown'}
**Topics:** ${repository.topics?.join(', ') || 'None'}

**ANALYSIS SCOPE:** ${analysisType.toUpperCase()} (${intensityLevel})

Perform these analyses in sequence:

## 1. CODE ANALYSIS
- Examine repository structure and architecture
- Assess code quality, patterns, and maintainability
- Identify technical debt and improvement opportunities
- Evaluate documentation completeness

## 2. SECURITY AUDIT
- Scan for common security vulnerabilities
- Check dependency security and outdated packages
- Assess authentication and authorization patterns
- Review data handling and privacy considerations

## 3. PERFORMANCE REVIEW
- Identify performance bottlenecks and optimization opportunities
- Analyze resource usage patterns
- Evaluate scalability considerations
- Review caching and optimization strategies

## 4. FEATURE ANALYSIS
- Suggest high-impact feature enhancements
- Identify user experience improvements
- Propose modern development practice adoptions
- Recommend integration opportunities

## 5. SYNTHESIS & RECOMMENDATION
Based on all analyses above, select the SINGLE BEST feature suggestion for implementation.

**OUTPUT FORMAT:**
Respond with a JSON object in this exact format:

{
  "codeAnalysis": {
    "summary": "Brief code analysis summary",
    "issues": ["issue1", "issue2"],
    "recommendations": ["rec1", "rec2"]
  },
  "securityAudit": {
    "summary": "Brief security assessment",
    "vulnerabilities": ["vuln1", "vuln2"],
    "recommendations": ["rec1", "rec2"]
  },
  "performanceReview": {
    "summary": "Brief performance assessment",
    "bottlenecks": ["bottleneck1", "bottleneck2"],
    "optimizations": ["opt1", "opt2"]
  },
  "featureAnalysis": {
    "summary": "Feature opportunity assessment",
    "opportunities": ["opp1", "opp2"]
  },
  "selectedFeature": {
    "title": "Feature Title",
    "description": "Detailed feature description",
    "difficulty": "Easy|Medium|Hard",
    "priority": "Low|Medium|High",
    "implementationTime": "X weeks/months",
    "technicalRequirements": ["req1", "req2", "req3"],
    "acceptanceCriteria": ["criteria1", "criteria2", "criteria3"],
    "businessValue": "Clear business value statement"
  }
}

**IMPORTANT:**
- Provide specific, actionable insights
- Focus on high-impact, implementable suggestions
- Consider the repository's context and technology stack
- Ensure the selected feature is realistic and valuable
- Return only valid JSON, no additional text`;
    }

    /**
     * Get analysis intensity based on type
     */
    private getAnalysisIntensity(analysisType: string): string {
        switch (analysisType) {
            case 'quick':
                return 'Fast overview focusing on immediate opportunities';
            case 'feature-focused':
                return 'Deep dive into feature enhancement opportunities';
            case 'full':
            default:
                return 'Comprehensive analysis across all dimensions';
        }
    }

    /**
     * Parse the analysis response from the agent
     */
    private parseAnalysisResponse(response: string): { selectedFeature: FeatureSuggestion } {
        try {
            // Clean the response to extract JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const parsedResponse = JSON.parse(jsonMatch[0]);

            if (!parsedResponse.selectedFeature) {
                throw new Error('No selectedFeature found in response');
            }

            return {
                selectedFeature: parsedResponse.selectedFeature as FeatureSuggestion
            };

        } catch (error) {
            console.warn('⚠️ Failed to parse analysis response:', error);
            throw error;
        }
    }

    /**
     * Parse GitHub repository URL
     */
    private parseRepositoryUrl(url: string): GitHubRepository {
        const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
        if (!match) {
            throw new Error('Invalid GitHub repository URL');
        }

        const [, owner, repo] = match;
        return {
            owner,
            repo: repo.replace(/\.git$/, ''),
            url,
            description: `Repository: ${owner}/${repo}`,
            language: 'Unknown',
            topics: []
        };
    }

    /**
     * Get repository metadata using GitHub API
     */
    private async getRepositoryMetadata(repository: GitHubRepository): Promise<GitHubRepository> {
        try {
            const githubToken = process.env.GITHUB_TOKEN;
            const headers: Record<string, string> = {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'ADK-TS-Nexus-Intelligence'
            };

            if (githubToken) {
                headers['Authorization'] = `token ${githubToken}`;
            }

            const response = await fetch(`https://api.github.com/repos/${repository.owner}/${repository.repo}`, {
                headers
            });

            if (!response.ok) {
                console.warn(`⚠️ GitHub API request failed: ${response.status}. Using basic info.`);
                return repository;
            }

            const repoData = await response.json();

            return {
                ...repository,
                description: repoData.description || `${repository.repo} repository`,
                language: repoData.language || 'Unknown',
                topics: repoData.topics || []
            };
        } catch (error) {
            console.warn('⚠️ Failed to fetch repository metadata:', error);
            return repository;
        }
    }

    /**
     * Create fallback feature when analysis fails
     */
    private createFallbackFeature(repository: GitHubRepository): FeatureSuggestion {
        return {
            title: `Enhanced ${repository.repo} Development Workflow`,
            description: `Implement comprehensive development workflow improvements for ${repository.repo} including automated testing, CI/CD pipeline enhancements, code quality monitoring, and developer experience optimizations.`,
            difficulty: 'Medium',
            priority: 'High',
            implementationTime: '2-3 weeks',
            technicalRequirements: [
                'Set up automated testing framework',
                'Configure CI/CD pipeline with GitHub Actions',
                'Implement code quality checks and linting',
                'Add comprehensive documentation',
                'Set up monitoring and error tracking'
            ],
            acceptanceCriteria: [
                'Automated tests run on every pull request',
                'CI/CD pipeline successfully deploys to staging/production',
                'Code quality metrics show measurable improvement',
                'Documentation is complete and up-to-date',
                'Development team reports improved workflow efficiency'
            ],
            businessValue: 'Improves development velocity, reduces bugs in production, enhances code maintainability, and provides better developer experience leading to increased team productivity.'
        };
    }

    /**
     * Create GitHub issue payload from feature suggestion
     */
    private createGitHubIssuePayload(feature: FeatureSuggestion): GitHubIssueData {
        const body = `## ${feature.title}

**Description:**
${feature.description}

**Business Value:**
${feature.businessValue}

**Implementation Details:**
- **Difficulty:** ${feature.difficulty}
- **Priority:** ${feature.priority}
- **Estimated Time:** ${feature.implementationTime}

**Technical Requirements:**
${feature.technicalRequirements.map(req => `- ${req}`).join('\n')}

**Acceptance Criteria:**
${feature.acceptanceCriteria.map(criteria => `- [ ] ${criteria}`).join('\n')}

---
*This issue was generated by Nexus Intelligence Agent - ADK-TS Unified Repository Analysis System*
*Ready for Agent Tokenization Platform (ATP) deployment*`;

        return {
            title: feature.title,
            body,
            labels: [
                'enhancement',
                'ai-generated',
                'nexus-intelligence',
                `difficulty-${feature.difficulty.toLowerCase()}`,
                `priority-${feature.priority.toLowerCase()}`
            ]
        };
    }
}
