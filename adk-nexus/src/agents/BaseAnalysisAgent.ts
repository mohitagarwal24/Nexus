/**
 * Base Analysis Agent for ADK-TS Nexus System
 * Provides common functionality for all repository analysis agents
 */

import { AgentBuilder } from '@iqai/adk';
import type { AgentAnalysisResult, FeatureSuggestion, GitHubRepository } from '../types.js';

export abstract class BaseAnalysisAgent {
    public agentName: string;
    protected agentType: 'code-analyzer' | 'feature-suggester' | 'security-auditor' | 'performance-optimizer';
    protected runner: any;

    constructor(agentName: string, agentType: BaseAnalysisAgent['agentType']) {
        this.agentName = agentName;
        this.agentType = agentType;
    }

    /**
     * Initialize the agent with ADK-TS AgentBuilder
     */
    async initialize(): Promise<void> {
        const { runner } = await AgentBuilder.create(this.agentName)
            .withModel('gemini-2.5-flash-lite')
            .withDescription(this.getAgentDescription())
            .build();

        this.runner = runner;
        console.log(`✅ ${this.agentName} initialized successfully`);
    }

    /**
     * Analyze a repository and return structured results
     */
    async analyzeRepository(repository: GitHubRepository): Promise<AgentAnalysisResult> {
        if (!this.runner) {
            throw new Error(`Agent ${this.agentName} not initialized`);
        }

        const analysisPrompt = this.buildAnalysisPrompt(repository);

        try {
            const response = await this.runner.ask(analysisPrompt);
            const features = this.extractFeatures(response, repository);

            return {
                agentName: this.agentName,
                agentType: this.agentType,
                analysis: response,
                features,
                confidence: this.calculateConfidence(response, features)
            };
        } catch (error) {
            console.error(`❌ Error in ${this.agentName} analysis:`, error);
            throw error;
        }
    }

    /**
     * Build analysis prompt for the specific agent type
     */
    protected buildAnalysisPrompt(repository: GitHubRepository): string {
        return `
Analyze the GitHub repository: ${repository.url}

Repository Details:
- Owner: ${repository.owner}
- Name: ${repository.repo}
- Description: ${repository.description || 'No description available'}
- Primary Language: ${repository.language || 'Unknown'}
- Topics: ${repository.topics?.join(', ') || 'None'}

${this.getSpecificAnalysisInstructions()}

Please provide:
1. A comprehensive analysis of the repository
2. 3-5 specific feature suggestions with implementation details
3. Assessment of each feature's difficulty and priority
4. Technical requirements and acceptance criteria

Format your response with clear sections and structured information.
`;
    }

    /**
     * Extract feature suggestions from agent response
     */
    protected extractFeatures(response: string, repository: GitHubRepository): FeatureSuggestion[] {
        const features: FeatureSuggestion[] = [];

        console.log(`🔍 Extracting features from ${this.agentName} response (${response.length} chars)`);

        // Multiple patterns to catch different response formats
        const patterns = [
            /(?:Feature|Suggestion)\s*\d*[:.]\s*\*\*([^*]+)\*\*/gi,
            /(?:###|##)\s*([^\n]+)/gi,
            /\d+\.\s*\*\*([^*]+)\*\*/gi,
            /(?:Feature|Enhancement|Improvement)[:\s]*([^\n]+)/gi
        ];

        let allMatches: string[] = [];

        // Try each pattern
        for (const pattern of patterns) {
            const matches = response.match(pattern);
            if (matches && matches.length > 0) {
                allMatches = matches;
                console.log(`✅ Found ${matches.length} features using pattern`);
                break;
            }
        }

        // If still no matches, try to extract from sections
        if (allMatches.length === 0) {
            console.log('🔍 Trying section-based extraction...');
            allMatches = this.extractFromSections(response);
        }

        // Process matches
        allMatches.forEach((match, index) => {
            const title = this.cleanTitle(match);
            if (title && title.length > 5) { // Only valid titles
                const featureSection = this.extractFeatureSection(response, title, index);

                features.push({
                    title,
                    description: this.extractDescription(featureSection, response),
                    difficulty: this.extractDifficulty(featureSection),
                    priority: this.extractPriority(featureSection),
                    implementationTime: this.extractImplementationTime(featureSection),
                    technicalRequirements: this.extractTechnicalRequirements(featureSection),
                    acceptanceCriteria: this.extractAcceptanceCriteria(featureSection),
                    businessValue: this.extractBusinessValue(featureSection)
                });
            }
        });

        // If still no features, try to create from response content
        if (features.length === 0) {
            console.log('⚠️ No structured features found, creating from response content');
            features.push(this.createFeatureFromResponse(response, repository));
        }

        console.log(`📊 Extracted ${features.length} features from ${this.agentName}`);
        return features.slice(0, 5); // Limit to 5 features
    }

    /**
     * Extract feature section from response
     */
    private extractFeatureSection(response: string, title: string, index: number): string {
        const lines = response.split('\n');
        let startIndex = -1;
        let endIndex = lines.length;

        // Find start of this feature section
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes(title.toLowerCase())) {
                startIndex = i;
                break;
            }
        }

        // Find end of this feature section (next feature or end)
        if (startIndex !== -1) {
            for (let i = startIndex + 1; i < lines.length; i++) {
                if (lines[i].match(/(?:Feature|Suggestion)\s*\d*[:.]/i)) {
                    endIndex = i;
                    break;
                }
            }
        }

        return startIndex !== -1 ? lines.slice(startIndex, endIndex).join('\n') : '';
    }

    /**
     * Extract from sections when patterns fail
     */
    private extractFromSections(response: string): string[] {
        const lines = response.split('\n');
        const features: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.match(/^\d+\.|^-|^\*/) && line.length > 10) {
                features.push(line);
            }
        }

        return features.slice(0, 5);
    }

    /**
     * Clean and extract title from match
     */
    private cleanTitle(match: string): string {
        return match
            .replace(/(?:Feature|Suggestion|Enhancement|Improvement)\s*\d*[:.]\s*/gi, '')
            .replace(/\*\*/g, '')
            .replace(/#{1,6}\s*/, '')
            .replace(/^\d+\.\s*/, '')
            .replace(/^[-*]\s*/, '')
            .trim();
    }

    /**
     * Create feature from response content when extraction fails
     */
    private createFeatureFromResponse(response: string, repository: GitHubRepository): FeatureSuggestion {
        // Extract first meaningful sentence as title
        const sentences = response.split(/[.!?]/).filter(s => s.trim().length > 20);
        const title = sentences[0]?.trim().substring(0, 80) || `${this.agentType} Enhancement for ${repository.repo}`;

        // Use first paragraph as description
        const paragraphs = response.split('\n\n').filter(p => p.trim().length > 50);
        const description = paragraphs[0]?.trim().substring(0, 300) || `Enhance ${repository.repo} with ${this.agentType} improvements`;

        return {
            title,
            description,
            difficulty: 'Medium',
            priority: 'Medium',
            implementationTime: '2-3 weeks',
            technicalRequirements: ['Analyze current implementation', 'Design improvements', 'Implement changes'],
            acceptanceCriteria: ['Feature implemented', 'Tests pass', 'Documentation updated'],
            businessValue: `Improves ${repository.repo} functionality and user experience`
        };
    }

    /**
     * Extract specific information from feature section
     */
    private extractDescription(section: string, fullResponse?: string): string {
        const descMatch = section.match(/(?:Description|Summary)[:\-]\s*([^\n]+)/i);
        return descMatch ? descMatch[1].trim() : 'Feature enhancement for improved functionality';
    }

    private extractDifficulty(section: string): 'Easy' | 'Medium' | 'Hard' {
        const diffMatch = section.match(/(?:Difficulty|Complexity)[:\-]\s*(Easy|Medium|Hard)/i);
        return (diffMatch ? diffMatch[1] : 'Medium') as 'Easy' | 'Medium' | 'Hard';
    }

    private extractPriority(section: string): 'Low' | 'Medium' | 'High' {
        const priorityMatch = section.match(/(?:Priority)[:\-]\s*(Low|Medium|High)/i);
        return (priorityMatch ? priorityMatch[1] : 'Medium') as 'Low' | 'Medium' | 'High';
    }

    private extractImplementationTime(section: string): string {
        const timeMatch = section.match(/(?:Implementation Time|Duration|Estimate)[:\-]\s*([^\n]+)/i);
        return timeMatch ? timeMatch[1].trim() : '2-3 weeks';
    }

    private extractTechnicalRequirements(section: string): string[] {
        const reqSection = section.match(/(?:Technical Requirements|Requirements)[:\-](.*?)(?=\n\n|\n[A-Z]|$)/is);
        if (reqSection) {
            return reqSection[1].split('\n')
                .map(line => line.replace(/^[\s\-\*]+/, '').trim())
                .filter(line => line.length > 0)
                .slice(0, 4);
        }
        return ['Research implementation approach', 'Design system architecture', 'Implement core functionality', 'Add comprehensive testing'];
    }

    private extractAcceptanceCriteria(section: string): string[] {
        const criteriaSection = section.match(/(?:Acceptance Criteria|Criteria)[:\-](.*?)(?=\n\n|\n[A-Z]|$)/is);
        if (criteriaSection) {
            return criteriaSection[1].split('\n')
                .map(line => line.replace(/^[\s\-\*\[\]]+/, '').trim())
                .filter(line => line.length > 0)
                .slice(0, 4);
        }
        return ['Feature is fully implemented', 'All functionality works as expected', 'Tests pass with >90% coverage', 'Documentation is complete'];
    }

    private extractBusinessValue(section: string): string {
        const valueMatch = section.match(/(?:Business Value|Value|Impact)[:\-]\s*([^\n]+)/i);
        return valueMatch ? valueMatch[1].trim() : 'Improves user experience and system functionality';
    }

    /**
     * Create a default feature when extraction fails
     */
    private createDefaultFeature(repoName: string): FeatureSuggestion {
        return {
            title: `Enhanced ${this.agentType.replace(/-/g, ' ')} for ${repoName}`,
            description: `Implement advanced ${this.agentType.replace(/-/g, ' ')} capabilities to improve the repository`,
            difficulty: 'Medium',
            priority: 'Medium',
            implementationTime: '2-3 weeks',
            technicalRequirements: [
                'Research current implementation',
                'Design enhancement architecture',
                'Implement new features',
                'Add comprehensive testing'
            ],
            acceptanceCriteria: [
                'Enhancement is fully implemented',
                'All new functionality works correctly',
                'Tests pass with high coverage',
                'Documentation is updated'
            ],
            businessValue: 'Improves overall system quality and user experience'
        };
    }

    /**
     * Calculate confidence score based on response quality
     */
    protected calculateConfidence(response: string, features: FeatureSuggestion[]): number {
        let confidence = 0.5; // Base confidence

        // Increase confidence based on response length and structure
        if (response.length > 500) confidence += 0.1;
        if (response.includes('**')) confidence += 0.1; // Has formatting
        if (features.length >= 3) confidence += 0.2;
        if (features.some(f => f.technicalRequirements.length > 2)) confidence += 0.1;

        return Math.min(confidence, 1.0);
    }

    // Abstract methods to be implemented by specific agents
    protected abstract getAgentDescription(): string;
    protected abstract getSystemPrompt(): string;
    protected abstract getSpecificAnalysisInstructions(): string;
}
