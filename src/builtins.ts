import { toFateString, sleep } from "./utils.ts";

export const builtins = {
  math: {
    PI: Math.PI,
    E: Math.E,
    SQRT2: Math.SQRT2,
    SQRT1_2: Math.SQRT1_2,
    LOG10E: Math.LOG10E,
    LOG2E: Math.LOG2E,
    LN10: Math.LN10,
    LN2: Math.LN2,
  },
  print: {
    type: "function",
    run: (...args: any[]) => {
      args = args.map((el) => toFateString(el));
      process.stdout.write(args.join(""));
      return "";
    },
  },
  println: {
    type: "function",
    run: (...args: any[]) => {
      args = args.map((el) => toFateString(el));
      process.stdout.write(args.join("") + "\n");
      return "";
    },
  },
  evalJS: {
    type: "function",
    run: (args: string) => {
      return eval(args);
    },
  },
  typeOf: {
    type: "function",
    run: (args: any) => {
      return typeof args;
    },
  },
  floor: {
    type: "function",
    run: (args: number) => {
      return Math.floor(args);
    },
  },
  stringify: {
    type: "function",
    run: (args: any) => JSON.stringify(args),
  },
  import: {
    type: "function",
    run: (args: any) => {
      return require("fs").readFileSync(args).toString();
    },
  },
  join: {
    type: "function",
    run: (...args: any[]) => args.join(""),
  },
  wait: {
    type: "function",
    run: (args: string) => {
      sleep(parseInt(args));
    },
  },
  push: {
    type: "function",
    run: (array: any[], push: any) => array.push(push),
  },
  toInt: {
    type: "function",
    run: (args: string) => parseInt(args),
  },
  input: {
    type: "function",
    run: (...args: any[]) => {
      return prompt(args.join(""));
    },
  },
};
