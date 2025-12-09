/**
 * Nexus Repository Analyzer - Unified single-agent repository analysis
 * ADK-TS implementation optimized for ATP deployment
 * Replaces multi-agent approach with consolidated intelligence agent
 */

import { NexusIntelligenceAgent } from './NexusIntelligenceAgent.js';
import type {
    RepositoryAnalysisRequest,
    AnalysisResponse
} from './types.js';

export class NexusRepositoryAnalyzer {
    private intelligenceAgent: NexusIntelligenceAgent;
    private initialized: boolean = false;

    constructor() {
        this.intelligenceAgent = new NexusIntelligenceAgent();
    }

    /**
     * Initialize the unified intelligence agent
     */
    async initialize(): Promise<void> {
        console.log('🔧 Initializing Nexus Repository Analyzer...');

        try {
            // Initialize the single consolidated agent
            await this.intelligenceAgent.initialize();
            this.initialized = true;

            console.log('✅ Nexus Repository Analyzer initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Nexus Repository Analyzer:', error);
            throw error;
        }
    }

    /**
     * Analyze a repository using unified intelligence approach
     */
    async analyzeRepository(request: RepositoryAnalysisRequest): Promise<AnalysisResponse> {
        if (!this.initialized) {
            throw new Error('Analyzer not initialized. Call initialize() first.');
        }

        console.log(`🧠 Analyzing repository with unified intelligence: ${request.repoUrl}`);
        console.log('⏳ This may take a moment...');

        try {
            // Delegate to the unified intelligence agent
            return await this.intelligenceAgent.analyzeRepository(request);

        } catch (error) {
            console.error('❌ Analysis failed:', error);
            throw error;
        }
    }

}
