---
title: Monads in Plain Sight
date: 2023-12-05T12:00:00
tags:
  - monads
  - programming-languages
  - javascript
  - rust
  - python
description: Who knew the real category of endofunctors was in our hearts the whole time?
draft: false
---
There's countless descriptions of monads on the software-engineer-by-day-indie-blogger-by-night corner of the internet. Ultimately I think that like many other programming concepts, the real way to get an understanding of monads to stick is just to try applying the concept in a few different contexts. No blog post can be a magic bullet here. What I don't see discussed as frequently as the "mystery" of "what is a monad?" is the fact that every web developer has already worked with monads extensively and intimately. We just call it Callback Hell:[^1]

[^1]: For the PL geeks reading, the haskell definition of a monad is based on the bind operation: `m a -> (a -> m b) -> m b`. The second argument to bind isn't really different from a callback in JS, when you squint at it. This is made more clear with Promises, which we'll get to next.

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

For long chains of async computations, Promises can be simpler than callbacks. But for many use cases with different control flow, Promises were still too cumbersome to use. So ECMAScript 2017 added added [`async`/`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) syntax, and now it's just about as easy to read and reason about asynchronous code as non-async.

```js
async function resizeFiles(source, widths) {
  try {
    files = await fs.readdir(source)
  } catch (err) {
    console.log("error finding files: " + err)
  }

  for (let filename of files) {
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

This code is a lot cleaner to read, but our business logic is still riddled with try/catch statements for error handling. It's annoying to write, and it still makes the important lines of business logic less clear. JavaScript doesn't have an answer to this, but Rust's answer is the `Result` type and the `?` operator. [From Rust by Example](https://doc.rust-lang.org/rust-by-example/std/result/question_mark.html):

```rust
mod checked {
  #[derive(Debug)]
  enum MathError {
      DivisionByZero,
      NonPositiveLogarithm,
      NegativeSquareRoot,
  }

  fn div(x: f64, y: f64) -> Result<f64, MathError> { /* ... */ }

  fn sqrt(x: f64) -> Result<f64, MathError> { /* ... */ }

  fn ln(x: f64) -> Result<f64, MathError> { /* ... */ }

  // Intermediate function
  fn op_(x: f64, y: f64) -> Result<f64, MathError> {
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
```

Just like `async`/`await` in JavaScript ([and](https://docs.python.org/3/library/asyncio-task.html)[other](https://rust-lang.github.io/async-book/01_getting_started/04_async_await_primer.html) [languages](https://en.cppreference.com/w/cpp/language/coroutines)), adding syntax sugar over repetitive boilerplate makes the business logic more clear.

Both `Promise` in JavaScript and `Result` in Rust are examples of monads, and they're far from the only types of monad out there.[^2] In every monad's callback hell form, they're cumbersome to write, reason about and difficult to read.
[^2]: Even Python has syntactic sugar for a type of monad: [list comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions). The List monad was one of the wackiest ones for me to get my head around, but it appears as far back as [Philip Wadler's original 1992 paper](https://homepages.inf.ed.ac.uk/wadler/papers/marktoberdorf/baastad.pdf).

