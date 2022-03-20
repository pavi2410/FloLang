import { globalScope } from "../builtins.ts";
import { ASTNode } from "../types.ts";

export default function interpretProgram(ast: ASTNode) {
  if (!ast.body) return;

  for (const k of ast.body) {
    interpret(k, globalScope);
  }
}