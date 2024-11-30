---
title: nix flake update
published: 2024-11-30
category: Nix
description: "Updating dependencies of a Nix flake"
---

I just realized today that I haven't updated VSCode on my Mac in almost a year. It turns
out that if you install any other program through Nix, its version is determined by the
version of nixpkgs in your `flake.lock` file.

To update nixpkgs and get newer versions of all your programs, `cd` into the directory
with your flake and run `nix flake update`. It's the `pacman -Syu` of nix!
