---
title: "Configuring VSCode as a Keyboard-Centric IDE"
date: 2023-01-24
draft: false
tags: ["vscode", "emacs", "texteditors", "configuration"]
description: "Playing VSCode like a Maestro"
---

One of my first posts on this blog in 2020 was about [my experience switching from VSCode to Emacs](https://davi.sh/blog/2020/03/switching-to-emacs/) for all of my text/code editing work. I still agree with all of the benefits to Emacs I wrote about back then, and [my posts on Obsidian](https://davi.sh/blog/2022/01/obsidian-zero/) show my respect for `org-mode` as a format and the ecosystem around it – especially `org-agenda`. However, as you might have noticed when the file extension on my posts switched from `.org` back to `.md`, I've moved on from Emacs for now. But I'm proud of how I've moved my good habits back to VSCode.

At work, I'm always editing code while SSH'd into a remote machine. [TRAMP](https://www.gnu.org/software/tramp/) with [`lsp-mode`](https://github.com/emacs-lsp/lsp-mode) on a [very large C++ codebase](https://github.com/mongodb/mongo) just had too much lag for me. Even accessing Emacs compiled with native-comp running on my remote machine had way too much input delay when waiting on responses from [clangd](https://clangd.llvm.org) or [ccls](https://github.com/MaskRay/ccls), two C++ language servers. Now, it's more than possible I was [holding it wrong](https://www.wired.com/2010/06/iphone-4-holding-it-wrong/) – I do have colleagues that work all day in Emacs.  But it seems like my bad UX experience was due to the [limitations of Emacs's concurrency support](https://www.gnu.org/software/emacs/manual/html_node/elisp/Threads.html) – calls to language server were blocking other interactions with the UI. On the other side of the hedge, VSCode really just works. I can still type and otherwise interact with the editor while waiting for clangd to process a request. The [remote SSH extension](https://code.visualstudio.com/docs/remote/ssh) is the state of the art. The [clangd integration](https://marketplace.visualstudio.com/items?itemName=llvm-vs-code-extensions.vscode-clangd) was plug-and-play. And I've never experienced the lag that I was feeling every day on Emacs.

While I love the smoothness of the VSCode UI, I'm not a fan of how easy it is fall back on the mouse while using the editor. My favorite part of the [Doom Emacs](https://github.com/doomemacs/doomemacs) distribution was the keybindings: it made me feel like I was playing chords on the piano when I split panes and navigated around. While in my original Emacs post, I'd configured Emacs to look and feel like VSCode, I ultimately got rid of the project explorer and visual tabs to embrace more Emacs-y buffer and project management. By the time I moved back to VSCode, I found myself reaching for the mouse way more often than I was accustomed to, putting myself at risk for RSI and generally interrupting my flow. So I set out to make my VSCode configuration as close to my Doom Emacs setup as possible. I only had to make a few big changes:

- [VSpaceCode + WhichKey](https://vspacecode.github.io) plugins approximate the chords/leader bindings that Doom borrowed from [Spacemacs](https://www.spacemacs.org) really well. I've remapped a few bindings that were different in Doom, and I've added a few more as well.
- I disabled visual [Tabs](https://code.visualstudio.com/docs/getstarted/userinterface#_tabs). I use `<leader>-,` is what surfaces my most recently used "[editors](https://code.visualstudio.com/docs/getstarted/userinterface#_open-editors)" – VSCode's analog to buffers that normally map on to tabs in the UI.
	- This can be accomplished by adding `"workbench.editor.showTabs": false` to your `settings.json` file.
- I disabled the [Activity Bar](https://code.visualstudio.com/docs/getstarted/userinterface#_activity-bar). I can pull up sidebar Views like `File Explorer` and `Find in Files` with a shortcut, and dismiss them with cmd-B.
	- Add `"workbench.activityBar.visible": false` to your `settings.json`.

The fact that VSCode can do all this is a testament to its extensability and the power of a more limited but deep [plugin API](https://code.visualstudio.com/api). A `settings.json` file is no match for `init.el` when it comes to expressiveness, but I've still been able to mold VSCode into an editor that I feel at home using.


![Configured VSCode Screenshot](/blog/images/vscode-screenshot.png)

This is the first time that I've switched editors and carried over my own keybindings and styles rather than learning the new defaults that come with a new editor. It's definitely given me more confidence in my ability to configure software I use to my liking, and make software work for me rather than make me work for the software.

Emacs still has a place in my heart. The ecosystem that's grown up around it is amazing, expecially in the past few years, and I'm sure I'll keep playing around with it going forward. But the all-consuming nature of the Emacs philosophy – the idea that everything should happen inside Emacs, from email to web browsing to journaling – doesn't resonate with me in practice. I can use VSCode for most of my development, Obsidian for editing Markdown, and even PyCharm for Python/Django development (check out [intellimacs](https://github.com/MarcoIeni/intellimacs) for JetBrains IDEs if you're interested in my setup there). With just a few hours of set-up, I can use the right tool for the job and still feel at home regardless.
