---
title: "freeport"
published: 2023-04-22T09:54:46Z
tag: "Bash"
description: "Kill a process that's hogging a port on MacOS"
---

Every once in a while, a development server on my laptop gets stuck open when the terminal that spawned it has already closed. I normally have to take 5 minutes or so to search through StackOverflow to find out how to kill the process that's hogging up that port, so I finally made a script for it:

```sh
#!/bin/sh

if [ $# -eq 0 ]; then
    echo "usage: $0 <port number>"
    exit 1
fi

lsof -t -i tcp:"$1" | xargs kill -9
```

You can also just copy/paste the last line and replace `$1` with the port number in question, if bash scripts aren't your thing.