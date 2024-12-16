export type TokenId = number;
export type TokenSequence = TokenId[];

export interface Tokenizer {
  encode(text: string): TokenSequence;
  decode(tokens: TokenSequence): string;
}

export interface TokenEmbedding {
  dimensions: number;
  vocabulary: Map<string, TokenId>;
  embeddings: Float32Array[];
}