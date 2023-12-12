---
title: What I Like About Nix
date: 2023-12-11
tags:
  - nix
description: ""
draft: false
---
I got an M2 Pro Mac Mini recently, and decided to take the plunge setting it up with Nix. I've only scratched the surface of what Nix can do, using it almost exclusively for system configuration through [`home-manager`](https://github.com/nix-community/home-manager) and [`nix-darwin`](https://github.com/LnL7/nix-darwin) rather than anything to do with development environments or production artifacts. Even still I've been having a lot of fun with it so far. [I wrote up a snippet](https://davi.sh/til/nix/nix-macos-setup/) on how I set everything up, but in this post I wanted to focus more on my subjective impression of Nix so far and why I've been enjoying it.

## Long-term and shared memory
No need to worry about remembering what switch you fipped in settings or what command you ran in a shell. Any change you've made to, for example, [hide the dock by default](https://github.com/davish/setup/blob/main/darwin/default.nix#L46) or allow for repeating keys in [VSCode and other editors](https://github.com/davish/setup/blob/main/darwin/default.nix#L48-L49) is there for later review.

On macOS, these system preferences are normally either configured in a point-and-click interface or, for more hidden settings, specified in loosely documented `defaults write` invocations that you can find all over the internet. [`nix-darwin`](https://github.com/LnL7/nix-darwin) is a Nix tool that lets you configure virtually all of these settings from a Nix file. Making your own configuration declarative is good enough, but on top of that, people have built up modules and abstractions around more complex configuration that you can enable with a single boolean flag.
## A complete picture of your setup
All of my dotfiles, themes, and extensions are defined in a single repository. It makes it a lot easier to see how it all interacts with each other, and hopefully avoid situations where different dependencies conflict. No one wants to end up here, but it happens all too often:

![xkcd comic describing a chaotic python environment](https://imgs.xkcd.com/comics/python_environment.png)

## Synchronization between machines
I have a desktop and a laptop. They're now running virtually the same Nix configuration, out of the same repository, with a few tweaks in host-specific overrides. I can work out the kinks in getting Emacs to play nicely with the [Yabai window manager](https://github.com/koekeishiya/yabai) on my desktop, and have it all work on my laptop in a matter of minutes once I pull down the updated configuration repository and reload my Nix environment.
## Reducing manual toil
I've used [Karabiner Elements](https://karabiner-elements.pqrs.org/) for years to remap some keys on my keyboard. More recently I've moved my configuration over to [Goku](https://github.com/yqrashawn/GokuRakuJoudo), a DSL for Karabiner on top of the JSON configuration format. Every time I wanted to change my configuration I would need to remember to run the `goku` command. Now, that command is run automatically by [`home-manager`](https://github.com/nix-community/home-manager)  whenever my `karabiner.edn` file changes. When I change my `skhd` or `yabai` configuration, my Nix will automatically restart those services so they pick up their new settings.

Standardizing the refreshing all configuration to a single command (`darwin-rebuild switch`) and running everything only when it's needed has been a small change that's made me a lot more comfortable setting up more subsystems that would otherwise require some level of babysitting.
