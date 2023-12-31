---
title: Nix on Mac from Scratch, Part 1
date: 2024-01-01T05:00:00
tags: [nix, series-nix-mac]
description: Setting up nix-darwin
draft: false
---

[I think Nix is really cool](https://davi.sh/blog/2023/12/what-i-like-about-nix/). Unfortunately,
the resources for getting started can be difficult to find and apply to different
use-cases. Inspired by [Arne Bahlo's Emacs from Scratch
series](https://arne.me/articles/emacs-from-scratch-part-one-foundations), I wanted to create a
guide to help folks get started with Nix on macOS.

The series is intended to be incremental.

By the end of Part 1, you'll have Nix installed on your system and be able to declaratively install
system packages from either Nixpkgs or Homebrew.

## Installing Nix
I recommend using the Determinate Systems Nix installer. They have a [command-line
utility](https://github.com/DeterminateSystems/nix-installer) and also recently came out with a
[graphical installer](https://determinate.systems/posts/graphical-nix-installer) if you prefer that.

## Installing nix-darwin
[`nix-darwin`](https://github.com/LnL7/nix-darwin) is a Nix library that exposes tons of
configuration options for macOS. Nix is a programming language, and Nix configurations are programs.
All programs need an entrypoint, we'll be using a flake[^1] to provide the entrypoint to our configuration.

[^1]: Since this series will focus on system configuration rather than development environments,
    we'll only be creating this one flake and won't be modifying it very often. If want to read more
    about flakes, feel free to check out [Julia Evans's blog post on
    flakes](https://jvns.ca/blog/2023/11/11/notes-on-nix-flakes/) and the [Zero to Nix wiki
    page](https://zero-to-nix.com/concepts/flakes).

## Adding your first package

## Additional configuration ##

### Touch ID for `sudo` ###
