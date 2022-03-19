export function isUnique(myArray: string | Iterable<unknown>) {
  return myArray.length === new Set(myArray).size;
}

export function sleep(miliseconds: number) {
  const currentTime = new Date().getTime();

  while (currentTime + miliseconds * 1000 >= new Date().getTime());
}

export function isObject (obj: unknown) {
  return !!obj && obj.constructor === Object;
}

export function toFateString(val?: string) {
  if (val === null) {
    return "null";
  }

  if (typeof val == "string") {
    return val;
  }

  if (typeof val === "boolean" || typeof val === "number") {
    return JSON.stringify(val);
  }

  if (Array.isArray(val)) {
    return JSON.stringify(val);
  }

  if (typeof val == "object") {
    return JSON.stringify(val);
  }

  if (typeof val == "function") {
    return "() -> { ... }";
  }
  if (val == void 0) {
    return null;
  }
  return "<unknown type: " + val + ">";
}