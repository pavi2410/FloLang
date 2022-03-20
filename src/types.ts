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
  | "ArrayExpr"
  | "UnaryExpr"
  | "BinaryExpr"
  | "ConditionalExpr"
  | "IfStmt"
  | "ObjectLiteral"
  | "LoopStmt"
  | "comment";

export type ASTNode = {
  type: ASTType;
  id: string;
  value: unknown;
  body: ASTNode[];
};
