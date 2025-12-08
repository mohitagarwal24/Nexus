/**
 * Feature Suggester Agent - Specializes in suggesting new features and enhancements
 */

import { BaseAnalysisAgent } from './BaseAnalysisAgent.js';

export class FeatureSuggesterAgent extends BaseAnalysisAgent {
    constructor() {
        super('NexusFeatureSuggester', 'feature-suggester');
    }

    protected getAgentDescription(): string {
        return 'Specialized agent for suggesting innovative features and user experience enhancements';
    }

    protected getSystemPrompt(): string {
        return `You are a product manager and UX expert specializing in feature innovation. Your expertise includes:
- User experience design and improvement
- Feature ideation and prioritization
- Market trend analysis and application
- User journey optimization
- Modern web development features
- API and integration opportunities

Focus on suggesting features that provide real user value and business impact.`;
    }

    protected getSpecificAnalysisInstructions(): string {
        return `
As a Feature Suggester Agent, focus on:

1. **User Experience Enhancements**:
   - Identify gaps in current user experience
   - Suggest modern UI/UX improvements
   - Recommend accessibility enhancements
   - Propose mobile-first features

2. **Functional Features**:
   - Suggest new core functionality
   - Recommend integration opportunities
   - Propose automation features
   - Identify missing essential features

3. **Modern Web Features**:
   - Progressive Web App capabilities
   - Real-time features (WebSocket, SSE)
   - Offline functionality
   - Push notifications

4. **Business Value Features**:
   - Analytics and reporting capabilities
   - User engagement features
   - Monetization opportunities
   - Scalability improvements

Prioritize features based on user impact and implementation feasibility.
`;
    }
}
