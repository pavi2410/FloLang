export default class Scope {
  localScope: Scope
  parentScope: Scope | null
  constructor(scope: Scope, parentScope: Scope | null = null) {
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

  store(symbol: string | number, value: unknown) {
    this.localScope[symbol] = value;
  }

  //for objects
  objset(symbol: string | number, other: string | number, value: unknown) {
    this.localScope[symbol][other] = value;
  }
}
