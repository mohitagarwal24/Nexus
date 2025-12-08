/**
 * Nexus Repository Analyzer - Main orchestrator for multi-agent repository analysis
 * ADK-TS implementation replacing Fetch AI and ASI functionality
 */

import { AgentBuilder } from '@iqai/adk';
import { CodeAnalyzerAgent } from './agents/CodeAnalyzerAgent.js';
import { FeatureSuggesterAgent } from './agents/FeatureSuggesterAgent.js';
import { SecurityAuditorAgent } from './agents/SecurityAuditorAgent.js';
import { PerformanceOptimizerAgent } from './agents/PerformanceOptimizerAgent.js';
import type {
    RepositoryAnalysisRequest,
    AgentAnalysisResult,
    SynthesizedAnalysis,
    AnalysisResponse,
    GitHubRepository,
    FeatureSuggestion,
    GitHubIssueData
} from './types.js';

export class NexusRepositoryAnalyzer {
    private agents: Array<CodeAnalyzerAgent | FeatureSuggesterAgent | SecurityAuditorAgent | PerformanceOptimizerAgent>;
    private synthesisAgent: any;
    private initialized: boolean = false;

    constructor() {
        this.agents = [
            new CodeAnalyzerAgent(),
            new FeatureSuggesterAgent(),
            new SecurityAuditorAgent(),
            new PerformanceOptimizerAgent()
        ];
    }

    /**
     * Initialize all agents and the synthesis agent
     */
    async initialize(): Promise<void> {
        console.log('🔧 Initializing Nexus Repository Analyzer...');

        try {
            // Initialize all analysis agents
            await Promise.all(this.agents.map(agent => agent.initialize()));

            // Initialize synthesis agent for combining results
            const { runner } = await AgentBuilder.create('NexusSynthesisAgent')
                .withModel('gemini-2.5-flash-lite')
                .withDescription('Synthesizes multiple agent analyses into comprehensive feature recommendations')
                .build();

            this.synthesisAgent = runner;
            this.initialized = true;

            console.log('✅ Nexus Repository Analyzer initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Nexus Repository Analyzer:', error);
            throw error;
        }
    }

    /**
     * Analyze a repository using multi-agent approach
     */
    async analyzeRepository(request: RepositoryAnalysisRequest): Promise<AnalysisResponse> {
        if (!this.initialized) {
            throw new Error('Analyzer not initialized. Call initialize() first.');
        }

        console.log(`📊 Analyzing repository: ${request.repoUrl}`);
        console.log('⏳ This may take a moment...');

        try {
            // Parse repository information
            const repository = this.parseRepositoryUrl(request.repoUrl);

            // Get repository metadata (simulated - in real implementation, use GitHub API)
            const repoMetadata = await this.getRepositoryMetadata(repository);

            // Run analysis with selected agents based on analysis type
            const selectedAgents = this.selectAgents(request.analysisType || 'full');
            const agentResults = await this.runMultiAgentAnalysis(repoMetadata, selectedAgents);

            // Synthesize results using synthesis agent
            const synthesizedAnalysis = await this.synthesizeResults(agentResults, repoMetadata);

            // Create GitHub issue data
            const githubPayload = this.createGitHubIssuePayload(synthesizedAnalysis.selectedFeature);

            console.log('🎉 Analysis complete!');

            return {
                success: true,
                repository: request.repoUrl,
                analysisMethod: 'ADK-TS Multi-Agent Analysis',
                agentsDiscovered: this.agents.length,
                agentsUsed: selectedAgents.length,
                selectedAgents: selectedAgents.map(agent => agent.agentName),
                synthesizedAnalysis,
                githubPayload
            };

        } catch (error) {
            console.error('❌ Analysis failed:', error);
            return {
                success: false,
                repository: request.repoUrl,
                analysisMethod: 'ADK-TS Multi-Agent Analysis',
                agentsDiscovered: this.agents.length,
                agentsUsed: 0,
                selectedAgents: [],
                synthesizedAnalysis: {} as SynthesizedAnalysis,
                githubPayload: {} as GitHubIssueData,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
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
            repo: repo.replace(/\.git$/, ''), // Remove .git suffix if present
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
                'User-Agent': 'ADK-TS-Nexus-Analyzer'
            };

            if (githubToken) {
                headers['Authorization'] = `token ${githubToken}`;
            }

            const response = await fetch(`https://api.github.com/repos/${repository.owner}/${repository.repo}`, {
                headers
            });

            if (!response.ok) {
                console.warn(`⚠️ GitHub API request failed: ${response.status}. Using basic info.`);
                return {
                    ...repository,
                    description: `${repository.repo} repository`,
                    language: 'Unknown',
                    topics: []
                };
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
            return {
                ...repository,
                description: `${repository.repo} repository`,
                language: 'Unknown',
                topics: []
            };
        }
    }

    /**
     * Select agents based on analysis type
     */
    private selectAgents(analysisType: string): Array<CodeAnalyzerAgent | FeatureSuggesterAgent | SecurityAuditorAgent | PerformanceOptimizerAgent> {
        switch (analysisType) {
            case 'quick':
                return [this.agents[1]]; // Feature Suggester only
            case 'feature-focused':
                return [this.agents[1], this.agents[0]]; // Feature Suggester + Code Analyzer
            case 'full':
            default:
                return this.agents.slice(0, 3); // All except Performance Optimizer for faster analysis
        }
    }

    /**
     * Run multi-agent analysis
     */
    private async runMultiAgentAnalysis(
        repository: GitHubRepository,
        selectedAgents: Array<CodeAnalyzerAgent | FeatureSuggesterAgent | SecurityAuditorAgent | PerformanceOptimizerAgent>
    ): Promise<AgentAnalysisResult[]> {
        console.log(`🚀 Querying ${selectedAgents.length} selected agents...`);

        const results = await Promise.allSettled(
            selectedAgents.map(async (agent) => {
                console.log(`📤 Querying ${agent.agentName}...`);
                const result = await agent.analyzeRepository(repository);
                console.log(`📥 Received response from ${agent.agentName}`);
                return result;
            })
        );

        // Filter successful results
        const successfulResults = results
            .filter((result): result is PromiseFulfilledResult<AgentAnalysisResult> => result.status === 'fulfilled')
            .map(result => result.value);

        if (successfulResults.length === 0) {
            throw new Error('All agent analyses failed');
        }

        return successfulResults;
    }

    /**
     * Synthesize results from multiple agents
     */
    private async synthesizeResults(
        agentResults: AgentAnalysisResult[],
        repository: GitHubRepository
    ): Promise<SynthesizedAnalysis> {
        console.log('🔄 Synthesizing agent responses with ADK-TS...');

        // Combine all features from all agents
        const allFeatures: FeatureSuggestion[] = [];
        agentResults.forEach(result => {
            allFeatures.push(...result.features);
        });

        // Create synthesis prompt
        const synthesisPrompt = this.createSynthesisPrompt(agentResults, repository);

        try {
            // Use synthesis agent to select best feature
            const synthesisResponse = await this.synthesisAgent.ask(synthesisPrompt);
            const selectedFeature = this.extractBestFeature(synthesisResponse, allFeatures);

            return {
                repository: repository.url,
                analysisMethod: 'ADK-TS Multi-Agent Analysis',
                agentsUsed: agentResults.map(r => r.agentName),
                agentsDiscovered: this.agents.length,
                selectedFeature,
                githubIssueData: this.createGitHubIssuePayload(selectedFeature)
            };

        } catch (error) {
            console.warn('⚠️ Synthesis failed, using fallback selection');
            // Fallback: select highest confidence feature
            const bestFeature = this.selectBestFeatureByConfidence(allFeatures);

            return {
                repository: repository.url,
                analysisMethod: 'ADK-TS Multi-Agent Analysis (Fallback)',
                agentsUsed: agentResults.map(r => r.agentName),
                agentsDiscovered: this.agents.length,
                selectedFeature: bestFeature,
                githubIssueData: this.createGitHubIssuePayload(bestFeature)
            };
        }
    }

    /**
     * Create synthesis prompt for the synthesis agent
     */
    private createSynthesisPrompt(agentResults: AgentAnalysisResult[], repository: GitHubRepository): string {
        const agentAnalyses = agentResults.map((result, index) =>
            `Agent ${index + 1} (${result.agentName}):\n${result.analysis}\n\nFeatures suggested:\n${result.features.map(f => `- ${f.title}: ${f.description}`).join('\n')}\n`
        ).join('\n---\n\n');

        return `
I received multiple AI agent analyses for the repository: ${repository.url}

Agent Analyses:
${agentAnalyses}

TASK: Analyze these responses and select the BEST feature suggestion for implementation.

Consider:
1. Business impact and user value
2. Implementation feasibility 
3. Technical requirements
4. Priority level

Respond with the title of the best feature suggestion from the analyses above.
Just return the feature title, nothing else.
`;
    }

    /**
     * Extract best feature from synthesis response
     */
    private extractBestFeature(synthesisResponse: string, allFeatures: FeatureSuggestion[]): FeatureSuggestion {
        console.log(`🔍 Synthesis response: "${synthesisResponse.trim()}"`);
        console.log(`📊 Available features: ${allFeatures.map(f => f.title).join(', ')}`);

        const responseTitle = synthesisResponse.trim().toLowerCase();

        // Try exact match first
        let matchedFeature = allFeatures.find(feature =>
            feature.title.toLowerCase() === responseTitle
        );

        // Try partial match
        if (!matchedFeature) {
            matchedFeature = allFeatures.find(feature =>
                feature.title.toLowerCase().includes(responseTitle) ||
                responseTitle.includes(feature.title.toLowerCase())
            );
        }

        // Try word matching
        if (!matchedFeature && responseTitle.length > 5) {
            const responseWords = responseTitle.split(/\s+/);
            matchedFeature = allFeatures.find(feature => {
                const titleWords = feature.title.toLowerCase().split(/\s+/);
                return responseWords.some(word =>
                    word.length > 3 && titleWords.some(titleWord => titleWord.includes(word))
                );
            });
        }

        const selected = matchedFeature || allFeatures[0];
        console.log(`✅ Selected feature: "${selected.title}"`);

        return selected;
    }

    /**
     * Select best feature by confidence score (fallback)
     */
    private selectBestFeatureByConfidence(features: FeatureSuggestion[]): FeatureSuggestion {
        if (features.length === 0) {
            throw new Error('No features available for selection');
        }

        // Prioritize by difficulty and priority
        const scoredFeatures = features.map(feature => ({
            feature,
            score: this.calculateFeatureScore(feature)
        }));

        scoredFeatures.sort((a, b) => b.score - a.score);
        return scoredFeatures[0].feature;
    }

    /**
     * Calculate feature score for ranking
     */
    private calculateFeatureScore(feature: FeatureSuggestion): number {
        let score = 0;

        // Priority scoring
        if (feature.priority === 'High') score += 3;
        else if (feature.priority === 'Medium') score += 2;
        else score += 1;

        // Difficulty scoring (easier = higher score for quick wins)
        if (feature.difficulty === 'Easy') score += 3;
        else if (feature.difficulty === 'Medium') score += 2;
        else score += 1;

        // Length and detail scoring
        if (feature.description.length > 100) score += 1;
        if (feature.technicalRequirements.length > 2) score += 1;
        if (feature.acceptanceCriteria.length > 2) score += 1;

        return score;
    }

    /**
     * Create default feature when all else fails
     */
    private createDefaultFeature(): FeatureSuggestion {
        return {
            title: 'AI-Generated Repository Enhancement Suggestion',
            description: 'Implement comprehensive improvements to enhance repository functionality, user experience, and maintainability based on modern development practices.',
            difficulty: 'Medium',
            priority: 'High',
            implementationTime: '2-3 weeks',
            technicalRequirements: [
                'Analyze current codebase structure',
                'Research modern development practices',
                'Design enhancement architecture',
                'Implement incremental improvements'
            ],
            acceptanceCriteria: [
                'Enhancement is fully implemented and tested',
                'Code quality metrics show improvement',
                'User experience is measurably better',
                'Documentation is updated and complete'
            ],
            businessValue: 'Improves overall system quality, user satisfaction, and development velocity'
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
*This issue was generated by Nexus ADK-TS Multi-Agent Repository Analysis System*`;

        return {
            title: feature.title,
            body,
            labels: [
                'enhancement',
                'ai-generated',
                `difficulty-${feature.difficulty.toLowerCase()}`,
                `priority-${feature.priority.toLowerCase()}`
            ]
        };
    }
}
