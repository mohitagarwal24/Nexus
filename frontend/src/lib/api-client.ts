// API client for communicating with the backend
import { Session } from "next-auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface RepositoryAnalysisRequest {
    repoUrl: string;
    analysisType?: 'full' | 'quick' | 'feature-focused';
}

export interface RepositoryAnalysisResponse {
    success: boolean;
    agents_discovered: number;
    agents_used: number;
    analysis_method: string;
    repository: string;
    selected_agents: string[];
    github_payload: {
        title: string;
        body: string;
        labels: string[];
        assignees: string[];
    };
    synthesized_analysis: {
        title: string;
        description: string;
        difficulty: string;
        priority: string;
        implementation_time: string;
        technical_requirements: string[];
        acceptance_criteria: string[];
        business_value: string;
    };
    error?: string;
}

export interface CreateGitHubIssueRequest {
    owner: string;
    repo: string;
    issueData: {
        title: string;
        body: string;
        labels: string[];
        assignees?: string[];
    };
}

export class APIClient {
    constructor(private session: Session | null) { }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        // Always use a plain object for headers to avoid HeadersInit union issues
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        // Merge any custom headers provided
        if (options.headers) {
            Object.assign(headers, options.headers as Record<string, string>);
        }

        // Add user's GitHub OAuth token
        if (this.session?.accessToken) {
            headers["Authorization"] = `Bearer ${this.session.accessToken}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error ||
                errorData.message ||
                `API request failed: ${response.status} ${response.statusText}`
            );
        }

        return response.json();
    }


    /**
     * Analyze a repository using the backend AI agents
     */
    async analyzeRepository(request: RepositoryAnalysisRequest): Promise<RepositoryAnalysisResponse> {
        console.log('🔍 Analyzing repository:', request.repoUrl);
        console.log('🔐 Using user token:', !!this.session?.accessToken);

        return this.makeRequest<RepositoryAnalysisResponse>('/api/analyze-repo', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    /**
     * Create a GitHub issue using the backend
     */
    async createGitHubIssue(request: CreateGitHubIssueRequest): Promise<{ success: boolean; issue?: object; error?: string }> {
        console.log('📝 Creating GitHub issue:', request.owner + '/' + request.repo);
        console.log('🔐 Using user token:', !!this.session?.accessToken);

        return this.makeRequest('/api/create-github-issue', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    /**
     * Get available analysis types
     */
    async getAnalysisTypes(): Promise<string[]> {
        return this.makeRequest<string[]>('/api/analysis-types');
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<{ status: string; service: string; analyzer_ready: boolean }> {
        return this.makeRequest('/health');
    }
}

/**
 * Create an API client instance with the current session
 */
export function createAPIClient(session: Session | null): APIClient {
    return new APIClient(session);
}

/**
 * Hook-like function to get API client (for use in components)
 */
export function useAPIClient(session: Session | null): APIClient {
    return new APIClient(session);
}
