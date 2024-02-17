---
title: Managing dotfiles with Nix on macOS
date: 2024-02-08
tags: [nix, nix-on-mac]
draft: true
---

In part one of this series, we installed Nix, set up our system configuration with
`nix-darwin`, and installed some packages at the system level. In this post, we'll set up
`home-manager`, another library of Nix configuration options. Unlike `nix-darwin`,
home-manager is cross-platform: it works across NixOS, macOS, and anywhere else Nix can be
installed. It was a difficult for me to understand how `home-manager` and `nix-darwin`
should interact at first. While there is definitely overlap with what these two Nix
libraries can do (they can both install packages from Nixpkgs and make them available in
your PATH), `nix-darwin` is used for managing system-wide settings and applications. It
can be thought of as bringing lots of the power of NixOS directly to the
Mac. `home-manager`, on the other hand, is most useful for managing user-level
configuration and dotfiles.

In this post, we'll install `home-manager`, and use it to set up configuration for `vim`,
`zsh`, and `git`.

## Install `home-manager`

`home-manager` will be another input to our flake. In our `inputs` attribute, add
`home-manager` under `nix-darwin` in your `flake.nix`:

```nix
{
    description = "My system configuration";
    inputs = {
        nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
        nix-darwin = {
            url = "github:LnL7/nix-darwin";
            inputs.nixpkgs.follows = "nixpkgs";
        };
        home-manager = {
            url = "github:nix-community/home-manager";
            inputs.nixpkgs.follows = "nixpkgs";
        };
    };
    # ...
```

We will then add the minimal home-manager config as another module under `configuration`:

```nix
# ...
    outputs = inputs@{ self, nixpkgs, nix-darwin, home-manager }:
    let
        configuration = {pkgs, ... }: {
            # ... nix-darwin configuration remains unchanged here
        };
        homeconfig = {pkgs, ...}: {
            # this is internal compatibility configuration for home-manager,
            # don't change this!
            home.stateVersion = "23.05";
            # Let home-manager install and manage itself.
            programs.home-manager.enable = true;

            home.packages = with pkgs; [];

            home.sessionVariables = {
                EDITOR = "vim";
            };
        };
    in
    {
    darwinConfigurations."$HOSTNAME" = nix-darwin.lib.darwinSystem {
        modules = [
            configuration
            home-manager.darwinModules.home-manager  {
                home-manager.useGlobalPkgs = true;
                home-manager.useUserPackages = true;
                home-manager.verbose = true;
                home-manager.users.$USER = homeconfig;
            }
        ];
    };
  };
}
```

Our `darwinSystem` setup now includes another module that bridges together `home-manager`
and `nix-darwin`. Remember to replace `$USER` with your system user!

Run `darwin-rebuild switch --flake ~/.config/nix` to ensure everything is set up
correctly. This minimal config doesn't do anything yet. Let's change that.

## Manage `.vimrc`

Let's manage our first dotfile! First, we'll create a new file in our repository:

```bash
$ cd ~/.config/nix
$ echo "set number" > vim_configuration
$ git add vim_configuration
```

Since this isn't a `vim` configuration series, we'll just have a small config that will
demonstrate how `home-manager` manages dotfiles. After this configuration is applied, you
should be able to see line numbers when running `vim`.

Inside our `homeconfig` block, add this line:

```nix
home.file.".vimrc".source = ./vim_configuration;
```

Once you run `darwin-rebuild switch --flake ~/.config/nix`, run `vim
~/.config/nix/flake.nix`. You should see line numbers in the left gutter. Not the most
exciting change, but we've configured an application using `home-manager`!

I'd like to pause here for now to explain a few subtleties in the Nix languages that this
one line has introduced us to.

### Paths

In most languages, paths are represented as strings. In Nix, [Paths are first class
primitive values](https://nixos.org/manual/nix/stable/language/values#type-path). You'll
run into type errors if you try passing strings where paths are expected.

### Setting attributes in Nix

[Attribute sets](https://nixos.org/manual/nix/stable/language/values#attribute-set) are
probably the most ubiquitious datatype in Nix. They're the Nix equivalent of dictionaries
in other languages. Something that's pretty unique to nix is that nested attributes are
supported with some clever syntactic sugar. Desugaring our vim dotfile line above, we
would get:

```nix
home = {
    file = {
        ".vimrc" = {
            source = ./vim_configuration;
        };
    };
};
```

This shorthand is useful when our attribute sets are sparse, and they can be combined with
the "full" attribute set literal anywhere along the path. If we had two dotfiles, we could
write it in either of these two ways:

```nix
home.file.".vimrc".source = ./vim_configuration;
home.file.".bashrc".source = ./bash_configuration;

# OR:

home.file = {
    ".vimrc".source = ./vim_configuration;
    ".bashrc".source = ./bash_configuration;
};
```

Besides `source`, there are other options to pass to dotfiles, like `onChange` and
`recursive`. See the [home-manager
documentation](https://nix-community.github.io/home-manager/options.xhtml#opt-home.file)
for more defails.

## Configure `zsh`

You're probably getting tired of typing out or copy-pasting `darwin-rebuild switch --flake
~/.config/nix` all the time. Let's change that by adding a zsh alias! We could create a
`zsh_configuration` file and use `home.file.".zshrc"` to symlink it to the right
spot. Instead, though, I want to demonstrate how to use some of the built-in configuration
that `home-manager` comes with. Inside our `homeconfig` block, add the following:

```nix
programs.zsh = {
    enable = true;
    shellAliases = {
        switch = "darwin-rebuild switch --flake ~/.config/nix";
    };
};
```

After running `darwin-rebuild switch --flake ~/.config/nix` for the last time, you'll be
able to just run `switch` from now on.

When `programs.zsh.enable` is `true`, `home-manager` will use this attribute set to
generate a `.zshrc` for you.

# Configure `git`

There's some common git While we're here, let's add another stanza for configuring
`git`. Make sure to fill out

```nix
programs.git = {
    enable = true;
    userName = "$FIRSTNAME $LASTNAME";
    userEmail = "me@example.com";
    ignores = [ ".DS_Store" ];
    extraConfig = {
        init.defaultBranch = "main";
        push.autoSetupRemote = true;
    };
};
```

## Installing packages with `home-manager` vs `nix-darwin`

TODO: Write this section before publishing! tl;dr is you should prefer home-manager
because it is cross-platform. Anything mac-specific should stay in nix-darwin config.

## Conclusion

It's really a matter of preference when you'd rather use home-manager's provided DSLs for
configuring your apps and when you'd rather just write dotfiles and sync them to the right
spot. Feel free to explore the [home-manager configuration
options](https://nix-community.github.io/home-manager/options.xhtml#opt-home.file) to see
what's possible!
