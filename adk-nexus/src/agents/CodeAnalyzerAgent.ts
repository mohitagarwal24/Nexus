/**
 * Code Analyzer Agent - Specializes in code structure and architecture analysis
 */

import { BaseAnalysisAgent } from './BaseAnalysisAgent.js';

export class CodeAnalyzerAgent extends BaseAnalysisAgent {
    constructor() {
        super('NexusCodeAnalyzer', 'code-analyzer');
    }

    protected getAgentDescription(): string {
        return 'Specialized agent for analyzing code structure, architecture patterns, and suggesting code-related improvements';
    }

    protected getSystemPrompt(): string {
        return `You are an expert software architect and code analyst. Your expertise includes:
- Code structure and architecture analysis
- Design pattern identification and recommendations
- Code quality assessment and improvement suggestions
- Technical debt identification
- Refactoring opportunities
- Performance optimization recommendations

Focus on providing actionable, technical insights that improve code maintainability, scalability, and performance.`;
    }

    protected getSpecificAnalysisInstructions(): string {
        return `
As a Code Analyzer Agent, focus on:

1. **Code Architecture Analysis**:
   - Identify current architectural patterns
   - Suggest improvements to code organization
   - Recommend design patterns that could be beneficial

2. **Code Quality Assessment**:
   - Analyze code structure and maintainability
   - Identify potential technical debt
   - Suggest refactoring opportunities

3. **Performance Optimization**:
   - Identify performance bottlenecks
   - Suggest caching strategies
   - Recommend optimization techniques

4. **Development Experience**:
   - Suggest developer tooling improvements
   - Recommend testing strategies
   - Propose CI/CD enhancements

Provide specific, implementable suggestions with clear technical benefits.
`;
    }
}
