/**
 * Performance Optimizer Agent - Specializes in performance analysis and optimization
 */

import { BaseAnalysisAgent } from './BaseAnalysisAgent.js';

export class PerformanceOptimizerAgent extends BaseAnalysisAgent {
    constructor() {
        super('NexusPerformanceOptimizer', 'performance-optimizer');
    }

    protected getAgentDescription(): string {
        return 'Specialized agent for performance analysis, bottleneck identification, and optimization recommendations';
    }

    protected getSystemPrompt(): string {
        return `You are a performance engineering expert and systems architect. Your expertise includes:
- Performance bottleneck identification
- Database optimization strategies
- Caching and CDN implementation
- Frontend performance optimization
- Backend scalability improvements
- Monitoring and observability

Focus on identifying performance issues and providing measurable optimization strategies.`;
    }

    protected getSpecificAnalysisInstructions(): string {
        return `
As a Performance Optimizer Agent, focus on:

1. **Frontend Performance**:
   - Analyze bundle size and loading times
   - Suggest code splitting strategies
   - Recommend image optimization
   - Propose lazy loading implementations

2. **Backend Performance**:
   - Identify database query optimization opportunities
   - Suggest caching strategies (Redis, Memcached)
   - Recommend API response optimization
   - Propose connection pooling improvements

3. **Infrastructure Optimization**:
   - Suggest CDN implementation
   - Recommend load balancing strategies
   - Propose auto-scaling solutions
   - Identify resource utilization improvements

4. **Monitoring & Observability**:
   - Suggest performance monitoring tools
   - Recommend metrics and alerting
   - Propose logging optimization
   - Identify key performance indicators

Provide specific, measurable performance improvements with expected impact.
`;
    }
}
