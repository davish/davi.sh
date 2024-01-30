---
title: Package management on macOS with nix-darwin
date: 2024-01-29
tags: [ nix, nix-on-mac ]
description: Nix on macOS from Scratch, Part One
draft: false
---

[I think Nix is really cool](https://davi.sh/blog/2023/12/what-i-like-about-nix/). Nix the package
manager and functional configuration language is most often associated with NixOS the Linux distro,
but `nix-darwin` makes it almost as easy to declaratively configure macOS as it is to configure
NixOS installations. Even if you'll still relying on Homebrew for package management and never touch
nixpkgs, I'd say that Nix with `nix-darwin` provides the best way to manage packages and system
configuration on macOS.

Unfortunately, the resources for getting started and integrating different parts of the Nix
ecosystem are not particularly approachable for beginners. When I started out I would often use
GitHub's code search to trawl through other people's configs and try different snippets until I
found what actually worked. Inspired by [Arne Bahlo's Emacs from Scratch
series](https://arne.me/articles/emacs-from-scratch-part-one-foundations), I wanted to create a
guide to help folks get started with Nix on macOS from scratch, step by step.

Throughout this series we'll create a declarative system configuration with Nix where you can
manage anything from your shell aliases to what VSCode extensions you have installed to running
daemons with launchd. We'll build up to this incrementally: by the end of this post, you'll have Nix
installed on your system and be able to declaratively install system-level packages from either
Nixpkgs or Homebrew.

<!--more-->

## Installing Nix
I recommend using the [Determinate
Systems](https://determinate.systems/) Nix installer. They have a
[command-line utility](https://github.com/DeterminateSystems/nix-installer) and also recently came
out with a [graphical installer](https://determinate.systems/posts/graphical-nix-installer) if you'd
prefer that.

## Setting up `nix-darwin`
[`nix-darwin`](https://github.com/LnL7/nix-darwin) is a Nix library that makes it easy to configure
macOS through Nix.

Nix is a programming language, and Nix configurations are programs.  All programs need an
entrypoint, we'll be using a flake[^1] to provide the entrypoint to our configuration.

[^1]: Since this series will focus on system configuration rather than development environments,
    we'll only be creating this one flake and won't cover flakes in-depth. If want to read more
    about flakes, feel free to check out [Julia Evans's blog post on
    flakes](https://jvns.ca/blog/2023/11/11/notes-on-nix-flakes/) and the [Zero to Nix wiki
    page](https://zero-to-nix.com/concepts/flakes).
    

Below is our minimal flake that calls `nix-darwin`. Make sure to replace `$USER` with your username
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
        # If you're on an Intel system, replace with "x86_64-darwin"
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
One of the stranger footguns when using Nix flakes is that all files referenced by a flake must be
checked into source control. This means that you'll need to have `git` installed before we set up
our Nix environment[^2]. Files just need to be staged to be accessible, not committed, so `git add`
is sufficient until you want to back up your config to a remote repository.

[^2]: If you're on a brand new machine, the first time you run `git` in the terminal you should be
    prompted to install Xcode Command Line Tools, which includes `git`.

```bash
$ cd ~/.config/nix
$ git init
$ git add flake.nix
```

Once all this is set up, we can run `nix-darwin` to activate our configuration:

```bash
$ nix run nix-darwin --extra-experimental-features nix-command --extra-experimental-features flakes -- switch --flake ~/.config/nix
```

`nix-darwin` requires `sudo`, so you'll be prompted for your password. Nix may error out if there
are files that already exist at paths that it's trying to replace. Feel free to either `rm` these or
`mv` them to a backup location, and then re-run the line above.

Once the command succeeds, open up a new terminal window to pick up the new zsh environment and
confirm that `darwin-rebuild` is installed on your path:

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

Congrats on setting up `nix-darwin`! Our configuration is active, but it doesn't do anything useful
yet. Let's change that.

## Installing your first Nix package
It's time to install our first package from the nixpkgs repository. Update the list of 
`systemPackages` declared in `flake.nix`:

```nix
environment.systemPackages = [ pkgs.neofetch pkgs.vim ];
```

Here, we're setting the attribute `environment.systemPackages` to a
[list](https://nixos.org/manual/nix/stable/language/values#list). It's important to point out that
**lists in Nix are space-separated** rather than comma-separated like most other languages. 

`pkgs` refers to `nixpkgs`, the standard repository for finding packages to be installed with
Nix[^4]. Both `neofetch` and `vim` are **_derivations_** within nixpkgs.

[^4]: While it's not necessary to fully understand this right now, the `configuration` value that
    we're defining is a [Nix module](https://nixos.wiki/wiki/NixOS_modules). The
    `nix-darwin.lib.darwinSystem` function that's called at the bottom of the file is responsible
    for passing `nixpkgs` through to `configuration` with the name `pkgs`. We'll dive deeper into
    Nix modules in a later post.

To rebuild our Nix config, we don't have to use the super long `nix run` command from above anymore
since `nix-darwin` added the `darwin-rebuild` command to our `PATH`. From now on, we just need
to run:

```bash
$ darwin-rebuild switch --flake ~/.config/nix
```

Once this runs successfully, we now have a new command in our `PATH`:

```bash
$ neofetch -L
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

## Searching Nixpkgs
Check out [nixpkgs search](https://search.nixos.org/packages) to find other packages you might want
to install.

## Installing packages from Homebrew
Nixpkgs is expansive, but some programs are still only available from
[Homebrew](https://brew.sh/). `nix-darwin` provides what I think is the best interface for Homebrew
formulae, casks, and even Mac App Store apps[^3]. Let's add this right under
`environment.systemPackages`:

[^3]: While we won't be installing any App Store apps in this post, you can check out the
    description in the [nix-darwin
    documentation](https://daiderd.com/nix-darwin/manual/index.html#opt-homebrew.masApps) for more
    information.

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
specified in the `brews` list. Try it out:

```bash
$ cowsay "homebrew and nix can be best friends"
 ______________________________________ 
< homebrew and nix can be best friends >
 -------------------------------------- 
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

If you're on a Mac where you've been using Homebrew for a while, you can run `brew list` and `brew list
--cask` to list your installed formulae and casks. Once you've added every package you want to carry
over to the corresponding lists in your Nix config, uncomment `onActivation.cleanup =
"uninstall"`. Your homebrew config in `nix-darwin` is now *declarative*: only the packages specified
in your `flake.nix` will be installed, and if you ever remove a package from the lists here it will
be uninstalled the next time you reload with `darwin-rebuild switch`.

## Nixpkgs vs Homebrew
While `nix-darwin` makes it easy to install packages with Homebrew, I'd recommend trying to find the
corresponding derivations within Nixpkgs when possible rather than relying solely on Homebrew
formulae. As the series goes on we'll see how native Nix derivations are easier work with in Nix.

## Additional configuration

You've probably gotten tired of entering your password everytime you reload your config. Luckily,
there's a one-liner to enable Touch ID for `sudo`, which you can put at the end of your
configuration:

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

All of `nix-darwin`'s configuration options are worth exploring -- we'll go more in-depth into some
of them in future installments of this series, but in case you're curious, the you can explore all
the [configuration options](https://daiderd.com/nix-darwin/manual/index.html) and start making your
config your own!

If you'd like to see the full file that we've built up over the course of this post, you can find it
[here](https://raw.githubusercontent.com/davish/nix-on-mac/part-1/flake.nix).

Now that we have a handle on our system configuration, in the next post we'll set up
[`home-manager`](https://github.com/nix-community/home-manager) and use it manage dotfiles and other
program configuration.

Until next time!

