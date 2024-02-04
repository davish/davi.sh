---
title: "Thinking with Obsidian"
date: 2022-01-20T23:00:34-05:00
draft: false
tags: [obsidian, workflow, series]
---

This is the first part of an in-progress series on the [Obsidian knowledge base](https://obsidian.md). You can find all the articles with the <a href='/tags/obsidian'>obsidian tag</a>.

---

I'm not an organized person by nature. I tend to try to just commit important things to memory rather than write them down in any systematized way, which means I end up forgetting things about 20-30% of the time, and just hoping I remembered the most important things in some kind of implicit neural priority queue. I've tried a bunch of different [task management](https://todoist.com/app/) and [notetaking systems](https://bulletjournal.com) before, but nothing really stuck. At the end of the day it's because I always struggled to organize my thoughts in a single hierarchy. Even a regular paper notebook is organized implicitly in a timeline, with older notes in the front and newer notes in the back. I always spend way more time thinking about where my note should fit in the hierarchy than I do actually capturing my thoughts.

<!--more-->

The closest I got to a system that worked for me was [Org Mode](https://orgmode.org) in [Emacs](/blog/2020/03/switching-to-emacs/). Org is a full notetaking and outlining system first and foremost, but [Org's agenda views](https://orgmode.org/manual/Agenda-Views.html) were game-changing for me: I could write down tasks and events in _any_ file, and my agenda view would aggregate and sort them all to show me what was important. The issue of up-front organization completely went away. Org was an extremely powerful system, but its only true implementation was the major mode written in Emacs LISP for the Emacs environment. Mobile apps exist that can parse and manipulate subsets of Org's syntax,[^1] but none of them handle all the features of Org I used, like recurring tasks and agenda view, as well as the original implementation. I loved Org for how easy it was to capture thoughts and tasks, but I still couldn't effectively capture and process notes and tasks when I wasn't in front of my own computer with Emacs open. Unfortunately, that was pretty limiting for me.

[^1]: [BeOrg](https://beorgapp.com) and [Plain Org](https://plainorg.com) are two examples of polished apps which focus on different subsets of org-mode's syntax.

So I was open to alternatives. Personal Knowledge Management (PKM) has been a trend for a few years now, popularized by [Roam](https://roamresearch.com) and its interconnected web of small, atomic notes. Like Org Mode, there was no need for a strict hierarchy -- the relationship between notes is implicit through bidirectional, internal links. There's a lot of choices now in this space. Roam Research, [Notion](https://notion.so), [Org-roam](https://www.orgroam.com), [Dendron](https://www.dendron.so), [Logseq](https://logseq.com), [Obsidian](https://obsidian.md) all come to mind. If I really had to be honest with myself, I chose Obsidian primarily because it was the only option besides Emacs with Org-roam that included `vi` keybindings to edit text. In addition, its feature-equal mobile app was an attractive improvement over my existing system.

While I chose Obsidian relatively superficially, I've been really happy with the product for two main reasons: extendability and interoperability.

Obsidian follows VSCode's philosophy of having a rock-solid, minimalist core with most functionality built on top as plugins.[^2] [The Obsidian docs](https://help.obsidian.md/Obsidian/Obsidian#What+is+Obsidian) say that "Used in the most basic way, you can edit and preview Markdown files" within Obsidian. The one real addition to that is that internal links are "first class citizens," and Obsidian's core will index your internal links for autocomplete and note renaming. Almost everything else in Obsidian, from the file manager to the graph view to the word count in the text editor, is a plugin built on top of the base Markdown text editor. The fact that the developers have written so many core plugins using the plugin API (**_27_**, by my count) means that they've spent a lot of time thinking about the ergonomics of that API, and the quality of [Obsidian's third-party plugin ecosystem](https://obsidian.md/plugins) shows how this pays off. For a relatively new app, there's almost a plugin for anything, from [PDF annotation](https://github.com/elias-sundqvist/obsidian-annotator) to an [RSS reader](https://github.com/joethei/obsidian-rss) fully inside the editor. And if what you're looking for doesn't exist, it's possible to make it yourself, either as a standalone plugin or with some of Obsidian's advanced scripting capabilities that some plugins expose.

[^2]: I'd be remiss not to note that this itself is an evolution of Emacs's now 40-year-old configuration-over-convention philosophy that leads some to refer to Emacs more as an "editor toolkit", or joke that Emacs is "a great operating system that just needs a good text editor." ([HN source](https://news.ycombinator.com/item?id=7978048), but you can find this sentiment all over.)

Obsidian is fully based on local Markdown files. While there's some non-standard syntax for internal links, its emphasis on such a universal format makes it extremely easy for plugins to work together and for Obsidian to interop with external tools. All plugins read and write to Markdown files. If you want to sync your Obsidian vault with some third-party service, just write a script to pull down data from an API and write it to Markdown files. It'll show up in your Vault when you open it next. It's that easy! I've been able to do it to great success in my own setup.

### My Obsidian System

I'm pretty happy with the org-mode-inspired Obsidian workflow that I've built. Over the next week or two I'm planning on posting a series that goes into detail on parts of my workflow, explaining plugins and configuration as I go. These sorts of posts were really helpful to me when setting up my org-mode workflows originally, and I'm hoping to contribute to a similar ecosystem of workflows for Obsidian. Luckily, Obsidian is modular enough that you can grab only the parts that are exciting for yourself. I'll see you in the next post!
