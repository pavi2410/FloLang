export type ASTType =
  | "Program"
  | "NullLiteral"
  | "StringLiteral"
  | "NumberLiteral"
  | "BooleanLiteral"
  | "Identifier"
  | "CallExpr"
  | "VarDecl"
  | "FunDecl"
  | "Assignment"
  | "UnaryExpr"
  | "BinaryExpr"
  | "comment";

export type ASTNode = {
  type: ASTType;
  value: unknown;
  body: ASTNode[];
};
