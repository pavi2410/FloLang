import Scope from "../scope.ts";
import { ASTNode } from "../types.ts";

export default function interpretBinaryExpr(ast: ASTNode, scope: Scope) {
      const { left, op, right } = ast;

      const leftVal = interpret(left, scope) as number;
      const rightVal = interpret(right, scope) as number;

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
          throw new Error("Unsupported binary operator: " + op);
      }
}