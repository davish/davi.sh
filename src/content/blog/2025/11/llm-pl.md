---
title: What would an LLM-Oriented Programming Language Look Like?
date: 2025-11-25
tags: [ llm, pl ]
draft: true
---

Whenever I've been asked if I'd ever go to grad school, I'd say that I'd get a PhD if I
had an idea for a dissertation that I was really excited about[^1]. About two years ago, I
finally came up with something that merged industry trends with longtime interests of
mine: a new programming language optimized for LLM authorship. 

The main feature of that language would be strong, static types and error message phrased
as prompts for an LLM to fix issues rather than human-oriented descriptions of what those
issues are. I have a fulltime job that I enjoy, so My ideas hadn't progressed much father
than that. Edoardo Vacchi's blog post [The Return of Language Oriented
Programming](https://blog.evacchi.dev/posts/2025/11/09/the-return-of-language-oriented-programming/)
got me thinking more about what would be important in this kind of language.

<!--more-->

[^1]: Joe Armstrong's [PhD dissertation on
    Erlang](https://web.archive.org/web/20041204143417/http://www.sics.se/~joe/thesis/armstrong_thesis_2003.pdf)
    has long been an inspiration for me. Taking work from industry and bringing it into
    academia is a direction of cross-pollination that should happen more often.

Edoardo's post advocates for DSLs as a way to express business logic, and digs into how
LLMs make DSLs easier to author and maintain. I found his mid-post "detour" on
token-optimized languages to be the most compelling part of the post. LLMs trained on a
general corpus of English use fewer tokens to represent common words than they do to
represent shorter abbreviations that human authors often use for the sake of
writeability. I often say that code should be optimized for readability over writability,
and it's pretty cool that a language designed to be simple for LLMs to write efficiently
would also probably be more readable than one designed for humans to write efficiently.
  
The main thrust of the article focuses on having an LLM generate a spec and an interpreter
for a DSL and then having it generate business logic in that DSL. This is reminiscent of
[narrow waist software engineering](https://www.oilshell.org/blog/2022/02/diagrams.html)
that I talked about a [few weeks ago](/weekly/2025-11-09/) in reference to [Mitchell
Hashimoto's non-trivial vibe coding](https://mitchellh.com/writing/non-trivial-vibing)
article. A well-defined protocol between different parts of the system -- in that post, a
view model; in this post, a DSL -- reduces the "cognitive" load and can make either a
human programmer or an LLM much more effective.
  
I prefer to think about DSLs as embedded syntax extensions to existing languages rather
than ground-up languages that live in their own text files. This is a common pattern in
academic languages like OCaml and Haskell, but embedded DSLs in Python form the foundation
of modern machine learning with DSLs like PyTorch, TensorFlow and Triton. Edoardo address
this towards the end, too, asserting that "the cost of defining your own syntax instead of
leaning onto the host language's is now much lower; in fact, I would even dare to say that
you might want to prefer flexible syntax, so that you will be able to optimize for token
cost". I do think this is a bit of a strawman. Writing a lexer, parser and interpreter
might be cheaper with LLMs, but _maintaining_ that stack is still a nonzero amount of
effort that relying on a host language can obviate.
  
What would an LLM-targeted meta-language look like? Something with the syntax of Python
but the expressiveness of OCaml that's geared towards expressing logic in DSLs? That, as a
side effect, is extremely easy for humans to read and reason about? I might dig into this
more in the future!
