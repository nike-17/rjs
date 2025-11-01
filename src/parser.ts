import { Token, AstNode } from './types';

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }
  
  private synchronize(): void {
    this.advance();
    
    while (!this.isAtEnd()) {
      if (this.previous().type === ';') return;
      
      switch (this.peek().type) {
        case 'KEYWORD':
          if (['function', 'let', 'const', 'if', 'while', 'for', 'return'].includes(this.peek().value)) {
            return;
          }
          break;
      }
      
      this.advance();
    }
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
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

  private match(type: string, ...values: string[]): boolean {
    if (this.isAtEnd()) return false;
    
    const token = this.peek();
    
    // If no values provided, just check the type
    if (values.length === 0) {
      if (token.type === type) {
        this.advance();
        return true;
      }
      return false;
    }
    
    // Check if the current token matches the type and one of the values
    if (token.type === type) {
      const currentValue = token.value;
      for (const value of values) {
        if (currentValue === value) {
          this.advance();
          return true;
        }
      }
    }
    
    return false;
  }

  private consume(type: string, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(`${message} at line ${this.peek().line}, column ${this.peek().column}`);
  }

  public parse(): AstNode[] {
    const statements: AstNode[] = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return statements;
  }

  private declaration(): AstNode {
    try {
      // Check for Russian or English variable declarations
      if (this.match('KEYWORD', 'let', 'const', 'var', 'переменная', 'константа')) {
        return this.variableDeclaration();
      }
      // Check for Russian or English function declarations
      if (this.match('KEYWORD', 'function', 'функция')) {
        return this.functionDeclaration();
      }
      // For other cases, try to parse as a statement
      return this.statement();
    } catch (error) {
      this.synchronize();
      throw error;
    }
  }

  private variableDeclaration(): AstNode {
    const token = this.previous();
    const isConst = token.value === 'const' || token.value === 'константа';
    const isLet = token.value === 'let' || token.value === 'переменная';
    
    if (!isConst && !isLet) {
      throw new Error('Expected variable or constant declaration');
    }
    
    const declarations = [];
    
    do {
      // Handle the case where the next token is an identifier
      if (this.check('IDENTIFIER')) {
        const name = this.advance().value;
        let initializer: AstNode | null = null;

        if (this.match('=')) {
          initializer = this.expression();
        }
        
        declarations.push({
          type: 'VariableDeclarator',
          id: { type: 'Identifier', name },
          init: initializer
        });
      } else {
        // If it's not an identifier, try to parse it as an expression
        const expr = this.expression();
        if (expr.type === 'Identifier') {
          declarations.push({
            type: 'VariableDeclarator',
            id: expr,
            init: null
          });
        } else {
          throw new Error(`Expected variable name but got ${expr.type}`);
        }
      }
    } while (this.match(','));
    
    // Only consume semicolon if it's there, but don't require it for the last statement
    if (!this.check('}') && !this.isAtEnd()) {
      this.consume(';', 'Expected \';\' after variable declaration');
    }
    
    return {
      type: 'VariableDeclaration',
      kind: isConst ? 'const' : 'let',
      declarations
    };
  }

  private functionDeclaration(): AstNode {
    const name = this.consume('IDENTIFIER', 'Expected function name').value;
    this.consume('(', 'Expected \'(\' after function name');
    
    const params: AstNode[] = [];
    if (!this.check(')')) {
      do {
        if (params.length >= 255) {
          throw new Error('Cannot have more than 255 parameters');
        }
        params.push({
          type: 'Identifier',
          name: this.consume('IDENTIFIER', 'Expected parameter name').value
        });
      } while (this.match(','));
    }
    
    this.consume(')', 'Expected \')\' after parameters');
    this.consume('{', 'Expected \'{\'');
    
    const body: AstNode[] = [];
    while (!this.check('}') && !this.isAtEnd()) {
      body.push(this.declaration());
    }
    
    this.consume('}', 'Expected \'}\' after function body');
    
    return {
      type: 'FunctionDeclaration',
      id: { type: 'Identifier', name },
      params,
      body: {
        type: 'BlockStatement',
        body
      },
      generator: false,
      async: false
    };
  }

  private statement(): AstNode {
    if (this.match('KEYWORD', 'if') || this.peek().value === 'если') return this.ifStatement();
    if (this.match('KEYWORD', 'for') || this.peek().value === 'для') return this.forStatement();
    if (this.match('KEYWORD', 'while') || this.peek().value === 'пока') return this.whileStatement();
    if (this.match('KEYWORD', 'return') || this.peek().value === 'вернуть') return this.returnStatement();
    if (this.match('{')) return this.blockStatement();
    
    // Handle Russian variable declarations
    if (this.match('KEYWORD', 'переменная') || this.match('KEYWORD', 'константа')) {
      return this.variableDeclaration();
    }
    
    return this.expressionStatement();
  }

  private ifStatement(): AstNode {
    console.log('Starting ifStatement');
    
    // Consume the 'if' or 'если' token if it's still there
    if (this.match('KEYWORD', 'if') || this.match('KEYWORD', 'если')) {
      console.log('Found if/если keyword');
    }
    
    console.log('Before consuming ( - current token:', this.peek());
    // Consume the opening parenthesis
    this.consume('(', 'Expected "(" after "if"');
    console.log('After consuming ( - current token:', this.peek());
    
    // Parse the test condition
    console.log('Before parsing expression - current token:', this.peek());
    const test = this.expression();
    console.log('After parsing expression - current token:', this.peek());
    
    console.log('Before consuming ) - current token:', this.peek());
    // Consume the closing parenthesis
    this.consume(')', 'Expected ")" after if condition');
    console.log('After consuming ) - current token:', this.peek());
    
    // Parse the consequent (the 'then' part)
    console.log('Before parsing consequent - current token:', this.peek());
    const consequent = this.statement();
    console.log('After parsing consequent - current token:', this.peek());
    
    // Check for an 'else' clause
    let alternate = null;
    if (this.match('KEYWORD', 'else') || this.match('KEYWORD', 'иначе')) {
      console.log('Found else/иначе clause');
      alternate = this.statement();
    }
    
    console.log('Returning IfStatement');
    return {
      type: 'IfStatement',
      test,
      consequent,
      alternate
    };
  }

  private forStatement(): AstNode {
    this.consume('(', 'Expected \'(\' after \'for\'');
    
    let init;
    if (this.match(';')) {
      init = null;
    } else if (this.match('KEYWORD', 'let', 'const')) {
      init = this.variableDeclaration();
    } else {
      init = this.expressionStatement();
    }
    
    let test = null;
    if (!this.check(';')) {
      test = this.expression();
    }
    this.consume(';', 'Expected \';\' after loop condition');
    
    let update = null;
    if (!this.check(')')) {
      update = this.expression();
    }
    this.consume(')', 'Expected \')\' after for clauses');
    
    const body = this.statement();
    
    return {
      type: 'ForStatement',
      init,
      test,
      update,
      body
    };
  }

  private whileStatement(): AstNode {
    this.consume('(', 'Expected \'(\' after \'while\'');
    const test = this.expression();
    this.consume(')', 'Expected \')\' after while condition');
    
    const body = this.statement();
    
    return {
      type: 'WhileStatement',
      test,
      body
    };
  }

  private returnStatement(): AstNode {
    const argument = !this.check(';') ? this.expression() : null;
    this.consume(';', 'Expected \';\' after return value');
    
    return {
      type: 'ReturnStatement',
      argument
    };
  }

  private blockStatement(): AstNode {
    const body: AstNode[] = [];
    
    while (!this.check('}') && !this.isAtEnd()) {
      body.push(this.declaration());
    }
    
    this.consume('}', 'Expected \'}\' after block');
    
    return {
      type: 'BlockStatement',
      body
    };
  }

  private expressionStatement(): AstNode {
    console.log('Starting expressionStatement, current token:', this.peek());
    const expression = this.expression();
    
    // Only consume semicolon if it's not a block statement or if statement
    if (!this.isAtEnd() && this.peek().type !== '}') {
      this.consume(';', 'Expected \';\' after expression');
    }
    
    console.log('Returning expression statement');
    return {
      type: 'ExpressionStatement',
      expression
    };
  }

  private expression(): AstNode {
    console.log('Starting expression, current token:', this.peek());
    return this.assignment();
  }
  
  // Helper method to handle binary operations with proper precedence
  private binaryHelper(operatorFn: () => AstNode, ...operators: string[]): AstNode {
    let expr = operatorFn();
    
    while (this.match(...operators)) {
      const operator = this.previous().value;
      const right = operatorFn();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  private assignment(): AstNode {
    console.log('Starting assignment, current token:', this.peek());
    const expr = this.equality();
    
    if (this.match('=')) {
      const equals = this.previous();
      const value = this.assignment();
      
      if (expr.type === 'Identifier') {
        return {
          type: 'AssignmentExpression',
          operator: '=',
          left: expr,
          right: value
        };
      }
      
      throw new Error(`Invalid assignment target at line ${equals.line}, column ${equals.column}`);
    }
    
    return expr;
  }

  private equality(): AstNode {
    console.log('Starting equality, current token:', this.peek());
    return this.binaryHelper(
      () => this.comparison(),
      '==', '!=', '===', '!=='
    );
  }

  private comparison(): AstNode {
    console.log('Starting comparison, current token:', this.peek());
    return this.binaryHelper(
      () => this.term(),
      '>', '>=', '<', '<='
    );
  }
  }

  private term(): AstNode {
    console.log('Starting term, current token:', this.peek());
    return this.binaryHelper(
      () => this.factor(),
      '+', '-'
    );
  }

  private factor(): AstNode {
    console.log('Starting factor, current token:', this.peek());
    return this.binaryHelper(
      () => this.unary(),
      '*', '/', '%'
    );
  }

  private unary(): AstNode {
    if (this.match('!', '-')) {
      const operator = this.previous().value;
      const right = this.unary();
      return {
        type: 'UnaryExpression',
        operator,
        argument: right,
        prefix: true
      };
    }
    
    return this.primary();
  }

  private primary(): AstNode {
    console.log('Starting primary, current token:', this.peek());
    
    if (this.match('NUMBER')) {
      const value = this.previous();
      return {
        type: 'Literal',
        value: parseFloat(value.value),
        raw: value.value
      };
    }

    if (this.match('STRING')) {
      const value = this.previous();
      return {
        type: 'Literal',
        value: value.value.slice(1, -1), // Remove quotes
        raw: value.value
      };
    }

    if (this.match('IDENTIFIER')) {
      const id = this.previous();
      
      // Handle Russian console.log
      if (id.value === 'консоль') {
        this.consume('.', 'Expected . after console');
        const method = this.consume('IDENTIFIER', 'Expected method name after console.');
        this.consume('(', 'Expected ( after console method');
        
        const args = [];
        if (!this.check(')')) {
          do {
            // Use assignment() instead of expression() to handle all operators correctly
            args.push(this.assignment());
          } while (this.match(','));
        }
        this.consume(')', 'Expected ) after console.log arguments');
        
        return {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: { type: 'Identifier', name: 'console' },
            property: { type: 'Identifier', name: 'log' },
            computed: false
          },
          arguments: args
        };
      }
      
      // Handle regular identifiers
      let expr: AstNode = {
        type: 'Identifier',
        name: id.value
      };
      
      return this.finishMemberExpression(expr);
    }

    if (this.match('(')) {
      const expr = this.expression();
      this.consume(')', 'Expected ")" after expression');
      return expr;
    }
    
    throw new Error(`Unexpected token: ${this.peek().value} at line ${this.peek().line}, column ${this.peek().column}`);
  }
  
  private finishMemberExpression(expr: AstNode): AstNode {
    while (true) {
      if (this.match('.')) {
        // Handle dot notation: obj.prop
        const property = this.consume('IDENTIFIER', 'Expected property name after .');
        expr = {
          type: 'MemberExpression',
          object: expr,
          property: {
            type: 'Identifier',
            name: property.value
          },
          computed: false
        };
      } else if (this.match('(')) {
        // Handle function calls: fn()
        const args = [];
        if (!this.check(')')) {
          do {
            args.push(this.expression());
          } while (this.match(','));
        }
        this.consume(')', 'Expected ")" after arguments');
        
        expr = {
          type: 'CallExpression',
          callee: expr,
          arguments: args
        };
      } else {
        break;
      }
    }
    
    return expr;

    throw new Error(`Unexpected token: ${this.peek().value} at line ${this.peek().line}, column ${this.peek().column}`);
  }

  private synchronize(): void {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().value === ';') return;
      
      switch (this.peek().value) {
        case 'function':
        case 'let':
        case 'const':
        case 'if':
        case 'for':
        case 'while':
        case 'return':
          return;
      }
      
      this.advance();
    }
  }
}
