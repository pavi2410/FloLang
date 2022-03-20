import Scope from "../scope.ts";
import { ASTNode } from "../types.ts";

export default function interpretFunction(ast: ASTNode, scope: Scope) {
  const {
    id: { name },
    params,
    body,
    last,
  } = ast;

  const funBody = {
    type: "function",
    name,
    run: (args: unknown[]) => {
      const funScope = new Scope({}, scope);
      let i = 0
      for (const param of params) {
        funScope.store(param.name, args[i++])
      }

      body = body.map((b: any) => interpret(b, funScope));
      //returns last element
      return body[body.length - 1][0];
    },
  };

  const containsFun = scope.lookup(name);

  if (containsFun) throw new Error("Function is already defined: " + name);

  scope.store(name, funBody);
}
