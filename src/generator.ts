import { AstNode } from './types';

export class Generator {
  public generate(node: AstNode | AstNode[]): string {
    if (Array.isArray(node)) {
      return node.map(n => this.generate(n)).join('\n');
    }

    switch (node.type) {
      case 'Program':
        return this.generate(node.body);

      case 'FunctionDeclaration':
        return this.functionDeclaration(node);

      case 'VariableDeclaration':
        return this.variableDeclaration(node);

      case 'VariableDeclarator':
        return this.variableDeclarator(node);

      case 'BlockStatement':
        return this.blockStatement(node);

      case 'ReturnStatement':
        return this.returnStatement(node);

      case 'IfStatement':
        return this.ifStatement(node);

      case 'ForStatement':
        return this.forStatement(node);

      case 'WhileStatement':
        return this.whileStatement(node);

      case 'ExpressionStatement':
        return this.expressionStatement(node);

      case 'AssignmentExpression':
        return this.assignmentExpression(node);

      case 'BinaryExpression':
        return this.binaryExpression(node);

      case 'UnaryExpression':
        return this.unaryExpression(node);

      case 'Identifier':
        return this.identifier(node);

      case 'Literal':
        return this.literal(node);

      case 'CallExpression':
        return this.callExpression(node);
        
      case 'MemberExpression':
        return this.memberExpression(node);

      default:
        throw new Error(`Unknown node type: ${(node as any).type}`);
    }
  }

  private functionDeclaration(node: AstNode): string {
    const id = this.generate(node.id);
    const params = node.params.map((p: AstNode) => this.generate(p)).join(', ');
    const body = this.generate(node.body);
    
    return `function ${id}(${params}) ${body}`;
  }

  private variableDeclaration(node: AstNode): string {
    const declarations = node.declarations
      .map((d: AstNode) => this.generate(d))
      .join(', ');
    
    return `${node.kind} ${declarations};`;
  }

  private variableDeclarator(node: AstNode): string {
    const id = this.generate(node.id);
    const init = node.init ? ` = ${this.generate(node.init)}` : '';
    return `${id}${init}`;
  }

  private blockStatement(node: AstNode): string {
    const body = node.body
      .map((stmt: AstNode) => {
        const code = this.generate(stmt);
        return stmt.type.endsWith('Statement') ? code : `${code};`;
      })
      .join('\n  ');
    
    return `{\n  ${body}\n}`;
  }

  private returnStatement(node: AstNode): string {
    return `return${node.argument ? ' ' + this.generate(node.argument) : ''};`;
  }

  private ifStatement(node: AstNode): string {
    const test = this.generate(node.test);
    const consequent = this.generate(node.consequent);
    const alternate = node.alternate ? ` else ${this.generate(node.alternate)}` : '';
    
    return `if (${test}) ${consequent}${alternate}`;
  }

  private forStatement(node: AstNode): string {
    const init = node.init ? this.generate(node.init).replace(/;+$/, '') : '';
    const test = node.test ? this.generate(node.test) : '';
    const update = node.update ? this.generate(node.update) : '';
    const body = this.generate(node.body);
    
    return `for (${init}; ${test}; ${update}) ${body}`;
  }

  private whileStatement(node: AstNode): string {
    const test = this.generate(node.test);
    const body = this.generate(node.body);
    
    return `while (${test}) ${body}`;
  }

  private expressionStatement(node: AstNode): string {
    return `${this.generate(node.expression)};`;
  }

  private assignmentExpression(node: AstNode): string {
    return `${this.generate(node.left)} ${node.operator} ${this.generate(node.right)}`;
  }

  private binaryExpression(node: AstNode): string {
    return `${this.generate(node.left)} ${node.operator} ${this.generate(node.right)}`;
  }

  private unaryExpression(node: AstNode): string {
    return `${node.operator}${this.generate(node.argument)}`;
  }

  private identifier(node: AstNode): string {
    return node.name;
  }

  private literal(node: AstNode): string {
    if (node.value === null) return 'null';
    if (typeof node.value === 'string') return `"${node.value}"`;
    return String(node.value);
  }

  private callExpression(node: AstNode): string {
    const callee = this.generate(node.callee);
    const args = node.arguments.map((arg: AstNode) => this.generate(arg)).join(', ');
    return `${callee}(${args})`;
  }

  private memberExpression(node: AstNode): string {
    const object = this.generate(node.object);
    const property = node.computed 
      ? `[${this.generate(node.property)}]` 
      : `.${this.generate(node.property)}`;
    return `${object}${property}`;
  }
}
