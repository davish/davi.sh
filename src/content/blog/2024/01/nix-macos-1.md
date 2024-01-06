---
title: Getting Started with Nix on macOS, Part 1
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

Throughout this series we'll build up a Nix configuration piece-by-piece. By the end of Part 1,
you'll have Nix installed on your system and be able to declaratively install system-level packages
from either Nixpkgs or Homebrew.

## Installing Nix
I recommend using the Determinate Systems Nix installer. They have a [command-line
utility](https://github.com/DeterminateSystems/nix-installer) and also recently came out with a
[graphical installer](https://determinate.systems/posts/graphical-nix-installer) if you prefer that.

## Installing nix-darwin
[`nix-darwin`](https://github.com/LnL7/nix-darwin) is a Nix library that exposes tons of
configuration options for macOS. It's a great starting point for dipping our toes into what Nix can do. 

Nix is a programming language, and Nix configurations are programs.
All programs need an entrypoint, we'll be using a flake[^1] to provide the entrypoint to our configuration.

[^1]: Since this series will focus on system configuration rather than development environments,
    we'll only be creating this one flake and won't cover them in-depth. If want to read more about
    flakes, feel free to check out [Julia Evans's blog post on
    flakes](https://jvns.ca/blog/2023/11/11/notes-on-nix-flakes/) and the [Zero to Nix wiki
    page](https://zero-to-nix.com/concepts/flakes).
    
Here is our minimal flake that calls `nix-darwin`. Make sure to replace `$USER` with your username
and `$HOSTNAME` with your system's hostname.
    
```nix
# ~/.config/nix/flake.nix
{
  description = "My Configuration";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    nix-darwin.url = "github:LnL7/nix-darwin";
    nix-darwin.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = inputs@{ self, nix-darwin, nixpkgs }:
  let
    configuration = {pkgs, ... }: {
        
        services.nix-daemon.enable = true;
        # Necessary for using flakes on this system.
        nix.settings.experimental-features = "nix-command flakes";
        
        system.configurationRevision = self.rev or self.dirtyRev or null;
        
        # Used for backwards compatibility. please read the changelog 
        # before changing: `darwin-rebuild changelog`.
        system.stateVersion = 4;
        
        # The platform the configuration will be used on.
        # If you're on an older system, replace with "x86_64-darwin"
        nixpkgs.hostPlatform = "aarch64-darwin"; 
        
        # Declare the user that will be running `nix-darwin`.
        users.users.$USER = {
            name = "$USER";
            home = "/Users/$USER";
        }
        
        # Create /etc/zshrc that loads the nix-darwin environment. 
        programs.zsh.enable = true;
        environment.systemPackages = [];
    };
  in
  {
    # Build darwin flake using:
    # $ darwin-rebuild build --flake .#davish-desktop
    darwinConfigurations."$HOSTNAME" = nix-darwin.lib.darwinSystem {
      modules = [ 
         configuration
      ];
    };
  };
}
```

## Adding your first Nix package

It's time to install our first package! Update the list of systemPackages declared in our flake:

```nix
environment.systemPackages = [ pkgs.neofetch ];
```

And run `switch` again. You should see `neofetch` being downloaded, and when `switch` finishes, it'll be callable:
```bash
$ neofetch
                    c.'
                 ,xNMM.
               .OMMMMo
               lMM"
     .;loddo:.  .olloddol;.
   cKMMMMMMMMMMNWMMMMMMMMMM0:
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.
 XMMMMMMMMMMMMMMMMMMMMMMMX.
;MMMMMMMMMMMMMMMMMMMMMMMM:
:MMMMMMMMMMMMMMMMMMMMMMMM:
.MMMMMMMMMMMMMMMMMMMMMMMMX.
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.
 'XMMMMMMMMMMMMMMMMMMMMMMMMMMk
  'XMMMMMMMMMMMMMMMMMMMMMMMMK.
    kMMMMMMMMMMMMMMMMMMMMMMd
     ;KMMMMMMMWXXWMMMMMMMk.
       "cooc*"    "*coo'"
```

Now we're really cooking!

## Installing from Homebrew
Nixpkgs has a lot of programs, but some apps still only exist in Homebrew. `nix-darwin` can invoke Homebrew for you and install tools, casks and apps directly!

```nix
environment.systemPackages = [ ... ];
# ^ insert after this line ^ 

homebrew = {
    taps = [];
    brews = [
        "cowsay"
    ];
    casks = [];
};
```

### Cleaning up one-off packages

You may notice if you start playing around with your configuration that if you remove a program from `homebrew.brews`, it won't be uninstalled. By default, `nix-darwin` plays nicely with any existing packages you have installed through Homebrew using the `brew` command-line interface. If you want to go "all-in" on describing your Homebrew installation with Nix, add this line to your config:

```nix
homebrew = {
    onActivation.cleanup = "uninstall"; # <- new line
    # [... existing config ...]
};
```

## Additional configuration ##

You've probably gotten tired of entering your password everytime you reload your config. Luckily, there's a one-liner to enable Touch ID for sudo, which you can put at the end of your configuration:
```nix
# ...
let
    configuration = {pkgs, ... }: {
        # ...
        security.pam.enableSudoTouchIdAuth = true;
    }; 
in
# ...
```

All of `nix-darwin`'s options are worth exploring -- we'll go more in-depth into some of them in future installments of this series, but in case you're curious, the documentation is [here](https://daiderd.com/nix-darwin/manual/index.html).

Until next time!

