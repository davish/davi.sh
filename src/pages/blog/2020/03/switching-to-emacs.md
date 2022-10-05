---
title: "Switching to Emacs"
date: 2020-03-31T17:58:32-04:00
draft: false
toc: false
images:
  - post/images/emacs-screenshot.png
tags:
  - emacs
  - texteditors
  - configuration
description: "How I learned to stop worrying and love the keyboard."
---

My personal editor journey has been kind of strange. I started off using Sublime
Text for most things, and then switched over to JetBrains IDEs on a student
license. JetBrains IDEs are pretty amazing -- especially when it came to PyCharm's
Django support. One thing I started to worry about recently has been my reliance
on a closed-source, and, once I'm out of college, pretty expensive editor. Sure,
many employers pay for licenses, but it would be awesome if I could configure
an editor that worked well for me and was also completely open-source.

A few months ago, I switched my Python development to VSCode, where I had
already been doing frontend JS/TypeScript dev for a few years. It started up
faster than PyCharm and had extensions for most things, but I never really felt comfortable.
After learning vim keybindings this summer, I would've definitely liked to also
be using the keyboard more often. Primarily, though, I'd heard really cool
things about [org-mode](https://orgmode.org/), and wanted to try it out.
Full support of org-mode is only present in emacs, which in the midst
of quarantine would be a bit of excitement to check out.

At the recommendation of a friend, I decided to use
[doom-emacs](https://github.com/hlissner/doom-emacs) instead of starting a
config from scratch. I knew nothing about emacs, and after my experience trying
to start a vim setup from scratch over this summer, I knew I wouldn't have the
patience to learn _everything_ I needed to about emacs lisp and package
management before jumping in. Doom gives opinionated defaults for those
comfortable with vim and its keybindings and lots of curated "modules" which
wrap around existing emacs plugins. While the existing getting started docs are
_comprehensive_ for sure, [this
article](https://medium.com/urbint-engineering/emacs-doom-for-newbies-1f8038604e3b)
was really a great introduction to get the ball rolling for me.

And honestly, it didn't take long at all to get a setup where I feel like I can
be productive. I make heavy use of goto definition when I'm coding, so I knew
I'd need that functionality. Luckily, doom has easy support for the Language
Server Protocol, same as VSCode does. All that's required to enable it in Doom
is to add the line `(python +lsp)` to the `doom!` block in your
`.doom.d/init.el` file. The Python language server was a bit finnicky, but after
setting it up, along with JavaScript, I'm already at a point where I can be
productive. I enabled a few more Doom modules, like a terminal emulator
(`term`) and a file explorer (`treemacs`). Here's where I'm at, about a day and
a half in:

![Configured Emacs Screenshot](/blog/images/emacs-screenshot.png)

You can see the VSCode inspiration pretty clearly here! Another thing that's
cool about Doom is that in a lot of ways, it's an entire configuration platform.
While it comes with a lot of modules curated by its author, you can easily add
modules yourself with your own configuration. It's something expanded on in
[this article comparing Doom and
Spacemacs](https://yiming.dev/blog/2018/01/22/compare-doom-emacs-spacemacs-vanilla-emacs/),
another emacs "distro". I'm not sure if I'll continue using Doom long-term as I
learn more about emacs and how to configure it. There's a big possibility I jump
to using a more "vanilla" experience, with only the packages I know I use. Only
time will tell here!

But one thing I'm really happy about is how much less I'm relying on the mouse
than I was in either VSCode or any JetBrains IDE. I'm able to navigate around
the entire editor and go through file trees from the keyboard, thanks to great
VIM keybindings provided by `evil-mode`. I haven't even touched org-mode yet,
and I'm already glad I made this transition. I'm looking forward to learning
more in the coming weeks!
