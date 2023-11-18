---
title: Setting up Nix on macOS
published: 2023-11-17
category: Nix
description: Setting up a new Mac with Nix.
---

I recently got a new computer and am spending some time actually digging into Nix for managing dependencies. My main issue the last time I tried using Nix was how tough it was for me to wade through the documentation, so I was determined to try a different path this time. I started off with the very opinionated [Zero to Nix](https://zero-to-nix.com/start/install) tutorial series, which I thought was a great introduction.

After learning about Nix and Flakes, and getting my website building locally with a nix-powered development environment courtesy of the guidance in [Part 6](https://zero-to-nix.com/start/init-flake), the next step was to see what else I could do. I'd heard of two different tools, [`home-manager`](https://github.com/nix-community/home-manager) and [`nix-darwin`](https://github.com/LnL7/nix-darwin). I started off setting up `home-manager`, but I was confused on how I should be installing graphical applications like VS Code, and system utilities like Karabiner Elements. It turned out `nix-darwin` was the answer there.

To paraphrase a [Reddit thread I found](https://www.reddit.com/r/NixOS/comments/jznwne/effectively_combining_homemanager_and_nixdarwin/), `nix-darwin` manages system-level programs and configuration, while `home-manager` manages user configuration. You can actually get `nix-darwin` to call into `home-manager` as part of its own configuration to use both at the same time. This is described in the [`home-manager` reference docs](https://nix-community.github.io/home-manager/index.html#sec-install-nix-darwin-module), but like many Nix resources, it's not very simple for a beginner to figure out how to actually put this snippet to use in their own configuration.

Before following these instructions, you should follow the Zero to Nix guide or install Nix on your system in some other way.

I'm going to lay out the basic steps that I followed below while sharing each configuration file.

1. Create a nix-darwin flake file. From the [README](https://github.com/LnL7/nix-darwin/blob/b658dbd85a1c70a15759b470d7b88c0c95f497be/README.md#step-1-creating-flakenix):
```bash
mkdir -p ~/.config/nix
cd ~/.config/nix
nix flake init -t nix-darwin
sed -i '' "s/simple/$(scutil --get LocalHostName)/" flake.nix
```

The default flake puts the configuration inline to the flake.nix. I decided to copy/paste that configuration out into a separate file called `darwin.nix`:

```nix
# darwin.nix

{ pkgs, ... }: 

{
    # List packages installed in system profile. To search by name, run:
    # $ nix-env -qaP | grep wget
    environment.systemPackages =
    [ pkgs.vim ];

    # Auto upgrade nix package and the daemon service.
    services.nix-daemon.enable = true;
    services.karabiner-elements.enable = true;
    # nix.package = pkgs.nix;

    # Necessary for using flakes on this system.
    nix.settings.experimental-features = "nix-command flakes";

    # Create /etc/zshrc that loads the nix-darwin environment.
    programs.zsh.enable = true;  # default shell on catalina
    # programs.fish.enable = true;

    # Used for backwards compatibility, please read the changelog before changing.
    # $ darwin-rebuild changelog
    system.stateVersion = 4;

    # The platform the configuration will be used on.
    nixpkgs.hostPlatform = "aarch64-darwin";

    users.users.davish = {
        name = "davish";
        home = "/Users/davish";
    };
}
```

2. Modify `flake.nix` to work with `home-manager`.
The example code can be found [in the `home-manager` docs](https://nix-community.github.io/home-manager/index.html#sec-flakes-nix-darwin-module). In case that link breaks, here it is:

```nix
# flake.nix

{
  description = "Darwin configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    darwin.url = "github:lnl7/nix-darwin";
    darwin.inputs.nixpkgs.follows = "nixpkgs";
    home-manager.url = "github:nix-community/home-manager";
    home-manager.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = inputs@{ nixpkgs, home-manager, darwin, ... }: {
    darwinConfigurations = {
      hostname = darwin.lib.darwinSystem {
        system = "aarch64-darwin";
        modules = [
          ./configuration.nix
          home-manager.darwinModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.users.jdoe = import ./home.nix;

            # Optionally, use home-manager.extraSpecialArgs to pass
            # arguments to home.nix
          }
        ];
      };
    };
  };
}
```

4. Create a `home.nix` file. Here is the one that was generated when I tried to set up home-manager on its own. I'll replicate it here because the comments were useful as a tutorial on its own:

```nix
# home.nix

{ config, pkgs, ... }:

{
  # Home Manager needs a bit of information about you and the paths it should
  # manage.

  # This value determines the Home Manager release that your configuration is
  # compatible with. This helps avoid breakage when a new Home Manager release
  # introduces backwards incompatible changes.
  #
  # You should not change this value, even if you update Home Manager. If you do
  # want to update the value, then make sure to first check the Home Manager
  # release notes.
  home.stateVersion = "23.05"; # Please read the comment before changing.

  # The home.packages option allows you to install Nix packages into your
  # environment.
  home.packages = [
    # # Adds the 'hello' command to your environment. It prints a friendly
    # # "Hello, world!" when run.
    # pkgs.hello

    # # It is sometimes useful to fine-tune packages, for example, by applying
    # # overrides. You can do that directly here, just don't forget the
    # # parentheses. Maybe you want to install Nerd Fonts with a limited number of
    # # fonts?
    # (pkgs.nerdfonts.override { fonts = [ "FantasqueSansMono" ]; })

    # # You can also create simple shell scripts directly inside your
    # # configuration. For example, this adds a command 'my-hello' to your
    # # environment:
    # (pkgs.writeShellScriptBin "my-hello" ''
    #   echo "Hello, ${config.home.username}!"
    # '')
  ];

  # Home Manager is pretty good at managing dotfiles. The primary way to manage
  # plain files is through 'home.file'.
  home.file = {
    # # Building this configuration will create a copy of 'dotfiles/screenrc' in
    # # the Nix store. Activating the configuration will then make '~/.screenrc' a
    # # symlink to the Nix store copy.
    # ".screenrc".source = dotfiles/screenrc;

    # # You can also set the file content immediately.
    # ".gradle/gradle.properties".text = ''
    #   org.gradle.console=verbose
    #   org.gradle.daemon.idletimeout=3600000
    # '';
  };

  # You can also manage environment variables but you will have to manually
  # source
  #
  #  ~/.nix-profile/etc/profile.d/hm-session-vars.sh
  #
  # or
  #
  #  /etc/profiles/per-user/davish/etc/profile.d/hm-session-vars.sh
  #
  # if you don't want to manage your shell through Home Manager.
  home.sessionVariables = {
    # EDITOR = "emacs";
  };

  # Let Home Manager install and manage itself.
  programs.home-manager.enable = true;
}
```

And there you have it! You can now run `darwin-rebuild switch --flake ~/.config/nix` to rebuild all your configuration. Another useful link is the list of [nix-darwin configuration options](https://daiderd.com/nix-darwin/manual/index.html). I believe this is the best place to go for information on what can be configured with `nix-darwin`.