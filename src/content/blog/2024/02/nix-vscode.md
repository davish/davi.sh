---
title: Configuring VSCode with Nix
date: 2024-02-15
tags: [ nix, vscode, nix-on-mac ]
description: Nix on macOS, Part Three
draft: true
---

Welcome back to *Nix on macOS*! In the previous installment we set up `home-manager` and used it to
configure `vim`, `git` and `zsh`. All three of these programs use pretty straightforward text-based
configuration. In Part Three, we'll tackle a much more complex beast: defining VSCode
configuration 100% declaratively. It seems like it should be difficult, but `home-manager` makes it
very straight forward! By the end of this post, you'll be able to:

1. Declare user settings
2. Add and modify keybindings
3. Install themes and extensions from `nixpkgs` and directly from the VSCode Extension Marketplace

Without further ado, let's jump right in!

## Install VSCode

VSCode may be mostly open source, but it's not free software. In order to install it from nixpkgs,
we'll need to explicitly allow unfree packages. Add this line to your `nix-darwin` `configuration`
block:

```
let
    configuration = {pkgs, ...}: {
        # ... 
        nixpkgs.config.allowUnfree = true;
        # ...
        };
    homeconfig = {pkgs, ...}: {
        # ...

        programs.vscode.enable = true;
    };
in
# ...

```

When you run `switch`, Nix should download vscode and install it in `~/Applications`.

TODO add a note about Spotlight, recommend Raycast.

## Add settings

## Install extensions

### From Nixpkgs

### From the Marketplace

## Conclusion
