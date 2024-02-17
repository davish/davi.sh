---
title: Managing dotfiles with Nix on macOS
date: 2024-02-08
tags: [nix, nix-on-mac]
draft: false
---

In [part one](/blog/2024/01/nix-darwin/) of [this series](/blog/tags/nix-on-mac/) we
installed Nix, set up our system configuration with `nix-darwin`, and installed some
packages at the system level. In this post, we'll set up
[`home-manager`](https://github.com/nix-community/home-manager).

Unlike `nix-darwin`, home-manager is cross-platform: it works across NixOS, macOS, and
anywhere else Nix can be installed. It was difficult at first for me to understand how
`home-manager` and `nix-darwin` should interact. While there is definitely overlap with
what these two Nix libraries can do, `nix-darwin` is used for managing system-wide
settings and applications: it can be thought of as bringing lots of the power of NixOS
directly to the Mac. `home-manager`, on the other hand, is most useful for managing
user-level configuration and dotfiles.

In this post, we'll install `home-manager`, and use it to set up configuration for `vim`,
`zsh`, and `git`.

<!--more-->

## Install `home-manager`

`home-manager` will be another input to our flake. In our `inputs` attribute, add
`home-manager` under `nix-darwin` in `flake.nix`:

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
            # ... nix-darwin configuration from part 1 
            # remains unchanged here
        };
        homeconfig = {pkgs, ...}: {
            # this is internal compatibility configuration 
            # for home-manager, don't change this!
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
correctly.

## Managing `.vimrc`

Let's manage our first dotfile! First, we'll create a new file in our repository:

```bash
$ cd ~/.config/nix
$ echo "set number" > vim_configuration
$ git add vim_configuration
```

Since this isn't a `vim` configuration series, we'll just have a small config that will
demonstrate how `home-manager` manages dotfiles. After this configuration is applied, you
should be able to see line numbers when running `vim`.

Inside our `homeconfig` block before the closing `};`, add this line:

```nix
home.file.".vimrc".source = ./vim_configuration;
```

Once you run `darwin-rebuild switch --flake ~/.config/nix`, run `vim
~/.config/nix/flake.nix`. You should see line numbers in the left gutter. Not the most
exciting change, but we've configured an application using `home-manager`! You can exit
vim by hitting `ESC` followed by `:q!<enter>`.

This one line highlights a few subtleties of the Nix language. Let's dig in a bit before
moving on.

### Paths

In Nix, unlike most languages, [Paths are first class primitive
values](https://nixos.org/manual/nix/stable/language/values#type-path) that are not inside
of quotes and start with `./` for paths relative to the current file or `/` for absolute
paths. `./vim_configuration` points to the file that we created in the same directory as
`flake.nix`.

You'll run into type errors if you try passing strings to options where paths
are expected.

### Setting attributes in Nix

[Attribute sets](https://nixos.org/manual/nix/stable/language/values#attribute-set) are
probably the most ubiquitious datatype in Nix. They're the equivalent of dictionaries in
other languages. Something that's pretty unique to Nix is that setting nested attributes
are supported with some clever syntactic sugar. Desugaring our vim dotfile line above, we
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
home.file.".bash_profile".source = ./bash_configuration;

# OR:

home.file = {
    ".vimrc".source = ./vim_configuration;
    ".bash_profile".source = ./bash_configuration;
};
```

There are other options to pass to dotfiles besides `source` like `onChange` and
`recursive`. See the [home-manager
documentation](https://nix-community.github.io/home-manager/options.xhtml#opt-home.file)
for more details.

## Configure `zsh` with `programs.zsh`

You're probably getting tired of typing out or copy-pasting `darwin-rebuild switch --flake
~/.config/nix` all the time. Now, let's add a shell alias! Our fingers will thank us.

We could create a `zsh_configuration` file and use `home.file.".zshrc"` to symlink it to
the right spot. Instead, though, I want to demonstrate how to use some of the built-in
configuration that `home-manager` provides. Inside our `homeconfig` block, add the
following:

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
generate a `.zshrc` for you. If you already have a `.zshrc`, Nix will ask you to move the
file so it's not overwritten.

# Configure `git`

While we're here, let's add another stanza for configuring `git` with some common
options. Make sure to put in your real name and email address:

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

When should you prefer to install or configure something with home-manager versus
nix-darwin? This is really a matter of opinion, but it's important to keep in mind that
home-manager is cross-platform while nix-darwin is locked to macOS. I generally default to
using home-manager for configuring anything that is not macOS-specific. If you ever decide
to bring your config to a non-Mac system,

TODO: Write this section before publishing! tl;dr is you should prefer home-manager
because it is cross-platform. Anything mac-specific should stay in nix-darwin config.

## Conclusion

It's a matter of preference when you use home-manager's provided DSLs for configuring your
apps and when you'd rather just write dotfiles and sync them to the right spot. Feel free
to explore the [home-manager configuration
options](https://nix-community.github.io/home-manager/options.xhtml#opt-home.file) to see
what's possible!
