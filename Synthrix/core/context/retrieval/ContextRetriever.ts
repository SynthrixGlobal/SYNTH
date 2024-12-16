import { Context } from '../types';
import { SemanticSearch } from './SemanticSearch';
import { RelevanceScorer } from './RelevanceScorer';

export class ContextRetriever {
  private semanticSearch: SemanticSearch;
  private relevanceScorer: RelevanceScorer;

  constructor() {
    this.semanticSearch = new SemanticSearch();
    this.relevanceScorer = new RelevanceScorer();
  }

  async retrieveRelevant(
    query: string,
    contexts: Context[],
    limit: number = 5
  ): Promise<Context[]> {
    const embeddings = await this.semanticSearch.embed(query);
    const scored = await Promise.all(
      contexts.map(async context => ({
        context,
        score: await this.relevanceScorer.score(context, embeddings)
      }))
    );

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.context);
  }
}