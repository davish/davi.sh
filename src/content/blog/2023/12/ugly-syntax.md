---
title: In Defense of Ugly Syntax
date: 2023-11-27T12:00:00
tags:
  - monads
  - programming-languages
  - haskell
  - ocaml
  - rust
  - typescript
description: '""'
draft: false
---
There's countless descriptions of monads on the software-engineer-by-day-indie-blogger-by-night corner of the internet. Ultimately I think that like many other programming concepts, the real way to get an understanding of monads to stick is just to try applying the concept in a few different contexts. No blog post can be a magic bullet here. What I don't see discussed as frequently as the "mystery" of "what is a monad?" is the fact that every web developer has already worked with monads extensively and intimately. We just call it Callback Hell:[^1]

[^1]: For the PL geeks reading, functions that take callbacks have a function signature that matches the monadic bind operation when you squint at it.

```js
function resizeFiles(source, widths) {
  fs.readdir(source, function (err, files) {
    if (err) {
      console.log('Error finding files: ' + err)
    } else {
      files.forEach(function (filename, fileIndex) {
        console.log(filename)
        gm(source + filename).size(function (err, values) {
          if (err) {
            console.log('Error identifying file size: ' + err)
          } else {
            console.log(filename + ' : ' + values)
            aspect = (values.width / values.height)
            widths.forEach(function (width, widthIndex) {
              height = Math.round(width / aspect)
              console.log('resizing ' + filename + 'to ' + height + 'x' + height)
              this.resize(width, height).write(dest + 'w' + width + '_' + filename, function(err) {
                  if (err) console.log('Error writing file: ' + err)
              })
            }.bind(this))
          }
        })
      })
    }
  })
}
```
*Code example lightly modified from [callbackhell.com](http://callbackhell.com).*

Everyone hates callbacks. So ECMAScript 2015 came up with [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), a standard library solution that reduced indentation on chained asynchronous operations:

```js
function resizeFiles(source, widths) {
  return fs.readdir(source).then(files => Promise.all(
    files.map(filename =>
      gm(source + filename).size()
        .then(values => {
          console.log(filename + ' : ' + values)
          aspect = (values.width / values.height)
          return Promise.all(
            widths.map(width => {
              height = Math.round(width / aspect)
              console.log('resizing ' + filename + 'to ' + height + 'x' + height)
              return this.resize(width, height)
                .write(dest + 'w' + width + '_' + filename)
                .catch((err) => console.log('Error writing file: ' + err))
            })
          )
        })
        .catch(err => console.log('Error identifying file size: ' + err))
    )
  )).catch(err => console.log('Error finding files: ' + err))
}
}
```

For long chains of async computations, promises could be simpler than callbacks. But for many use cases with different control flow, Promises were still too cumbersome to use. So ECMAScript 2017 added added [`async`/`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) syntax, and now it's just about as easy to read and reason about asynchronous code as non-async.

```js
async function resizeFiles(source, widths) {
  try {
    files = await fs.readdir(source)
  } catch (err) {
    console.log("error finding files: " + err)
  }

  for (let file of files) {
    try {
      values = await gm(source + filename).size()
    } catch (err) {
      console.log("error identifying file sizes: " + err)
    }
  
    console.log(filename + ' : ' + values)
    aspect = (values.width / values.height)
    for (let width of widths) {
      height = Math.round(width / aspect)
      console.log(
        'resizing ' + filename + 'to ' + height + 'x' + height)
      await this.resize(width, height)
             .write(dest + 'w' + width + "_" + filename)
    }
  }
}
```

This code is a lot cleaner to read, but our business logic is still riddled with try/catch statements for error handling. It's annoying to write, and it still makes the important lines of business logic less clear. JavaScript doesn't have an answer to this, but Rust's answer is the [`Result` type and the `?` operator](https://doc.rust-lang.org/rust-by-example/error/result/enter_question_mark.html). From Rust by Example:

```rust
mod checked {
  #[derive(Debug)]
  enum MathError {
      DivisionByZero,
      NonPositiveLogarithm,
      NegativeSquareRoot,
  }

  type MathResult = Result<f64, MathError>;

  fn div(x: f64, y: f64) -> MathResult {
      if y == 0.0 {
          Err(MathError::DivisionByZero)
      } else {
          Ok(x / y)
      }
  }

  fn sqrt(x: f64) -> MathResult {
      if x < 0.0 {
          Err(MathError::NegativeSquareRoot)
      } else {
          Ok(x.sqrt())
      }
  }

  fn ln(x: f64) -> MathResult {
      if x <= 0.0 {
          Err(MathError::NonPositiveLogarithm)
      } else {
          Ok(x.ln())
      }
  }

  // Intermediate function
  fn op_(x: f64, y: f64) -> MathResult {
      // if `div` "fails", then `DivisionByZero` will be `return`ed
      let ratio = div(x, y)?;

      // if `ln` "fails", then `NonPositiveLogarithm` will be `return`ed
      let ln = ln(ratio)?;

      sqrt(ln)
  }

  pub fn op(x: f64, y: f64) {
      match op_(x, y) {
          Err(why) => panic!("{}", match why {
              MathError::NonPositiveLogarithm
                  => "logarithm of non-positive number",
              MathError::DivisionByZero
                  => "division by zero",
              MathError::NegativeSquareRoot
                  => "square root of negative number",
          }),
          Ok(value) => println!("{}", value),
      }
  }
}

fn main() {
  checked::op(1.0, 10.0);
}
```

Just like in async/await in JavaScript ([or Rust](https://rust-lang.github.io/async-book/01_getting_started/04_async_await_primer.html)), adding syntax sugar over repetitive boilerplate makes the business logic more clear.

Both `Promise` in JavaScript and `Result` in Rust are examples of monads, and they're far from the only types of monad out there.[^2] In every monad's callback hell form, they're cumbersome to write, reason about and difficult to read.
[^2]: Even Python has syntactic sugar for a type of monad: [list comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions). The List monad was one of the wackiest ones for me to get my head around, but it appears as far back as [Philip Wadler's original 1992 paper](https://homepages.inf.ed.ac.uk/wadler/papers/marktoberdorf/baastad.pdf).

Monads as a buzzword are often associated with Haskell. When we talk about Haskell and monads, what we're often talking about is `do` notation: Haskell's syntactic sugar for any and all monads:

```haskell
resizeFiles source widths =
	do
		files <- readdir
```

Unlike any of the other languages we've discussed so far, Haskell's `do` notation is general across all monads, whether it's Async, Result, Maybe, or List. Nifty, right? Tons of different possible custom boilerplate or behavior between two lines of business logic, abstracted out so it's invisible. It must lead to code so elegant it appears to reveal fundamental truths about life, the halting problem, and everything. Right?

```haskell
makeStage :: JSON -> Integer -> TransformResult Stage
makeStage =
  parseStage
    [( "$lookup",
        withObj
          ( \o ->
              Lookup <$> getStringValue "from" o
                <*> (getValue "localField" o >>= getFieldPathWithoutDollar)
                <*> (getValue "foreignField" o >>= getFieldPathWithoutDollar)
                <*> getStringValue "as" o
          )
      ),
    ]
  where
    withObj f (JObject o) = f o
    withObj _ _ = throwErrorWithContext "Expecting object."
```

Can you figure out what this code does? [I wrote it](https://github.com/eyingxuan/mqlint/blob/master/src/Parser/MqlParser.hs), and still have trouble deciphering it. There's a reason Haskell's sometimes referred to as a [write-only programming language](http://jargon.net/jargonfile/w/write-onlylanguage.html). The simple syntax and reliance on punctuation for brevity makes it super easy to write when all the context is in your head. But that same terse, quasi-mathematical notation makes it so difficult for others, or your future self, to fully grok the code when that context isn't fully loaded in. 

Beyond Haskell's proclivity for custom inline operators like `<*>`, `<$>` and `<|>`, it's impossible to know what monad a given block of code is using from just the source itself. You either need to know what monad the function on the right side of `<-` belongs to, or look at the type signature for the function. This is the biggest difference from Async/Await or Rust's `Result`/`?` early return pattern. With both of those specialized monad syntaxes, it's abundantly clear from the source code of a function itself what monads are being used.

So are we stuck adding new language features for every monad we want to make easy for users of our language without sacrificing readability? What if a given codepath wants to generate random datastructures[^3] and another is highly parallel? Can we have both be equally ergonomic?
[^3]: [Quickcheck Generators](https://hackage.haskell.org/package/QuickCheck-2.14.3/docs/Test-QuickCheck-Gen.html) are a monad too!

When I first read code with the syntax introduced by [OCaml's `ppx_let`](https://blog.janestreet.com/let-syntax-and-why-you-should-use-it/), I was kind of put off. Compared to Haskell, it was so verbose to read, and definitely uglier than `do` notation.

```ocaml
let%bind example = something ()
```

Over time, reading more and more code in this style, it startedd to make sense. Code is communication, both with the compiler/interpreter but also, more importantly, with other programmers. Most code is read at least 10x as often as it's written or modified. Having words rather than punctuation differentiate between binds and plain assignments makes things clearer at read-time. If you're writing a Quickcheck Generator, it's abundantly clear that you're not using Async or Option or Result from the long `let%bind.Quickcheck.Generator` keyword.[^4]
[^4]: The syntax extends to applicative, which are common when writing parsers.

It's ugly, yes, but eminently readable. Like async/await in JavaScript, it un-nests control flow from callback functions. Unlike Haskell, it's abundantly clear without looking at any type signatures what the code is actually doing. To me, it feels like it's the best of both worlds: you get to avoid writing repetitive boilerplate or deeply nested callbacks in your code, and those reading it later on have an easier on-ramp to understanding a given block of code on its own without needing the full surrounding context ahead-of-time.