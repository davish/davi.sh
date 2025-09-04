---
title: Thinking About Thinking With LLMs
date: 2025-09-05
tags: [ ai, llm, recurse-center, airplane-articles ]
draft: false
---

After reading [Developing our position on
AI](https://www.recurse.com/blog/191-developing-our-position-on-ai) from the
[Recurse](https://www.recurse.com/), my corresponding entry in my [weekly
newsletter](/weekly) grew long enough I've decided to break it out into a full blog
post. Above and beyond its findings it charts a path for a more civil and considered mode
of discussion that we should all strive for on the Internet and in our own lives.

I've long been fascinated by the Recurse Center. Throughout my career I've been
consistently impressed with its alums I've crossed paths with, so I'm not particularly
surprised that probably the most balanced and thoughtful take on AI and software
engineering that I've read so far has come out of Recurse.

## Discourse on the Internet

I think the article presents a great way to deal with contentious issues within
organizations and writing about those issues publicly. First, listen to everyone. Then,
acknowledge disagreement and emphasize nuance while still outlining common ground.

The goal doesn't need to be having The Correct Take at every moment. People have different
life experiences which often leads them to different top-line beliefs. But beyond those
headlines, where reasonable people have opinions as wide as "we'll all be unemployed by
2028" to "LLMs are slurping up all our fresh water", there is a surprising amount of
common ground. In the case of this article, most people agreed that _using LLMs to learn
new things_ needs to be done with some caution.

## Step-Functions in Abstractions

This paragraph from the post really resonated with me:

> [T]utorials and teachers can only get you so far. Ultimately, you must build your own
> mental structures. Stack Overflow can be a helpful resource, but blindly following or
> copy-pasting from it does little to help you learn. While you can get a lot farther
> mindlessly using LLMs than Stack Overflow, the same principle holds true.

The comparison to StackOverflow is one that I've seen pop up again and again in the
conversation around LLMs. The one-two punch of Google search and StackOverflow caused a
similar magnitude shift in our profession twenty years ago.

Google made the skill of searching and skimming manuals for reference materials almost
obsolete. O'Reilly still exists, but reference books are a much smaller part of an
engineer's education than shorter-form blog posts focused on specific tasks[^2].

[^2]: All [four of types of
documentation](https://nick.groenen.me/posts/the-4-types-of-technical-documentation/)
certainly existed before the advent of search engines, but shorter-form content thrives in
search engines and recommendation algorithms.
    
StackOverflow made it possible to find code snippets to accomplish almost any common task
without much upfront thinking. This was almost always considered to be an unfortunate
shortcut. StackOverflow filled a niche, but it didn't obviate the need for a deep
understanding.

Going back even further, I'm sure folks were similarly wary to move towards higher-level
languages that abstracted away assembly.

Much of software engineering is ultimately about automating "white collar" work previously
done by humans, whether that work is coordinating airline logistics, processing payroll,
or organizing and maintaining libraries[^1]. Programming itself has always been part of
what new software has automated, from assemblers automating the tedious process of
calculating memory offsets for jumping to procedures to garbage collectors to Google
Search to Claude Code.

[^1]: The ones filled with stacks and stacks of books, not the ones with pre-written
    functions you can call from your programs

New tools make it easier to get work done without as deep of an understanding of the
things they automate away. The addition of another tool that brings programming closer to
natural language just like C and Java and Python once did will lead to further
democratization of programming and even more people in conversation with computers.

This is a good thing! But I don't think this will change the fundamental reality that the
_best_ programmers aren't the ones that make the widest use of the highest
abstractions. The best programmers will continue to be the ones who dig past the
abstractions to understand what's happening at a deeper level. That understanding will
always lead to more deft use of any tools that programmers have at their disposal.


