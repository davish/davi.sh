---
title: Configuring VSCode with Nix
date: 2024-11-24
tags: [nix, vscode, nix-on-mac, editors]
draft: false
---

Welcome back to the Nix on Mac series! By the end of this post, you'll be able to fully
configure VSCode through your Nix flake via `home-manager`, which we set up in [part
2](/blog/2024/02/nix-home-manager/). This includes:

- Custom keybindings and settings
- Installing themes and extensions from nixpkgs and directly from the VSCode Marketplace
- Properly aliasing VSCode and other macOS applications to `/Applications` for Spotlight

Without further ado, let's dive in!

<!--more-->

## Installing VSCode

VSCode is not free software. Nix requires you to opt-in before installing nonfree
software. Add this line to your `nix-darwin` `configuration` module:

```nix
configuration = { pkgs, ... }: {
    # ...
    
    nixpkgs.config.allowUnfree = true;
    
    # ...
};
```

After that, installing VSCode is basically one line of code in our `home-manager` config:

```nix
homeconfig = { pkgs, ... }: {
    programs.vscode = {
        enable = true;
    };
};
```

I'm sure many of you are following along with this series using VSCode to edit your
`flake.nix` file. Before we call `switch`, I should note that installing VSCode through
home-manager will likely blow away your existing VSCode settings. Now would be a good time
to back up any existing settings the list of extensions you have installed so you can
replicate your existing setup from within Nix.

Once you run `switch`, `VSCode` will be installed in `/Users/$USER/Applications/Home
Manager Apps/` [^1]. If you've previously installed VSCode, go ahead and dump the copy
inside `/Applications` in the trash.

[^1]: Notably, this isn't inside the normal `/Applications` folder. `home-manager` can
    only install programs under your home directory. Keep reading till the end to find out
    how to get applications in the normal, macOS-expected location!

## Editor Settings and Keybindings

You can add user settings and keybindings, which normally live in `.vscode/settings.json`
and `.vscode/keybindings.json` respecively, pretty easily:

```nix
programs.vscode = {
    enable = true;

    userSettings = {
        # This property will be used to generate settings.json:
        # https://code.visualstudio.com/docs/getstarted/settings#_settingsjson
        "editor.formatOnSave" = true;
    };
    keybindings = [
        # See https://code.visualstudio.com/docs/getstarted/keybindings#_advanced-customization
        {
            key = "shift+cmd+j";
            command = "workbench.action.focusActiveEditorGroup";
            when = "terminalFocus";
        }
    ];
};
```

It almost looks like JSON! And in fact, converting Nix types to JSON is [part of the Nix
standard
library](https://nixos.org/manual/nix/stable/language/builtins.html#builtins-toJSON).

## Extensions

A huge part of VSCode is the bountiful extension ecosystem. home-manager lets you install
many extensions from nixpks directly, and gives you a way to install any other ones from
the marketplace directly.

### From nixpkgs

We'll start off with two extensions and a theme. To figure out which extensions and themes
are available ready-to-go from nixpkgs, you can search for the [`vscode-extensions`
package set on nixpkgs
search](https://search.nixos.org/packages?channel=24.05&from=0&size=50&buckets=%7B%22package_attr_set%22%3A%5B%22vscode-extensions%22%5D%2C%22package_license_set%22%3A%5B%5D%2C%22package_maintainers_set%22%3A%5B%5D%2C%22package_platforms%22%3A%5B%5D%7D&sort=relevance&type=packages&query=vscode-extensions).

* [The Nix language
  plugin](https://marketplace.visualstudio.com/items?itemName=bbenoist.Nix) for syntax
  highlighting
* [VSCode Vim](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim) for vim
  keybindings. Definitely skip this if you don't use vim!
* [The Dracula
  theme](https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula). Feel
  free to replace with your preferred theme, this one is just an example.

```nix
programs.vscode {
    # ...
    
    userSettings = {
        "editor.formatOnSave" = true;
        "workbench.colorTheme" = "Dracula";
    };
    
    # ...

    extensions = with pkgs.vscode-extensions; [
        bbenoist.nix
        dracula-theme.theme-dracula
        vscodevim.vim
    ]
}
```

Some extensions require you to reload VSCode after installing. Unlike VSCode's normall
installation flow, VSCode will not tell you to reload after `switch` is called. In general
it's good practice to just always restart VSCode after running `switch` where you adjusted
the `extensions` set.

### From the VSCode Marketplace

Not every extension has been pre-built for Nix. Nixpkgs also exposes a function to
download and build any extension directly from the VSCode Marketplace.

For our example here, we'll be installing
[`nixpkgs-fmt`](https://marketplace.visualstudio.com/items?itemName=B4dM4n.nixpkgs-fmt),
which will let us auto-format our Nix code when we save a `.nix` file. The extension also
requires `nixpkgs-fmt` to be in our `PATH`, so let's add `nixpkgs-fmt` to our list of
installed packages too:

```nix
homeconfig = { pkgs, ... }: {
    # ...

    home.packages = with pkgs; [ nixpkgs-fmt ];
    
    # ...

    programs.vscode {
        # ...

        extensions = with pkgs.vscode-extensions; [
            bbenoist.nix
            dracula-theme.theme-dracula
            vscodevim.vim
        ] ++ pkgs.vscode-utils.extensionsFromVscodeMarketplace [
            {
              name = "nixpkgs-fmt";
              publisher = "b4dm4n";
              version = "0.0.1";
              sha256 = "bf3da4537e81d7190b722d90c0ba65fd204485f49696d203275afb4a8ac772bf";
            }
        ]
    }
}
```

Run `switch` again, restart VSCode, and your `nix.flake` should format itself nicely
whenever you save.

#### Computing extension checksums
Whoa, where did that hash come from? It's a checksum of one of the extension's metadata
file. We can download that file from `vsassets.io` and grab its checksum:

```bash
$ curl https://b4dm4n.gallery.vsassets.io/_apis/public/gallery/publisher/b4dm4n/extension/nixpkgs-fmt/0.0.1/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage | sha256sum
% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3889  100  3889    0     0  10803      0 --:--:-- --:--:-- --:--:-- 10832
bf3da4537e81d7190b722d90c0ba65fd204485f49696d203275afb4a8ac772bf  -
```

It would be pretty gross if you needed to remember this every time. We can add it as a
shell function to our zsh config:

```nix

home.packages = with pkgs; [
    nixpkgs-fmt
    coreutils-full
];

programs.zsh = {
    # ...

    envExtra = ''
        function vscode-hash() {
            if [ "$#" -ne 3 ]; then
            echo "Error: This function requires exactly 3 arguments"
            echo "Usage: $0 <PUBLISHER> <NAME> <VERSION>"
            return 1
            fi
            publisher=$1
            name=$2
            version=$3
            url="https://$publisher.gallery.vsassets.io/_apis/public/gallery/publisher/$publisher/extension/$name/$version/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage"
            curl $url | sha256sum
    }'';
};
```

## Playing nice with Spotlight

You might have noticed that the version of VSCode that Nix installs doesn't show up in
Spotlight. Why is that? It's unfortunately pretty simple: Every artifact that Nix and
home-manager add to your system is a symlink, and Spotlight doesn't pick up
symlinks. There's a very long thread about this [on
GitHub](https://github.com/nix-community/home-manager/issues/1341) if you're interested in
reading, but the tl;dr is that [`max-app-util`](https://github.com/hraban/mac-app-util) is
the easiest way to set this up.

We can add it as another input at the top of our flake, and then our final darwin
configuration to load mac-app-util in both nix-darwin and home-manager:

```nix
{
    description = "My system configuration";
    inputs = {
        # ...
        mac-app-util.url = "github:hraban/mac-app-util";
    };

    # ...
    
    {
      darwinConfigurations."$HOSTNAME" = nix-darwin.lib.darwinSystem {
        modules = [
          # ...
          mac-app-util.darwinModules.default # <-- new
          home-manager.darwinModules.home-manager
          {
            # ...
            home-manager.sharedModules = [
                mac-app-util.homeManagerModules.default
            ];
            # ...
          }
        ];
      };
    }
}
```

After running `switch`, our apps should be properly copied to
`/Users/$USER/Applications/Home Manager Trampolines` and should get picked up the next
time Spotlight refreshes.

### Stepping Back

We just included someone's third-party nix utility in our flake to do some custom behavior
with mac apps. You probably didn't notice that `mac-app-util` *is written in Common
Lisp*. I've never written Common Lisp, and my guess is you probably haven't either. Even
so, with just three lines of code we were able make use of some code that someone wrote in
their favorite niche programming language without needing to figure out how to build or
run that code. Nix handled it all for us! I, for one, think that's pretty amazing.

## Conclusion

Our flake is now able to fully configure and manage VSCode, including installing
extensions and themes. What's exciting is that home-manager has just as deep an
integration with many other utilities. If you haven't already definitely go through and
check out [home-manager's config
options](https://nix-community.github.io/home-manager/options.xhtml) to find out what you
can do with your favorite program.

You can find the full flake configuration for this installment on GitHub
[here](https://github.com/davish/nix-on-mac/tree/part-3). See you in the next one!

