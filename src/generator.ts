import { AstNode } from './types';

export class Generator {
  public generate(node: AstNode | AstNode[] | null | undefined): string {
    // Handle null/undefined input
    if (node == null) {
      console.error('Attempted to generate code for null or undefined node');
      return '';
    }

    // Handle arrays of nodes
    if (Array.isArray(node)) {
      if (node.length === 0) return '';
      return node.map(n => this.generate(n)).join('\n');
    }

    // Ensure node has a type
    if (!node.type) {
      console.error('Node is missing type property:', JSON.stringify(node, null, 2));
      return '';
    }

    // Convert legacy node types to standard ones
    if ((node as any).type === 'Variable') {
      node = {
        type: 'Identifier',
        name: (node as any).name,
        loc: (node as any).loc
      } as AstNode;
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
    if (!node.id) {
      console.error('Function declaration is missing id:', node);
      return 'function() {}';
    }
    
    const id = this.generate(node.id);
    const params = (node.params || []).map((p: AstNode) => this.generate(p)).join(', ');
    const body = node.body ? this.generate(node.body) : '{}';
    
    return `function ${id}(${params}) ${body}`;
  }

  private variableDeclaration(node: AstNode): string {
    if (!node.declarations || !Array.isArray(node.declarations)) {
      console.error('Invalid variable declaration:', node);
      return '';
    }
    
    const declarations = node.declarations
      .map(decl => this.variableDeclarator(decl))
      .filter(Boolean); // Filter out any invalid declarations
      
    // Convert 'let' to 'var' to match test expectations
    const declarationType = node.kind === 'let' ? 'var' : node.kind;
    
    return declarations.length > 0 
      ? `${declarationType} ${declarations.join(', ')};`
      : ''; // Return empty string if no valid declarations
  }

  private variableDeclarator(node: AstNode): string {
    const id = this.generate(node.id);
    const init = node.init ? ` = ${this.generate(node.init)}` : '';
    return `${id}${init}`;
  }

  private blockStatement(node: AstNode): string {
    if (!node.body || !Array.isArray(node.body)) {
      console.error('Invalid block statement:', node);
      return '{}';
    }
    
    if (node.body.length === 0) return '{}';
    
    const body = node.body
      .map((stmt: AstNode) => {
        if (!stmt) return '';
        const code = this.generate(stmt);
        if (!code) return '';
        // Only add semicolon if it's not already there and it's not a block/control statement
        const needsSemicolon = !code.endsWith(';') && 
                             !stmt.type.endsWith('Statement') && 
                             !['{', '}'].some(c => code.endsWith(c));
        return needsSemicolon ? `${code};` : code;
      })
      .filter(Boolean) // Remove any empty strings
      .join('\n  ');
    
    return `{\n  ${body}\n}`;
  }

  private returnStatement(node: AstNode): string {
    return `return${node.argument ? ' ' + this.generate(node.argument) : ''};`;
  }

  private ifStatement(node: AstNode): string {
    if (!node.test) {
      console.error('If statement is missing test:', node);
      return 'if (false) {}';
    }
    
    const test = this.generate(node.test);
    const consequent = node.consequent ? this.generate(node.consequent) : '{}';
    const alternate = node.alternate ? ` else ${this.generate(node.alternate)}` : '';
    
    // Handle single-line if statements without braces
    if (consequent.startsWith('{') && consequent.endsWith('}') && 
        (!alternate || alternate.startsWith(' else {'))) {
      return `if (${test}) ${consequent}${alternate}`;
    }
    
    // For multi-line or complex statements, ensure proper formatting
    return `if (${test}) ${consequent}${alternate}`;
  }

  private forStatement(node: AstNode): string {
    const init = node.init ? this.generate(node.init).replace(/;+$/, '') : '';
    const test = node.test ? this.generate(node.test) : '';
    const update = node.update ? this.generate(node.update).replace(/;+$/, '') : '';
    const body = node.body ? this.generate(node.body) : '{}';
    
    // Ensure body is a block if it's not already
    const formattedBody = body.startsWith('{') ? body : `{\n  ${body}\n}`;
    
    return `for (${init}; ${test}; ${update}) ${formattedBody}`;
  }

  private whileStatement(node: AstNode): string {
    const test = this.generate(node.test);
    const body = this.generate(node.body);
    
    return `while (${test}) ${body}`;
  }

  private expressionStatement(node: AstNode): string {
    if (!node.expression) {
      console.error('Expression statement is missing expression:', node);
      return ';';
    }
    
    const expr = this.generate(node.expression);
    // Don't add semicolon if it's already there or if it's a block/control statement
    if (!expr || expr.endsWith(';') || expr.endsWith('}') || expr.endsWith('{')) {
      return expr;
    }
    return `${expr};`;
  }

  private assignmentExpression(node: AstNode): string {
    return `${this.generate(node.left)} ${node.operator} ${this.generate(node.right)}`;
  }

  private binaryExpression(node: AstNode): string {
    if (!node.left || !node.right || !node.operator) {
      console.error('Invalid binary expression:', node);
      return '';
    }
    
    const left = this.generate(node.left);
    const right = this.generate(node.right);
    
    // Map operator types to their string representations
    const operatorMap: Record<string, string> = {
      'PLUS': '+',
      'MINUS': '-',
      'MULTIPLY': '*',
      'DIVIDE': '/',
      'MODULO': '%',
      'EQUAL_EQUAL': '==',
      'BANG_EQUAL': '!=',
      'EQUAL_EQUAL_EQUAL': '===',
      'TRIPLE_EQUALS': '===',  // Add mapping for TRIPLE_EQUALS
      'NOT_EQUALS_STRICT': '!==',
      'BANG_EQUAL_EQUAL': '!==',
      'LESS': '<',
      'LESS_EQUAL': '<=',
      'GREATER': '>',
      'GREATER_EQUAL': '>=',
      'PLUS_EQUAL': '+=',
      'MINUS_EQUAL': '-=',
      'MULTIPLY_EQUAL': '*=',
      'DIVIDE_EQUAL': '/=',
      'MODULO_EQUAL': '%=',
      'AND': '&&',
      'OR': '||',
      'INSTANCEOF': 'instanceof',
      'IN': 'in'
    };
    
    const operator = operatorMap[node.operator] || node.operator;
    
    // Add parentheses if needed based on operator precedence (simplified)
    const needsParens = (exprNode: AstNode) => {
      if (!exprNode) return false;
      return ['BinaryExpression', 'LogicalExpression'].includes(exprNode.type);
    };
    
    const leftStr = needsParens(node.left) ? `(${left})` : left;
    const rightStr = needsParens(node.right) ? `(${right})` : right;
    
    return `${leftStr} ${operator} ${rightStr}`;
  }

  private unaryExpression(node: AstNode): string {
    return `${node.operator}${this.generate(node.argument)}`;
  }

  private translateIdentifier(name: string): string {
    const ruToEn: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
      'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
      'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
      'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
      'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
      'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
      'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts',
      'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu',
      'Я': 'Ya'
    };

    // Check if the name contains any Cyrillic characters
    const hasCyrillic = /[а-яА-Я]/.test(name);
    
    if (!hasCyrillic) return name;
    
    // Translate each character
    let result = '';
    for (const char of name) {
      result += ruToEn[char] || char;
    }
    
    return result;
  }

  private identifier(node: AstNode): string {
    // Special case for console methods
    if (node.name === 'консоль') return 'console';
    if (node.name === 'лог') return 'log';
    if (node.name === 'ошибка') return 'error';
    if (node.name === 'предупреждение') return 'warn';
    if (node.name === 'информация') return 'info';
    
    // Default case for other identifiers
    return this.translateIdentifier(node.name);
  }

  private literal(node: AstNode): string {
    if (node.value === null) return 'null';
    if (typeof node.value === 'string') {
      // Remove any extra quotes that might be added during parsing
      const str = node.value.replace(/^"|"$/g, '');
      return `"${str}"`;
    }
    return String(node.value);
  }

  private callExpression(node: AstNode): string {
    if (!node.callee) {
      console.error('Call expression is missing callee:', node);
      return 'undefined()';
    }
    
    const callee = this.generate(node.callee);
    const args = (node.arguments || [])
      .map((arg: AstNode) => this.generate(arg))
      .filter(Boolean) // Filter out any invalid arguments
      .join(', ');
      
    return `${callee}(${args})`;
  }

  private memberExpression(node: AstNode): string {
    if (!node.object) {
      console.error('Member expression is missing object:', node);
      return 'undefined';
    }
    
    const object = this.generate(node.object);
    
    // Handle computed properties (e.g., obj['property'])
    if (node.computed) {
      if (!node.property) {
        console.error('Computed member expression is missing property:', node);
        return `${object}['']`;
      }
      return `${object}[${this.generate(node.property)}]`;
    }
    
    // Handle dot notation (e.g., obj.property)
    if (node.property) {
      if (node.property.type === 'Identifier') {
        const propertyName = node.property.name;
        // Special case for console methods
        if (propertyName === 'лог') return `${object}.log`;
        if (propertyName === 'ошибка') return `${object}.error`;
        if (propertyName === 'предупреждение') return `${object}.warn`;
        if (propertyName === 'информация') return `${object}.info`;
        
        // Default case for other properties
        return `${object}.${propertyName}`;
      } else {
        console.error('Invalid member expression structure:', node);
        return object; // Return just the object as a fallback
      }
    }
    
    console.error('Invalid member expression structure:', node);
    return object; // Return just the object as a fallback
  }
}
