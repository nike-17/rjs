export interface Token {
  type: string;
  value: string;
  line: number;
  column: number;
}

export interface AstNode {
  type: string;
  [key: string]: any;
}

export type TokenMatcher = [RegExp, string | null];
