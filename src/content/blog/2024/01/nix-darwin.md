---
title: Package management on macOS with nix-darwin
date: 2024-01-29
tags: [ nix, nix-on-mac ]
description: Nix on macOS from Scratch, Part One
draft: false
---

[I think Nix is really cool](https://davi.sh/blog/2023/12/what-i-like-about-nix/). It's most often
associated with NixOS, but `nix-darwin` makes it easy to declaratively manage macOS machines. Even
if you'll still relying on Homebrew for package management, I think Nix provides the best way to
store your Homebrew configuration. 

Unfortunately, the resources for getting started can be difficult to find and apply to different
use-cases. Inspired by [Arne Bahlo's Emacs from Scratch
series](https://arne.me/articles/emacs-from-scratch-part-one-foundations), I wanted to create a
guide to help folks get started with Nix on macOS.

Throughout this series we'll build up a Nix configuration piece-by-piece. By the end of Part 1,
you'll have Nix installed on your system and be able to declaratively install system-level packages
from either Nixpkgs or Homebrew.

<!--more-->

## Installing Nix
I recommend using the [Determinate
Systems](https://determinate.systems/posts/graphical-nix-installer) Nix installer. They have a
[command-line utility](https://github.com/DeterminateSystems/nix-installer) and also recently came
out with a [graphical installer](https://determinate.systems/posts/graphical-nix-installer) if you
prefer that.

## Setting up `nix-darwin`
[`nix-darwin`](https://github.com/LnL7/nix-darwin) is a Nix library that exposes lots of
configuration options for macOS.

Nix is a programming language, and Nix configurations are programs.  All programs need an
entrypoint, we'll be using a flake[^1] to provide the entrypoint to our configuration.

[^1]: Since this series will focus on system configuration rather than development environments,
    we'll only be creating this one flake and won't cover flakes in-depth. If want to read more about
    flakes, feel free to check out [Julia Evans's blog post on
    flakes](https://jvns.ca/blog/2023/11/11/notes-on-nix-flakes/) and the [Zero to Nix wiki
    page](https://zero-to-nix.com/concepts/flakes).
    

Here is our minimal flake that calls `nix-darwin`. Make sure to replace `$USER` with your username
and `$HOSTNAME` with your system's hostname.

You can place this flake in any directory you'd like. For the purposes of this series, we'll assume
that the flake lives at `~/.config/nix/flake.nix`.

```nix
# ~/.config/nix/flake.nix

{
  description = "My system configuration";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    nix-darwin = {
        url = "github:LnL7/nix-darwin";
        inputs.nixpkgs.follows = "nixpkgs";
    };
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
        };

        # Create /etc/zshrc that loads the nix-darwin environment. 
        programs.zsh.enable = true;

        environment.systemPackages = [ ];
    };
  in
  {
    darwinConfigurations."$HOSTNAME" = nix-darwin.lib.darwinSystem {
      modules = [ 
         configuration
      ];
    };
  };
}
```

## Activating our `nix-darwin` config
One of the stranger footguns when using nix flakes is that all files referenced by a flake must be
checked into source control. This means, that you'll need to have `git` installed before we set up
our Nix environment[^2]. Files don't need to be committed in order to be accessible by Nix flakes,
just staged, so `git add` is sufficient for now. You'll likely want to back your config up to a remote git repository eventually in order to sync your config to other machines, anyway.

[^2]: If you're on a brand new machine, the first time you run `git` in the terminal, you should be
    promped to install Xcode Command Line Tools, which includes `git`.

```bash
$ cd ~/.config/nix
$ git init
$ git add flake.nix
```

Once all this is set up, we can run `nix-darwin` and to activate our configuration:

```bash
$ nix run nix-darwin --extra-experimental-features nix-command --extra-experimental-features flakes -- switch --flake ~/.config/nix
```

Nix may error out if there are files that already exist at paths that Nix is trying to replace. Feel
free to either `rm` these or `mv` them to a backup location, and then re-run the line above.

Once the command succeeds, open up a new terminal window to pick up the new zsh environment, and
confirm that nix-darwin is installed on your path:

```bash
$ darwin-rebuild --help
darwin-rebuild [--help] {edit | switch | activate | build | check | changelog}
               [--list-generations] [{--profile-name | -p} name] [--rollback]
               [{--switch-generation | -G} generation] [--verbose...] [-v...]
               [-Q] [{--max-jobs | -j} number] [--cores number] [--dry-run]
               [--keep-going] [-k] [--keep-failed] [-K] [--fallback] [--show-trace]
               [-I path] [--option name value] [--arg name value] [--argstr name value]
               [--flake flake] [--update-input input flake] [--impure] [--recreate-lock-file]
               [--no-update-lock-file] [--refresh] ...
```

Congrats on setting up `nix-darwin`! Our configuration is active, but it doesn't do much yet. Let's
change that.

## Installing your first Nix package
It's time to install our first package from the nixpkgs repository. Update the list of 
`systemPackages` declared in `flake.nix`:

```nix
environment.systemPackages = [ pkgs.neofetch pkgs.vim ];
```

Here, we're setting the attribute `environment.systemPackages` to [a
list](https://nixos.org/manual/nix/stable/language/values#list). It's important to point out that
lists in Nix are space-separated, rather than comma-separated like many other languages.

To rebuild our Nix config, we don't have to use the super long `nix run` command from above. 
`nix-darwin` has added the `darwin-rebuild` command to our `PATH`, so from now on, we just need
to run:

```bash
$ darwin-rebuild switch --flake ~/.config/nix
```

Once this runs successfully, we now have a new command in our `PATH`:

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

Now we're really cooking! Feel free to check out [nixpkgs search](https://search.nixos.org/packages)
to find other packages you may want to install.

## Installing from Homebrew
Nixpkgs has a lot of programs, but some apps still only exist in Homebrew. `nix-darwin` provides
what I think is the best interface for Homebrew formulae, casks, and even Mac App Store apps. Let's
add this right under `environment.systemPackages`:

```nix
homebrew = {
    enable = true;
    # onActivation.cleanup = "uninstall";

    taps = [];
    brews = [ "cowsay" ];
    casks = [];
};
```

Running `darwin-rebuild switch --flake ~/.config/nix` again will install the Homebrew formula
specified in the `brews` list.

If you're migrating to Nix on a system where you've been using Homebrew for a while, you can run
`brew list` and `brew list --cask` to list your installed formulae and casks. Once you've added
every package you want to carry over, uncomment `onActivation.cleanup = "uninstall"`. With this
line, your homebrew config in `nix-darwin` will be *declarative*: only the packages specified in
your `flake.nix` will be installed, and if you ever remove a package from the lists here, it will be
uninstalled the next time you reload with `darwin-rebuild switch`.

## Additional configuration
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

All of `nix-darwin`'s options are worth exploring -- we'll go more in-depth into some of them in
future installments of this series, but in case you're curious, the you can explore all the
[configuration options](https://daiderd.com/nix-darwin/manual/index.html) and start making your
config your own!

If you'd like to see the full file that we've built up over the course of this post, you can find it
[here](https://raw.githubusercontent.com/davish/nix-on-mac/part-1/flake.nix).

Until next time!

