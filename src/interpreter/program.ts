import { builtins } from "../builtins.ts";
import Scope from "../scope.ts";
import { ASTNode } from "../types.ts";

export default function interpretProgram(ast: ASTNode) {
  if (!ast.body) return;

  const globalScope = new Scope(builtins, null);
  for (const k of ast.body) {
    interpret(k, globalScope);
  };
}