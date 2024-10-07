---
tags: ["typescript"]
---

# TypeScript Use Cases

This article presents useful configuration and type notation combinations that developers often use but are not found in the official documentation. The following use cases are confirmed to work with the following:

- **Chip**: Apple M1 Pro
- **IDE**: Visual Studio Code
  - **Version**: 1.94.0 (Universal)
  - **Commit**: d78a74bcdfad14d5d3b1b782f87255d802b57511
  - **Date**: 2024-10-02T13:08:12.626Z
  - **Electron**: 30.5.1
  - **Electron Build ID**: 10262041
  - **Chromium**: 124.0.6367.243
  - **Node**: 20.16.0
  - **V8**: 12.4.254.20-electron.0
  - **OS**: Darwin arm64 23.6.0
- **Memory**: 32 GB
- **Node**: 18.17.0
- **NPM**: 9.6.7
- **NVM**: 0.39.1
- **OS Name**: macOS Sonoma Version 14.6.1
- **TypeScript**: 5.5.2

## Configuration

The usage of `tsconfig.json` with other packages.

### Declaration Files

The types in `*.d.ts` files can be used globally by either including it within `tsconfig.json`:

```json title="./tsconfig.json"
{ "include": ["./foo.d.ts"] }
```

Or, you can reference it at the top of the entrypoint file:

```typescript title="./index.ts"
/// <reference path="./foo.d.ts" />
```

### Module Paths

By default, TypeScript searches for modules in `./node_modules/` for import statements without explicit paths. This behavior is consistent with both `ts-node` and `tsc`. However, this can cause issues with certain folder structures. For example, [Firebase Cloud Functions](https://firebase.google.com/docs/functions/callable?hl=zh-tw&gen=2nd) have folders that start with `@`, which TypeScript mistakenly identifies as part of `./node_modules/`, leading to incorrect module resolution:

```typescript
import fooModules from "foo";
import fooPrivate from "./foo";
```

[Module Alias](https://www.npmjs.com/package/module-alias) is designed to configure module paths, which works well with `paths` in `tsconfig.json`:

```shell
npm install --save \
    module-alias
npm install --save-dev \
    @types/module-alias
```

Create `./alias.ts`, synchronize its values with `paths` in `tsconfig.json`, and import it at the top of `./index.ts`:

```typescript title="./alias.ts"
import ModuleAlias from "module-alias";

ModuleAlias.addAliases({
  "@foo": __dirname + "/foo",
  "@bar": __dirname + "/bar",
});
```

```json title="./tsconfig.json"
{
  "compilerOptions": {
    "paths": {
      "@foo/*": ["./foo/*"],
      "@bar/*": ["./bar/*"]
    }
  }
}
```

```typescript title="./index.ts"
import "./alias";
import baz from "@foo/baz";
import bar from "@bar";
```

### Support Import Statement

When the `target` in `tsconfig.json` is set to `ES5` or `ES3`, the `module` should be set to `CommonJS`. Otherwise, you will encounter a _SyntaxError: Cannot use import statement outside a module_. This is because the `import` syntax did not exist before ES5, and the `target` option is meant to compile TypeScript into the specified version of JavaScript:

```json title="./tsconfig.json"
{
  "compilerOptions": {
    // highlight-start
    "target": "ES5",
    "module": "CommonJS"
    // highlight-end
  }
}
```

:::warning
The official documentation suggests changing the file extension to `.mjs` to enforce `module` or `.cjs` to enforce `require`, or adding `--experimental-modules` to the `ts-node` command. However, in practice, these methods are ineffective. Additionally, setting `type` to `module` in `package.json` and setting `module` to `esnext` in `tsconfig.json` both result in errors when using `ts-node`.
:::

## Type Notations

This section covers some unique and uncommon use cases in TypeScript. These scenarios often can't be addressed with [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) alone and may require a series of complex combinations.

### Exported Variables

Originally, JavaScript allows variables exported `let` values to be modified in other modules. However, `let` values can only be updated if they are in a mutable object in TypeScript:

```typescript title="./export.ts"
const exportObject = { foo: 1, bar: 2 };
let exportLet = 0;

export { exportObject, exportLet };
```

```typescript title="./import.ts"
import { exportObject, exportLet } from "./export";

// error-start
exportLet = 2;
/** Cannot assign to 'exportLet' because it is an import.ts(2632) */
// error-end
exportObject.foo = 2;
```

Simply place the varaibles to a mutable object, such as a class or an object. Or, use `export default` to have `exportLet` to be referenced to the default module export:

```typescript title="./export.ts"
const exportObject = { foo: 1, bar: 2 };
let exportLet = 0;

// highlight-next-line
export default { exportObject, exportLet };
```

### Overloaded Arrow Function

While [overloaded functions are available with `declare`](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#overloaded-functions), arrow functions can only be overloaded with `type`:

```typescript
type TFoo = {
  (bar: number): string;
  (bar: string): number;
};

// highlight-next-line
export const foo: TFoo = (bar: any): any => {
  switch (typeof bar) {
    case "string":
      return Number(bar);
    case "number":
      return String(bar);
    default:
      throw new Error("Unsupported parameter type.");
  }
};
```

### Restrict Keys with Enums

With `type` and `key in <type>` keywords, object keys can be restricted with certain values:

```typescript
type TFoo = "Bar" | "Baz"";

export const foo: {
  // highlight-next-line
  [key in TFoo]: string;
} = {
  Bar: "bar",
  Baz: "baz",
};
```

### Spread Operator

TypeScript is not able to detect the returned array element types from a function:

```typescript
function foo() {
  return [1, 2];
}

function bar(baz: number, qux: number) {
  return [baz, qux];
}

// error-start
bar(...foo());
/** A spread argument must either have a tuple type
 *  or be passed to a rest parameter.ts(2556) */
// error-end
```

This can be fixed either by using [Spread Operator](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#spread) for the parameter:

```typescript
function foo() {
  return [1, 2];
}

// highlight-next-line
function bar(...quux: number[]) {
  return [quux[0], quux[1]];
}
```

Assigning the return type explicitly:

```typescript
// highlight-next-line
function foo(): [number, number] {
  return [1, 2];
}
function bar(baz: number, qux: number) {
  return [baz, qux];
}
```

Or, creating a [Generic Type](https://www.typescriptlang.org/docs/handbook/2/generics.html#handbook-content) for the function:

```typescript
function foo() {
  return [1, 2];
}

// highlight-next-line
function bar<T>(quux?: T) {
  return [quux[0], quux[1]];
}
```

:::info
There is an [Issue](https://github.com/microsoft/TypeScript/issues/5296) about supporting spread operator for arrays and tuples in function calls and should be been available since TypeScript 2.4.2. However, its been confirmed that 5.5.2 and 3.8.3 still persist this defect.
:::
