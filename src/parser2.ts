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

  private check(type: string, value?: string): boolean {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    return value ? token.type === type && token.value === value : token.type === type;
  }

  private match(type: string, ...values: (string | string[])[]): boolean {
    if (this.isAtEnd()) return false;
    
    const token = this.peek();
    
    if (values.length === 0) {
      if (token.type === type) {
        this.advance();
        return true;
      }
      return false;
    }
    
    if (token.type === type) {
      const currentValue = token.value;
      // Flatten the values array to handle both string and string[]
      const flatValues = values.flat();
      if (flatValues.includes(currentValue)) {
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

  public parse(): AstNode[] {
    const statements: AstNode[] = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return statements;
  }

  private declaration(): AstNode {
    try {
      if (this.match('KEYWORD', 'let', 'const', 'var', 'переменная', 'константа')) {
        return this.variableDeclaration();
      }
      if (this.match('KEYWORD', 'function', 'функция')) {
        return this.functionDeclaration();
      }
      return this.statement();
    } catch (error) {
      this.synchronize();
      throw error;
    }
  }

  private variableDeclaration(): AstNode {
    const token = this.previous();
    const isConst = token.value === 'const' || token.value === 'константа';
    const name = this.consume('IDENTIFIER', 'Expected variable name').value;
    
    let initializer: AstNode | null = null;
    if (this.match('=')) {
      initializer = this.expression();
    } else if (isConst) {
      throw new Error('Constants must be initialized');
    }
    
    this.consume(';', 'Expected \';\' after variable declaration');
    
    return {
      type: 'VariableDeclaration',
      kind: isConst ? 'const' : 'let',
      declarations: [{
        type: 'VariableDeclarator',
        id: { type: 'Identifier', name },
        init: initializer || null
      }]
    };
  }

  private functionDeclaration(): AstNode {
    const name = this.consume('IDENTIFIER', 'Expected function name').value;
    this.consume('(', 'Expected "(" after function name');
    
    const params: string[] = [];
    if (!this.check(')')) {
      do {
        if (params.length >= 255) {
          throw new Error('Cannot have more than 255 parameters');
        }
        params.push(this.consume('IDENTIFIER', 'Expected parameter name').value);
      } while (this.match(','));
    }
    
    this.consume(')', 'Expected ")" after parameters');
    this.consume('{', 'Expected "{" before function body');
    
    const body = [];
    while (!this.check('}') && !this.isAtEnd()) {
      body.push(this.declaration());
    }
    
    this.consume('}', 'Expected "}" after function body');
    
    return {
      type: 'FunctionDeclaration',
      id: { type: 'Identifier', name },
      params: params.map(name => ({ type: 'Identifier', name })),
      body: {
        type: 'BlockStatement',
        body
      },
      generator: false,
      async: false,
      expression: false
    };
  }

  private statement(): AstNode {
    if (this.match('{')) return this.blockStatement();
    if (this.match('KEYWORD', 'if', 'если')) return this.ifStatement();
    if (this.match('KEYWORD', 'for', 'для')) return this.forStatement();
    if (this.match('KEYWORD', 'while', 'пока')) return this.whileStatement();
    if (this.match('KEYWORD', 'return', 'вернуть')) return this.returnStatement();
    return this.expressionStatement();
  }

  private blockStatement(): AstNode {
    const body: AstNode[] = [];
    
    while (!this.check('}') && !this.isAtEnd()) {
      body.push(this.declaration());
    }
    
    this.consume('}', 'Expected "}" after block');
    
    return {
      type: 'BlockStatement',
      body
    };
  }

  private ifStatement(): AstNode {
    this.consume('(', 'Expected "(" after "if"');
    const test = this.expression();
    this.consume(')', 'Expected ")" after if condition');
    
    const consequent = this.statement();
    let alternate: AstNode | null = null;
    
    if (this.match('KEYWORD', 'else', 'иначе')) {
      alternate = this.statement();
    }
    
    return {
      type: 'IfStatement',
      test,
      consequent,
      alternate
    };
  }

  private forStatement(): AstNode {
    this.consume('(', 'Expected "(" after "for"');
    
    let init: AstNode | null = null;
    if (!this.match(';')) {
      if (this.match('KEYWORD', 'let', 'const', 'var', 'переменная', 'константа')) {
        init = this.variableDeclaration();
      } else {
        init = this.expressionStatement();
      }
    }
    
    let test: AstNode | null = null;
    if (!this.check(';')) {
      test = this.expression();
    }
    this.consume(';', 'Expected ";" after loop condition');
    
    let update: AstNode | null = null;
    if (!this.check(')')) {
      update = this.expression();
    }
    this.consume(')', 'Expected ")" after for clauses');
    
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
    this.consume('(', 'Expected "(" after "while"');
    const test = this.expression();
    this.consume(')', 'Expected ")" after condition');
    
    const body = this.statement();
    
    return {
      type: 'WhileStatement',
      test,
      body
    };
  }

  private returnStatement(): AstNode {
    const argument = !this.match(';') ? this.expression() : null;
    if (!this.check(';')) {
      this.consume(';', 'Expected ";" after return value');
    }
    
    return {
      type: 'ReturnStatement',
      argument
    };
  }

  private expressionStatement(): AstNode {
    const expression = this.expression();
    this.consume(';', 'Expected ";" after expression');
    
    return {
      type: 'ExpressionStatement',
      expression
    };
  }

  private expression(): AstNode {
    return this.assignment();
  }

  private assignment(): AstNode {
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

  private binaryHelper(
    nextFn: () => AstNode,
    ...operators: string[]
  ): AstNode {
    let expr = nextFn();
    
    while (true) {
      let matched = false;
      for (const op of operators) {
        if (this.match('+', op) || this.match('-', op) || this.match('*', op) || this.match('/', op) || 
            this.match('%', op) || this.match('===', op) || this.match('!==', op) || 
            this.match('==', op) || this.match('!=', op) || this.match('>', op) || 
            this.match('<', op) || this.match('>=', op) || this.match('<=', op)) {
          
          const operator = this.previous().value;
          const right = nextFn();
          expr = {
            type: 'BinaryExpression',
            operator,
            left: expr,
            right
          };
          matched = true;
          break;
        }
      }
      
      if (!matched) break;
    }
    
    return expr;
  }

  private equality(): AstNode {
    return this.binaryHelper(
      () => this.comparison(),
      '==', '!=', '===', '!=='
    );
  }

  private comparison(): AstNode {
    return this.binaryHelper(
      () => this.term(),
      '>', '>=', '<', '<='
    );
  }

  private term(): AstNode {
    return this.binaryHelper(
      () => this.factor(),
      '+', '-'
    );
  }

  private factor(): AstNode {
    return this.binaryHelper(
      () => this.unary(),
      '*', '/', '%'
    );
  }

  private unary(): AstNode {
    if (this.match('!', '-')) {
      return {
        type: 'UnaryExpression',
        operator: this.previous().value,
        argument: this.unary(),
        prefix: true
      };
    }
    
    return this.call();
  }

  private call(): AstNode {
    let expr = this.primary();
    
    while (true) {
      if (this.match('(')) {
        expr = this.finishCall(expr);
      } else if (this.match('.')) {
        const name = this.consume('IDENTIFIER', 'Expected property name after "."');
        expr = {
          type: 'MemberExpression',
          object: expr,
          property: { type: 'Identifier', name: name.value },
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
    
    if (!this.check(')')) {
      do {
        if (args.length >= 255) {
          throw new Error('Cannot have more than 255 arguments');
        }
        args.push(this.expression());
      } while (this.match(','));
    }
    
    const paren = this.consume(')', 'Expected ")" after arguments');
    
    return {
      type: 'CallExpression',
      callee,
      arguments: args
    };
  }

  private primary(): AstNode {
    if (this.match('NUMBER')) {
      return {
        type: 'Literal',
        value: parseFloat(this.previous().value),
        raw: this.previous().value
      };
    }
    
    if (this.match('STRING')) {
      const value = this.previous().value;
      return {
        type: 'Literal',
        value: value.slice(1, -1), // Remove quotes
        raw: value
      };
    }
    
    if (this.match('IDENTIFIER')) {
      // Handle Russian console.log
      if (this.previous().value === 'консоль' && this.check('.')) {
        this.consume('.', 'Expected "." after "консоль"');
        const method = this.consume('IDENTIFIER', 'Expected method name after "."');
        
        if (method.value !== 'лог') {
          throw new Error(`Unknown console method: ${method.value}`);
        }
        
        this.consume('(', 'Expected "(" after console method');
        const args: AstNode[] = [];
        
        if (!this.check(')')) {
          do {
            args.push(this.expression());
          } while (this.match(','));
        }
        
        this.consume(')', 'Expected ")" after console.log arguments');
        
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
      
      // Regular identifier
      return {
        type: 'Identifier',
        name: this.previous().value
      };
    }
    
    if (this.match('(')) {
      const expr = this.expression();
      this.consume(')', 'Expected ")" after expression');
      return expr;
    }
    
    throw new Error(`Unexpected token: ${this.peek().value} at line ${this.peek().line}, column ${this.peek().column}`);
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
}
