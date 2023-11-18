---
title: nix develop -c $SHELL
published: 2023-11-18
category: Nix
description: "Run zsh with 'nix develop'"
---

I built my development flake with the [FlakeHub CLI](https://github.com/DeterminateSystems/fh). That flake uses [`pkgs.mkShell`](https://ryantm.github.io/nixpkgs/builders/special/mkshell/) to load in binary dependencies to the development environment. I run zsh defined and configured by Nix, so it was pretty jarring getting thrown into a plain bash shell when running `nix develop`. Luckily the fix is simple. Rather than just running `nix develop`, run:

```bash
nix develop -c $SHELL
```

and your normal shell will be run instead of the default bash shell.

[via [this discussion](https://discourse.nixos.org/t/using-nix-develop-opens-bash-instead-of-zsh/25075/2)]
