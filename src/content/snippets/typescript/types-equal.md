---
title: "typesEqual"
published: 2023-04-06
category: "Typescript"
description: "Ask the Typescript compiler how two types are different"
---
```ts
type FirstType = {};
type SecondType = {};
const typesEqual = <A, B extends A, C extends B>() => {};

// This will fail to compile if FirstType and SecondType are not equivalent.
typesEqual<FirstType, SecondType, FirstType>();
```

Found in [this StackOverflow answer](https://stackoverflow.com/a/69413184/21359118) by [Almaju](https://stackoverflow.com/users/5103610/almaju).

I was replacing a hand-written validator with [Zod](https://zod.dev) and wanted to make sure my new type inferred with Zod was equivalent to my old hand-rolled type. The assertion on the last line of this snippet will fail to compile if the two types passed in are not equal. The error will explain exactly which properties are missing and/or incompatible, so you can adjust your new type as needed to match.