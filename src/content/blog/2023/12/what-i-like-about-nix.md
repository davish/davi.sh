---
title: What I Like About Nix
date: 2023-12-11T12:00:00
tags:
  - nix
description: Tell me I'm the only one
draft: false
---
I got a new computer recently and decided to take the plunge setting it up with Nix[^1].  [I wrote up a snippet](https://davi.sh/til/nix/nix-macos-setup/) on how I set everything up and you can find my whole configuration [on GitHub](https://github.com/davish/setup). I've only scratched the surface of what Nix can do – In this post I wanted to focus on my subjective impression of Nix so far and why I feel I've been enjoying it.

[^1]: Nix isn't the easiest thing to introduce since it can refer to a few different distinct components or the whole ecosystem. In case you haven't heard of Nix before or just want to learn more, I find [the conceptual documentation on Zero to Nix](https://zero-to-nix.com/concepts/nix) to be more approachable than the official docs.
## Long-term and shared memory
No need to worry about remembering what switch you flipped in settings six months ago after reading an OSXDaily.com post, or what command you ran in a shell at 3am the morning you unboxed your new computer. Any change you've made to, for example, [hide the dock by default](https://github.com/davish/setup/blob/main/darwin/default.nix#L46) or allow for repeating keys in [VSCode and other editors](https://github.com/davish/setup/blob/main/darwin/default.nix#L48-L49) is there for later review.

On macOS these system preferences are normally either configured in the point-and-click System Preferences interface or specified in loosely documented `defaults write` invocations that you can find all over the internet. [`nix-darwin`](https://github.com/LnL7/nix-darwin) is a Nix tool I'm using that lets you configure virtually all of these settings from a Nix file. 

Making your own configuration declarative is good enough, but on top of that people have built up modules and abstractions around more complex configuration like [enabling `sudo` to use TouchID](https://github.com/LnL7/nix-darwin/blob/4b9b83d5a92e8c1fbfd8eb27eda375908c11ec4d/modules/security/pam.nix) or [running daemons through launchd](https://github.com/LnL7/nix-darwin/tree/4b9b83d5a92e8c1fbfd8eb27eda375908c11ec4d/modules/services) that you can enable with a single line of code.
## A complete picture of your environment
All of my dotfiles, editor themes and extensions, and command-line programs are defined in a single repository. It makes it a lot easier to see how it all interacts with each other and hopefully avoid situations where different dependencies conflict. No one wants to end up here, but it happens all too often, at least to me:

![xkcd comic describing a chaotic python environment](https://imgs.xkcd.com/comics/python_environment.png)

## Synchronization between machines
I have a desktop and a laptop. They're now running virtually the same Nix configuration, out of the same repository, with a few tweaks in host-specific overrides. I can work out the kinks in getting Emacs to play nicely with the [Yabai window manager](https://github.com/koekeishiya/yabai) on my desktop and have it all work on my laptop in a matter of minutes once I pull down the updated configuration repository and reload my Nix environment.

I should mention these two machines are running different versions of macOS, and virtually everything has worked flawlessly across both.
## Reducing manual toil
I've used [Karabiner Elements](https://karabiner-elements.pqrs.org/) for years to remap some keys on my keyboard. More recently I've moved my configuration over to [Goku](https://github.com/yqrashawn/GokuRakuJoudo), a DSL for Karabiner on top of the JSON configuration format. Every time I wanted to change my configuration I would need to remember to run the `goku` command. Now that command is run automatically by [`home-manager`](https://github.com/nix-community/home-manager)  whenever my `karabiner.edn` file changes. When I change my `skhd` or `yabai` configuration, Nix will automatically restart those services so they pick up their new settings.

Standardizing the refreshing of all configuration to a single command (`darwin-rebuild switch`) and running everything only when it's needed has been a small change that's significantly reduced the cognitive load of having a lot of subsystems that may require new configuration, occasional restarts, or other babysitting from time-to-time.

## Conclusion
If the entirety of Nix was a DSL for a package manager and system configuration system I'd be satisfied. But there's so much more to Nix, from development environments to production artifacts. I'm excited to dive more into those corners of the ecosystem going forward, and hopefully write about it too both here on the blog and over on [the TIL page](https://davi.sh/til/)! 
