---
title: "Improving My Writing Skills One Python Script at a Time"
date: 2022-12-20
draft: false
tags: ["python", "airplane-articles"]
description: ""
---

One of my pet peeves about my natural writing style is how I lean into complex sentences divided by commas. Left unchecked, my prose starts looking like it might be ChatGPT's attempt at writing a blog post in the style s-expressions. I thought it would be neat to try and write some code to help me proofread for this specific issue and improve my posts.

<!--more-->

The first script I'm writing looks for sequences of multiple sentences that have too many commas in them. If there are more than three commas in two adjacent sentences, I need to reword something. Here's its output on one of my first blogposts, [_Switching to Emacs_](https://davi.sh/blog/2020/03/switching-to-emacs/):

```
***
One thing I started to worry about recently has been my reliance on a closed-source, and, once I'm out of college, pretty expensive editor.
Sure, many employers pay for licenses, but it would be awesome if I could configure an editor that worked well for me and was also completely open-source.
- 5 commas
***
Sure, many employers pay for licenses, but it would be awesome if I could configure an editor that worked well for me and was also completely open-source.
A few months ago, I switched my Python development to VSCode, where I had already been doing frontend JS/TypeScript dev for a few years.
- 4 commas
***
After learning vim keybindings this summer, I would've definitely liked to also be using the keyboard more often.
Primarily, though, I'd heard really cool things about [org-mode](https://orgmode.org/), and wanted to try it out.
- 4 commas
***
Primarily, though, I'd heard really cool things about [org-mode](https://orgmode.org/), and wanted to try it out.
Full support of org-mode is only present in emacs, which in the midst of quarantine would be a bit of excitement to check out.
- 4 commas
***
The Python language server was a bit finnicky, but after setting it up, along with JavaScript, I'm already at a point where I can be productive.
I enabled a few more Doom modules, like a terminal emulator (`term`) and a file explorer (`treemacs`).
- 4 commas
```

Since these windows are all processed in order, I can see without any extra processing that there's actually two sequences of three sentences with 7 and 6 commas respectively.

So much of my Python experience is from writing apps with Django that I forgot how quick and easy it is to whip up a small script that does some text processing with nothing but the standard library. As much as I appreciate static types and exhaustiveness checking in larger programs, being able to ignore edge cases that I know don't appear in the specific input I'm concerned with is a relief for scripts like this.

As you might expect, I ran this post through the script before publishing. It had no notes! I'm improving already.