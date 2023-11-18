---
title: "Json"
published: 2023-04-09T09:45:16Z
category: "Typescript"
description: "Typescript type for the JSON spec"
---

Some JavaScript types [like dates](https://stackoverflow.com/questions/11491938/issues-with-date-when-using-json-stringify-and-json-parse) are not representable directly with JSON and require extra care to parse back out to a JavaScript object after they're serialized. If you want to make sure that you are only stringify-ing JSON-safe types, you can use this type to represent objects compatible with the [JSON spec](https://www.json.org):

```typescript
type Json =
    | { [key: string]: Json }
    | Json[]
    | string
    | number
    | true
    | false
    | null;

function safeStringify(obj: Json) {
    return JSON.stringify(obj);
}
```

If you have some type that is *not* JSON-compatible that you want to serialize, this type will help you write a `serialize()` function where the Typescript compiler confirms that the function is producing a safe-to-stringify value:

```typescript
type MyType = {
    date: Date,
    title: string,	
}

function serialize(obj: MyType): Json {
    return {title: obj.title, date: obj.date.toISOString()};
}
```