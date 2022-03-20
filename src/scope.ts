export default class Scope {
  localScope: Record<string, unknown>;
  parentScope: Scope | null;
  constructor(
    scope: Record<string, unknown>,
    parentScope: Scope | null = null
  ) {
    this.localScope = scope;
    this.parentScope = parentScope;
  }

  lookup(symbol: string): unknown {
    if (symbol in this.localScope) {
      return this.localScope[symbol];
    }
    if (this.parentScope) {
      return this.parentScope.lookup(symbol);
    }
    throw new Error("Cannot lookup symbol in scope: " + symbol);
  }

  store(symbol: string, value: unknown) {
    this.localScope[symbol] = value;
  }

  delete(symbol: string) {
    delete this.localScope[symbol]
  }

  //for objects
  objset(symbol: string, other: string, value: unknown) {
    this.localScope[symbol][other] = value; // TODO
  }
}
