import { Token, AstNode } from './types';

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public parse(): AstNode {
    try {
      return this.program();
    } catch (error) {
      console.error('Parsing error:', error);
      throw error;
    }
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }

  private peek(): Token {
    if (this.isAtEnd()) {
      throw new Error('Unexpected end of input');
    }
    return this.tokens[this.current];
  }

  private previous(): Token {
    if (this.current <= 0) {
      throw new Error('No previous token');
    }
    return this.tokens[this.current - 1];
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private check(type: string): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private match(...types: string[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: string, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(`${message} at line ${this.peek().line}, column ${this.peek().column}`);
  }

  private synchronize(): void {
    this.advance();
    
    while (!this.isAtEnd()) {
      if (this.previous().type === ';') return;
      
      switch (this.peek().type) {
        case 'FUNCTION':
        case 'VAR':
        case 'FOR':
        case 'IF':
        case 'WHILE':
        case 'PRINT':
        case 'RETURN':
          return;
      }
      
      this.advance();
    }
  }

  // Grammar rules
  private program(): AstNode {
    const statements: AstNode[] = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return { type: 'Program', body: statements };
  }

  private declaration(): AstNode {
    try {
      if (this.match('VAR', 'LET')) return this.varDeclaration();
      if (this.match('FUNCTION')) return this.functionDeclaration();
      return this.statement();
    } catch (error) {
      this.synchronize();
      throw error;
    }
  }

  private varDeclaration(): AstNode {
    const name = this.consume('IDENTIFIER', 'Expect variable name').value;
    let initializer: AstNode | null = null;
    
    if (this.match('EQUALS')) {
      initializer = this.expression();
    }
    
    this.consume('SEMICOLON', 'Expect \';\' after variable declaration');
    
    const declaration: any = {
      type: 'VariableDeclarator',
      id: { type: 'Identifier', name },
    };
    
    if (initializer) {
      declaration.init = initializer;
    }
    
    return {
      type: 'VariableDeclaration',
      kind: 'let',
      declarations: [declaration]
    };
  }

  private functionDeclaration(): AstNode {
    const nameToken = this.consume('IDENTIFIER', 'Expect function name');
    this.consume('LEFT_PAREN', 'Expect \'(\' after function name');
    
    const params: { type: string; name: string }[] = [];
    if (!this.check('RIGHT_PAREN')) {
      do {
        if (params.length >= 255) {
          throw new Error('Cannot have more than 255 parameters');
        }
        const paramName = this.consume('IDENTIFIER', 'Expect parameter name').value;
        params.push({
          type: 'Identifier',
          name: paramName
        });
      } while (this.match('COMMA'));
    }
    
    this.consume('RIGHT_PAREN', 'Expect \')\' after parameters');
    
    // Parse function body
    this.consume('LEFT_BRACE', 'Expect \'{\' before function body');
    const body = [];
    while (!this.check('RIGHT_BRACE') && !this.isAtEnd()) {
      body.push(this.declaration());
    }
    this.consume('RIGHT_BRACE', 'Expect \'}\' after function body');
    
    return {
      type: 'FunctionDeclaration',
      id: {
        type: 'Identifier',
        name: nameToken.value
      },
      params,
      body: {
        type: 'BlockStatement',
        body: body
      },
      generator: false,
      expression: false,
      async: false
    };
  }

  private statement(): AstNode {
    if (this.match('IF')) return this.ifStatement();
    if (this.match('WHILE')) return this.whileStatement();
    if (this.match('FOR')) return this.forStatement();
    if (this.match('RETURN')) return this.returnStatement();
    if (this.match('PRINT')) return this.printStatement();
    if (this.match('LEFT_BRACE')) return { type: 'BlockStatement', body: this.block() };
    
    // Default to expression statement if no other statement type matches
    return this.expressionStatement();
  }

  private ifStatement(): AstNode {
    this.consume('LEFT_PAREN', 'Expect \'(\' after \'if\'');
    const test = this.expression();
    this.consume('RIGHT_PAREN', 'Expect \')\' after if condition');
    
    // Parse the consequent (must be a statement)
    const consequent = this.statement();
    
    // Parse the else clause if it exists
    let alternate: AstNode | null = null;
    if (this.match('ELSE')) {
      alternate = this.statement();
    }
    
    return {
      type: 'IfStatement',
      test,
      consequent: consequent.type === 'BlockStatement' 
        ? consequent 
        : { type: 'BlockStatement', body: [consequent] },
      alternate: alternate ? (alternate.type === 'BlockStatement' 
        ? alternate 
        : { type: 'BlockStatement', body: [alternate] }) : null
    };
  }

  private whileStatement(): AstNode {
    this.consume('LEFT_PAREN', 'Expect \'(\' after \'while\'');
    const test = this.expression();
    this.consume('RIGHT_PAREN', 'Expect \')\' after while condition');
    
    const body = this.statement();
    
    return {
      type: 'WhileStatement',
      test,
      body
    };
  }

  private forStatement(): AstNode {
    this.consume('LEFT_PAREN', 'Expect \'(\' after \'for\'');
    
    let init: AstNode | null = null;
    if (!this.match('SEMICOLON')) {
      if (this.match('VAR')) {
        init = this.varDeclaration();
      } else {
        init = this.expressionStatement();
      }
    }
    
    let test: AstNode | null = null;
    if (!this.check('SEMICOLON')) {
      test = this.expression();
    }
    this.consume('SEMICOLON', 'Expect \';\' after loop condition');
    
    let update: AstNode | null = null;
    if (!this.check('RIGHT_PAREN')) {
      update = this.expression();
    }
    this.consume('RIGHT_PAREN', 'Expect \')\' after for clauses');
    
    let body = this.statement();
    
    // Desugar for loop to while loop
    if (test === null) test = { type: 'Literal', value: true };
    
    if (update !== null) {
      body = {
        type: 'BlockStatement',
        body: [body, update]
      };
    }
    
    body = {
      type: 'WhileStatement',
      test,
      body
    };
    
    if (init !== null) {
      body = {
        type: 'BlockStatement',
        body: [init, body]
      };
    }
    
    return body;
  }

  private returnStatement(): AstNode {
    const keyword = this.previous();
    let value: AstNode | null = null;
    
    if (!this.check('SEMICOLON')) {
      value = this.expression();
    } else {
      // If there's no semicolon, consume the next token
      this.advance();
    }
    
    // Only consume semicolon if we haven't already advanced past it
    if (this.check('SEMICOLON')) {
      this.consume('SEMICOLON', 'Expect \';\' after return value');
    }
    
    return { 
      type: 'ReturnStatement', 
      argument: value // Change 'value' to 'argument' to match ESTree spec
    };
  }

  private printStatement(): AstNode {
    const value = this.expression();
    this.consume('SEMICOLON', 'Expect \';\' after value');
    return { type: 'PrintStatement', value };
  }

  private block(): AstNode[] {
    const statements: AstNode[] = [];
    
    while (!this.check('RIGHT_BRACE') && !this.isAtEnd()) {
      statements.push(this.declaration());
    }
    
    this.consume('RIGHT_BRACE', 'Expect \'}\' after block');
    return statements;
  }

  private expressionStatement(): AstNode {
    const expr = this.expression();
    this.consume('SEMICOLON', 'Expect \';\' after expression');
    return { type: 'ExpressionStatement', expression: expr };
  }

  private expression(): AstNode {
    return this.assignment();
  }

  private assignment(): AstNode {
    const expr = this.or();
    
    if (this.match('EQUAL')) {
      const value = this.assignment();
      
      if (expr.type === 'Variable') {
        return {
          type: 'Assignment',
          name: expr.name,
          value
        };
      }
      
      throw new Error('Invalid assignment target');
    }
    
    return expr;
  }

  private or(): AstNode {
    let expr = this.and();
    
    while (this.match('OR')) {
      const operator = this.previous();
      const right = this.and();
      expr = {
        type: 'LogicalExpression',
        operator: operator.type,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  private and(): AstNode {
    let expr = this.equality();
    
    while (this.match('AND')) {
      const operator = this.previous();
      const right = this.equality();
      expr = {
        type: 'LogicalExpression',
        operator: operator.type,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  private equality(): AstNode {
    return this.binaryHelper(
      () => this.comparison(),
      ['BANG_EQUAL', 'EQUAL_EQUAL', 'TRIPLE_EQUALS', 'NOT_EQUALS_STRICT']
    );
  }

  private comparison(): AstNode {
    return this.binaryHelper(
      () => this.term(),
      ['GREATER', 'GREATER_EQUAL', 'LESS', 'LESS_EQUAL']
    );
  }

  private term(): AstNode {
    return this.binaryHelper(
      () => this.factor(),
      ['MINUS', 'PLUS']
    );
  }

  private factor(): AstNode {
    return this.binaryHelper(
      () => this.unary(),
      ['SLASH', 'STAR']
    );
  }

  private unary(): AstNode {
    if (this.match('BANG', 'MINUS')) {
      const operator = this.previous();
      const right = this.unary();
      return {
        type: 'UnaryExpression',
        operator: operator.type,
        argument: right
      };
    }
    
    return this.call();
  }

  private call(): AstNode {
    let expr = this.primary();
    
    while (true) {
      if (this.match('LEFT_PAREN')) {
        expr = this.finishCall(expr);
      } else if (this.match('DOT')) {
        const name = this.consume('IDENTIFIER', 'Expect property name after \'.\'');
        expr = {
          type: 'MemberExpression',
          object: expr,
          property: {
            type: 'Identifier',
            name: name.value
          },
          computed: false
        };
      } else {
        break;
      }
    }
    
    return expr;
  }

  private finishCall(callee: AstNode): AstNode {
    const args: AstNode[] = [];
    
    if (!this.check('RIGHT_PAREN')) {
      do {
        if (args.length >= 255) {
          throw new Error('Cannot have more than 255 arguments');
        }
        args.push(this.expression());
      } while (this.match('COMMA'));
    }
    
    const paren = this.consume('RIGHT_PAREN', 'Expect \')\' after arguments');
    
    return {
      type: 'CallExpression',
      callee,
      arguments: args
    };
  }

  private primary(): AstNode {
    if (this.match('FALSE')) return { type: 'Literal', value: false };
    if (this.match('TRUE')) return { type: 'Literal', value: true };
    if (this.match('NIL')) return { type: 'Literal', value: null };
    
    if (this.match('NUMBER', 'STRING')) {
      return { type: 'Literal', value: this.previous().value };
    }
    
    if (this.match('IDENTIFIER')) {
      return { type: 'Variable', name: this.previous().value };
    }
    
    if (this.match('LEFT_PAREN')) {
      const expr = this.expression();
      this.consume('RIGHT_PAREN', 'Expect \')\' after expression');
      return { type: 'Grouping', expression: expr };
    }
    
    throw new Error(`Unexpected token: ${this.peek().value} at line ${this.peek().line}, column ${this.peek().column}`);
  }

  private binaryHelper(operand: () => AstNode, operators: string[]): AstNode {
    let expr = operand();
    
    while (this.match(...operators)) {
      const operator = this.previous();
      const right = operand();
      expr = {
        type: 'BinaryExpression',
        operator: operator.type,
        left: expr,
        right
      };
    }
    
    return expr;
  }
}
