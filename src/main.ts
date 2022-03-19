import ohm from "https://unpkg.com/ohm-js@16/dist/ohm.esm.js";

import { grammar } from "./grammar.ts";
import Scope from "./scope.ts";
import { builtins } from "./builtins.ts";
import { ASTNode } from "./types.ts";
import interpretProgram from "./interpreter/program.ts";

const parser = ohm.grammar(grammar);

function interpret(ast?: ASTNode, scope?: Scope): unknown {
  if (!ast) return;

  if (ast.type === "Program") {
    interpretProgram(ast);
  }

  if (ast.type === "NullLiteral") {
    return null;
  }

  if (
    ast.type === "StringLiteral" ||
    ast.type === "NumberLiteral" ||
    ast.type === "BooleanLiteral"
  ) {
    return ast.value;
  }

  if (ast.type === "Identifier") {
    const { name } = ast;
    let got = scope.lookup(name);
    if (ast.other != []) {
      ast.other.forEach((el: any[][]) => {
        got = got[interpret(el[1][0], scope)];
      });
    }
    return got;
  }

  if (ast.type === "CallExpr") {
    const { id, args } = ast;
    let argVals = ast.args;
    argVals = argVals.filter((el: any) => !Array.isArray(el));
    argVals = argVals.map((arg: any) => {
      return interpret(arg, scope);
    });
    //Check If Name In Scope
    if (scope.lookup(id.name) == void 0) {
      throw new Error(`The function ${id.name} doesn't exist`);
    }
    //Check If Type == Function
    switch (scope.lookup(id.name).type) {
      case "function":
        return scope.lookup(id.name).run.apply(null, argVals);

      default:
        throw new Error(`The function ${id.name} doesn't exist`);
    }
  }

  if (ast.type === "VarDecl") {
    const {
      id: { name },
      expr,
    } = ast;

    const exprVal = interpret(expr, scope);

    let containsVar = scope.lookup(name);

    if (containsVar) throw new Error(`variable ${name} is redeclared`);
    scope.store(name, exprVal);
    return;
  }

  if (ast.type === "FunDecl") {
    let {
      id: { name },
      params,
      body,
      last,
    } = ast;

    const funBody = {
      type: "function",
      name,
      run: (...args: { [x: string]: any }) => {
        const funScope = new Scope({}, scope);

        params.forEach((param: { name: any }, i: string | number) => {
          funScope.store(param.name, args[i]);
        });
        body = body.map((b: any) => interpret(b, funScope));
        //returns last element
        return body[body.length - 1][0];
      },
    };

    let containsFun = scope.lookup(name);

    if (containsFun) throw new Error(`Function ${name} is redeclared`);

    scope.store(name, funBody);

    return;
  }

  if (ast.type == "ArrayExpr") {
    return ast.value.map((el: any) => interpret(el, scope));
  }

  if (ast.type === "Assignment") {
    let {
      id: { name },
      expr,
    } = ast;

    const exprVal = interpret(expr, scope);

    let containsVar = scope.lookup(name);

    if (!containsVar) {
      scope.store(name, exprVal);
      return;
    }
    if (ast.id.other.length > 0) {
      let joinedfull = ast.id.other.map((el: any[]) =>
        el
          .filter(Array.isArray)
          .map((al: any[]) => al.join(""))
          .join("")
      );
      let x = scope.localScope[name];
      scope.objset(name, joinedfull, exprVal);
    } else {
      scope.store(name, exprVal);
    }
    return;
  }

  if (ast.type === "UnaryExpr") {
    const { argument, operator } = ast;

    const val = interpret(argument, scope);

    switch (operator) {
      case "!":
        return !val;
      case "-":
        return -val;
      default:
        throw new Error(`unsupported unary operator ${operator}`);
    }
  }

  if (ast.type === "BinaryExpr") {
    const { left, op, right } = ast;

    const leftVal = interpret(left, scope);
    const rightVal = interpret(right, scope);

    switch (op) {
      case "+":
        return leftVal + rightVal;
      case "-":
        return leftVal - rightVal;
      case "*":
        return leftVal * rightVal;
      case "/":
        return leftVal / rightVal;
      case "==":
        return leftVal == rightVal;
      case "===":
        return leftVal === rightVal;
      case "!=":
        return leftVal != rightVal;
      case "!==":
        return leftVal !== rightVal;
      case "<":
        return leftVal < rightVal;
      case "<=":
        return leftVal <= rightVal;
      case ">":
        return leftVal > rightVal;
      case ">=":
        return leftVal >= rightVal;
      default:
        throw new Error(`unsupported binary operator ${op}`);
    }
  }

  if (ast.type === "ConditionalExpr") {
    const { alternate, consequent, test } = ast;
    return interpret(test, scope)
      ? interpret(consequent, scope)
      : interpret(alternate, scope);
  }

  if (ast.type == "IfStmt") {
    // Merge with ConditionalExpr!!
    return eval(
      interpret(ast.check.one, scope) +
        ast.check.sign +
        interpret(ast.check.two, scope)
    )
      ? ast.iftrue.map((el: any) => interpret(el, scope))
      : ast.iffalse.map((el: any) => interpret(el, scope));
  }

  if (ast.type == "ObjectLiteral") {
    //clean up!!
    let matches: any[] = [];
    ast.value.forEach((el: { value: any }[]) => matches.push(el[0].value));
    if (isUnique(matches)) {
      let total = {};
      ast.value.forEach((el: any[]) => {
        total[interpret(el[0])] = interpret(el[1]);
      });
      return total;
    }
    throw new Error(`Name Repeats Are Not Allowed In Object`);
  }

  if (ast.type == "LoopStmt") {
    let { start, end, step, variable, body } = ast;

    start = parseInt(interpret(start, scope));
    end = parseInt(interpret(end, scope));
    step = parseInt(interpret(step, scope));
    if (variable.name in scope.localScope) {
      throw new Error(
        `Cannot use declared (${variable.name}) variable in loop`
      );
    }
    //This does it total times - 1
    for (let x = start; x != end; x = x + step) {
      scope.store(variable.name, x);
      ast.body.forEach((el: any) => {
        interpret(el, scope);
      });
      delete scope.localScope[variable.name];
    }
    //So we have to add extra time right here
    scope.store(variable.name, end);
    ast.body.forEach((el: any) => {
      interpret(el, scope);
    });
    delete scope.localScope[variable.name];
    return;
  }
  if (ast.type == "comment") {
    return;
  }
  return ast;
}

function run(code: string) {
  return interpret(parser.match(code));
}
