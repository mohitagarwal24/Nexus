/**
 * Type definitions for ADK-TS Nexus Repository Analyzer
 */

export interface RepositoryAnalysisRequest {
    repoUrl: string;
    analysisType?: 'full' | 'quick' | 'feature-focused';
    userGitHubToken?: string; // User's GitHub OAuth token for repository access
}

export interface AgentAnalysisResult {
    agentName: string;
    agentType: 'code-analyzer' | 'feature-suggester' | 'security-auditor' | 'performance-optimizer';
    analysis: string;
    features: FeatureSuggestion[];
    confidence: number;
}

export interface FeatureSuggestion {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    priority: 'Low' | 'Medium' | 'High';
    implementationTime: string;
    technicalRequirements: string[];
    acceptanceCriteria: string[];
    businessValue: string;
}

export interface SynthesizedAnalysis {
    repository: string;
    analysisMethod: string;
    agentsUsed: string[];
    agentsDiscovered: number;
    selectedFeature: FeatureSuggestion;
    githubIssueData: GitHubIssueData;
}

export interface GitHubIssueData {
    title: string;
    body: string;
    labels: string[];
    assignees?: string[];
}

export interface AnalysisResponse {
    success: boolean;
    repository: string;
    analysisMethod: string;
    agentsDiscovered: number;
    agentsUsed: number;
    selectedAgents: string[];
    synthesizedAnalysis: SynthesizedAnalysis;
    githubPayload: GitHubIssueData;
    error?: string;
}

export interface GitHubRepository {
    owner: string;
    repo: string;
    url: string;
    description?: string;
    language?: string;
    topics?: string[];
}
