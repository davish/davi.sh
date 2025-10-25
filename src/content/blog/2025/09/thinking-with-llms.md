---
title: Thinking About Thinking With LLMs
date: 2025-10-25
tags: [ ai, llm, recurse-center, airplane-articles ]
draft: false
---

After reading [Developing our position on
AI](https://www.recurse.com/blog/191-developing-our-position-on-ai) from the [Recurse
Center](https://www.recurse.com/), the corresponding entry in [my newsletter](/weekly)
grew long enough I've decided to break it out into a full blog post. Above and beyond its
specific findings, I think the post charts a path for a more civil and considered mode of
discussion that we should all strive for on the Internet and in our own lives.

I've long been fascinated by the Recurse Center. Throughout my career I've been
consistently impressed with alums I've crossed paths with, so I'm not particularly
surprised that probably the most balanced and thoughtful take on AI and software
engineering that I've read so far has come out of Recurse.

## Discourse on the Internet

I think the article presents a great way to deal with contentious issues within
organizations and how to write about those issues publicly. First, listen to
everyone. Then, acknowledge disagreementa and emphasize nuance to make an effort to find
common ground.

The goal doesn't need to be having The Correct Take at every moment. People have different
life experiences which often leads them to different top-line beliefs. But beyond those
headlines, where reasonable people state anything from "we'll all be living in ASI-powered
utopia by 2028" to "LLMs are slurping up all our fresh water", there is a surprising
amount of common ground. 

In the case of this article, most people agreed that _using LLMs to learn new things_
needs to be done with some caution.

## Step-Functions in Abstractions

This paragraph from the post really resonated with me:

> [T]utorials and teachers can only get you so far. Ultimately, you must build your own
> mental structures. Stack Overflow can be a helpful resource, but blindly following or
> copy-pasting from it does little to help you learn. While you can get a lot farther
> mindlessly using LLMs than Stack Overflow, the same principle holds true.

The comparison to StackOverflow is one that I've seen pop up again and again in
discussions around LLMs. While LLMs can feel revolutionary, it's not the first time we've
seen a step change in software development resources.

Google made the skill of searching and skimming manuals for reference materials almost
obsolete. O'Reilly still exists, but reference books are a much smaller part of an
engineer's education than shorter-form blog posts focused on specific tasks[^2].

[^2]: All [four of types of
documentation](https://nick.groenen.me/posts/the-4-types-of-technical-documentation/)
certainly existed before the advent of search engines, but shorter-form content thrives in
ranked searches and recommendation algorithms.
    
StackOverflow made it possible to accomplish many common coding tasks without much upfront
thinking. Most consider copy/pasting StackOverflow answers to be an unfortunate
shortcut. StackOverflow filled a niche, but it didn't obviate the need for a deep
understanding.

Software engineering has always had a component focused on automating "white collar" human
work like airline logistics, processing payroll, or organizing and maintaining
libraries[^1]. Programming as a profession has never been immune to this -- assemblers
automated away calculating memory offsets for jumping to procedures; garbage collectors
automated memory management; Google Search changed what it meant to RTFM.

[^1]: The ones filled with stacks and stacks of books, not the ones with pre-written
    functions you can call from your programs

New tools always make it easier to code with a shallower understanding of the
system. Claude Code, Cursor and their ilk are bringing programming closer to natural
language just like C and Java and Python once did.

This is a good thing! It'll lead to the continued democratization of programming and ever
more people in conversation with computers. But I don't think this changes the fundamental
reality that the _best_ programmers aren't the ones that make the widest use of the
highest abstractions. That'll continue to be those who dig down and understand what's
happening at a deeper level -- that understanding will always lead to more deft use of any
tools that programmers have at their disposal.


