---
title: Ideas for an Agent-Oriented Programming Language
date: 2026-02-03
tags: [ ai, llm, markov, airplane-articles ]
draft: true
---

Software development is changing. Tool calling, inference scaling and RL with Verifiable
Rewards have combined over the past year to enable agent harnesses like Claude Code which
can reliably navigate, modify and contribute to large codebases.

LLMs scale amazingly well with the amount of training data you throw at them. But I've
been thinking about how to build tools that work alongside the characteristics of LLMs
rather than language models needing to learn how to work with the tools in training. It
doesn't seem apparent to me that JavaScript/TypeScript or Python are on the Pareto
frontier of programming languages for agentic coding.

I have a hunch that a programming environment built around the strengths and limitations
of autoregressive LLMs can lead to cheaper and higher-quality agent-powered
development. How could we prove out that hypothesis? One would first need to design a
language that aligns with how LLMs "think". What would such a language look like? In this
post I put forward some ideas for a language called Markov that I think would fit the
bill.

<!--more-->

## Humans should be able to read and edit Markov code

First and foremost, Markov will still be human readable and edit-able.  Agents excel at
generating boilerplate, but the core business logic of any system is where the most
attention to detail will always needs to be. Most programmers can get by today without
ever digging into TCP packet captures or assembly code, but some still find a good reason
to. I wrote a few months ago in [Thinking about Thinking with
LLMs](../../2025/10/thinking-with-llms):

> [T]he _best_ programmers aren't the ones that make the widest use of the highest
> abstractions. That'll continue to be those who dig down and understand what's happening
> at a deeper level -- that understanding will always lead to more deft use of any tools
> that programmers have at their disposal.

Transparency into the source code is as much ideological as it is practical. Over the next
few years agents will likely start independently building systems end-to-end. In that
world, interpretability of AI-generated systems becomes as important interpretability into
the models themselves. We may not have transparency today into the reasons an LLM might
make a decisions it does,[^1] but we should discourage models from developing
incomprehensible "neuralese" and keep developing tools which allow for human insight to
continue to play a role.

[^1]: This fact keeps me up at night. My writing in this article might seem more
    accelerationist than my usual tone. I'm not _sure_ that this future is coming, but I
    think it's important to be prepared for and for these tools to be crafted
    intentionally rather than stumbled in to.

## Sum types for fast compiler feedback

Agents thrive on feedback. It helps them stay on the assigned task without falling down
unproductive rabbit holes. Unit tests are important here, but static analysis will always
faster and less error-prone than running code. Markov will have strong, static types and
exhaustive pattern matching to encourage [**making illegal states
unrepresentable**](https://web.archive.org/web/20260205183806/https://functional-architecture.org/make_illegal_states_unrepresentable/).

Rust's reliance on sum types and compiler-enforced exhaustiveness checks in pattern
matching enables fearless refactoring and extension of existing code. A human can spend a
few minutes adding a variant to an existing type after thinking hard (or planning with an
LLM) about the best way to represent some new functionality. The agent can then propagate
that change outward through the codebase, completing now-inexhaustive pattern matches and
following boilerplate patterns it encounters. 

Markov should lean into this pattern: a human (or very smart LLM) makes the decisions
about core data structures and interfaces, and an agent will propagate that change
throughout the rest of the codebase. Today this second step needs to be carried out by a
frontier model but in in the future a smaller/cheaper/faster model can probably do this
job sufficiently well.

This is a pattern that has been extremely effective in my own work with coding agents
since Claude 4.5 was released. Focus on core types and abstractions and let the agent
plumb it through. With a coding agent I don't have to be as careful about future-proofing
my types or using fancy language features to avoid boilerplate when adding new
functionality. Strong interface boundaries and full sum types help keep an LLM on guard
rails.

Edoardo Vacchi's wrote a post late last year called [The Return of Language Oriented
Programming](https://blog.evacchi.dev/posts/2025/11/09/the-return-of-language-oriented-programming/)
about LLM-enabled DSL toolchains. He describes an LLM which generates a spec and an
interpreter for a DSL and then having it generate business logic in that DSL. This is
reminiscent of [narrow waist software
engineering](https://www.oilshell.org/blog/2022/02/diagrams.html) that I talked about [in
my newsletter](/weekly/2025-11-09/) in reference to [Mitchell Hashimoto's article about
non-trivial vibe coding](https://mitchellh.com/writing/non-trivial-vibing). A well-defined
protocol between different parts of the system -- in Mitchell's post, a view model; in
Edoardo's, a DSL -- reduces the "cognitive" load and can make either a human programmer or
an LLM much more effective.

I prefer embedded syntax within a strongly typed language[^3] to a DSL backed by a full
compiler toolchain, but I agree with the main thrust of the article. This pattern is
probably most commonly associated with more academic languages like OCaml and
Haskell. However, DSLs form the foundation of modern machine learning with Python-based
DSLs like PyTorch and Triton. Edoardo address this towards the end, too but asserts that:

[^3]: Enforced with sum types or their more expressive cousins, GADTs

> The cost of defining your own syntax instead of leaning onto the host language's is now
> much lower; in fact, I would even dare to say that you might want to prefer flexible
> syntax, so that you will be able to optimize for token cost.

I think Edoardo presents a bit of a straw man. Writing a lexer, parser and interpreter might be
cheaper with LLMs, but _maintaining_ that stack is still a nonzero amount of effort that
relying on a host language with good DSL support can obviate.

## Compiler errors as prompts

Compiler errors are human-readable. There's short explanations with error codes and links
to external documentation to stay within a small terminal window, and often some ASCII art
drawing an arrow to the specific problematic row and column within a file. LLMs can only
interpret these errors since Stack Overflow and other sites are present in the training set
and the aggressive post-training with verifiable rewards that conditions them to
understand these errors. 

But what would compiler errors for LLMs look like? They would be phrased as prompts with
suggestions on how to fix an error formatted as diffs rather than ASCII diagrams. When
possible the compiler should explain the cases that a specific error may happen and give
the agent possible directions of investigation.

## Token optimized syntax

Markov's syntax should be optimized to make the most effective use of the context
window. There's already some promising results for TOON, an alternative rendering of JSON
whose grammar uses elements that LLMs need to represent across multiple
tokens. Token-optimized code is cheaper for agents to process[^4] and also potentially
easier for them to understand: TOON shows slightly better information recovery compared to
JSON, even though the models have been trained on heaps and heaps of JSON.

[^4]: The underlying LLM calls are often billed per-token.

"The Return of Language Oriented Programming" touches on token-optimization, too. LLMs
trained on a general corpus of English use fewer tokens to represent common words than
they do to represent shorter abbreviations that human authors often use for the sake of
write-ability -- think Rust's `fn` to mark functions. I firmly believe that code should be
optimized for readability over write-ability, and it's pretty cool that if Markov was
designed to be simple for LLMs to write efficiently would also probably be more readable
for humans than one designed for humans to write efficiently. This nicely feeds back into
our first goal.

LLMs are horrendously bad at counting,[^5] though, and so Ruby's `begin`/`end` lexical
scopes will probably be preferable to Python's indentation-based scoping.

[^5]: How many "R"s are in strawberry, again?

## Interoperability is a non-goal

Most popular new languages of the past decade have all piggy-backed on existing software
ecosystems: Swift on Objective-C; Kotlin on Java; TypeScript on JavaScript.[^6] Allowing
programmers to gradually migrate over their existing codebases and rely on existing
trusted dependencies has been the characteristic behind each of those languages' rises.

[^6]: Rust is the exception here (and is slightly older than the others), but it really
    filled an empty niche rather than improving on the ergonomics of a predecessor.

This benefit degrades with coding agents. Today's agents have been shown to reliably port
existing libraries to new languages with a fraction of the effort. When you can generate
new functionality in less time than it takes to research the right library, the ability
for Markov to call into an existing ecosystem without an FFI is less critical.

## Conclusion

Well, you may be wondering now, where are the code snippets? I've had these ideas floating
around in my head for months now, and wanted to get it down on paper and out into the
world.

We'll see where these ideas go! Luckily, coding agents make starting a new language easier
than ever.
