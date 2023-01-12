---
title: "Task Management in Obsidian"
date: 2022-01-22T20:20:05-05:00
draft: false
tags: [obsidian, series, workflow, task-management]
description: "A walkthrough of how I manage my day-to-day tasks in Obsidian."
highlight: true
---

Obsidian is first and foremost a Markdown editor with first-class support for internal links between notes. But just because it wasn't built as a to-do app, doesn't mean it can't become one. Community plugins and external tools have made Obsidian work just as well for me as any task management app I've used in the past. As an added bonus, because I'm keeping notes about my day and what I'm reading, it's easy for me to keep tasks in the context of the thoughts that spawned them.

<!--more-->

Plugins:

- [Tasks](https://github.com/schemar/obsidian-tasks)
- [Advanced URI](https://github.com/Vinzent03/obsidian-advanced-uri)
- [Kanban](https://github.com/mgmeyers/obsidian-kanban)
- [Minimal Theme](https://github.com/kepano/obsidian-minimal)

External Tools:

- [Siri Shortcuts](https://apps.apple.com/us/app/shortcuts/id915249334)

## Agenda View

Like I mentioned in [Part Zero](https://davi.sh/blog/2022/01/obsidian-zero/), the first real productivity workflow that clicked for me was [Org Mode's agenda system](https://orgmode.org/manual/Agenda-Views.html). My tasks could stay in the context of the notes and project that spawned them in the first place, but could be collected together into a global to-do list on command by calling up the agenda buffer. I've tried to replicate this quite closely in Obsidian.

By default, Obsidian doesn't have any real organization for tasks beyond Markdown support for rendering checkboxes and a special [filter in the core Search plugin](https://help.obsidian.md/Plugins/Search#Search+operators). There's a handful of plugins that can help you collect tasks in a more global list, but I chose towards [Obsidian Tasks](https://github.com/schemar/obsidian-tasks) because of its custom query block. In any note, I can add a code block with the special type `tasks` and create an ad-hoc to-do list for tasks that satisfied a given query. Combining a few of these queries, I put together a central "Agenda Note" that contains my entire to-do list, at a glance. This is what it looks like right now:

![](/blog/images/obsidian-agenda.png)

<details>
<summary>
And you can click here to reveal the full source code.
</summary>

````markdown
### Overdue

```tasks
not done
due before today
```

### Due today

```tasks
not done
due today
```

### Due in the next two weeks

```tasks
not done
due after today
due before in two weeks
```

### No due date

```tasks
not done
no due date
```

### Done today

```tasks
done today
```
````

All in all, pretty easy to understand! The queries look very close to natural language.

</details>

I also give myself a view of where I stand on tasks that are important for today in each daily note. I'll dive deeper into my daily notes next time, but here's a snippet from that template:

````markdown
## To Do

```tasks
not done
due before {{date}}
```

```tasks
due on {{date}}
```
````

These two queries let me see everything I should handle today: overdue tasks "roll over" automatically from previous days. I also keep a record of tasks done on each specific day in my daily notes, as an automated part of my journal.

### Capturing Tasks

Viewing and managing existing tasks is only half the picture. I want to be able to capture tasks when they come into my head so I don't have to keep focusing on them as my day continues around me. My catch-all location for new tasks is in my daily note. Obsidian Tasks has a command shortcut for creating a new task, with a nice modal that lets me enter due dates similar to Todoist. As a lightweight replacement for [org-habit](https://orgmode.org/manual/Tracking-your-habits.html), I keep repeating tasks in their own notes so I can track how often I complete them. I also will add tasks that relate to specific topics directly in-line to notes, relying on my agenda queries to slurp them up properly and link back to the context that I in which created them.

When I'm on my computer or actively using Obsidian on mobile, this works great. But <a href='{{< relref "digital-mindfulness.md" >}}'>I'm actively trying to spend less time idly on my devices</a>. There's lots of moments where I've realized I need to capture a task but I'm not actively using Obsidian. What then?

### Siri Shortcuts

I've never used Siri Shortcuts before, but [pawalt](https://pawa.lt) shared a shortcut with me that takes text input (or voice input from Siri) and appends it to a file in his vault. Here's my slightly modified version:

![](/blog/images/obsidian-shortcut-source.jpg)

It works beyond perfectly in tandem with Obsidian Tasks, since I can add mobile tasks to the same note and they'll still be collected with everything else in the agenda view. "Everything is a file", so the Obsidian developers didn't need to write any particular integrations with Shortcuts. The shortcut just edits a file on disk, and Obsidian reads the file as it normally would, interoperating seamlessly without even knowing it.

This shortcut inspired me to go one step further. It's a small hastle, but a hastle nonetheless to always have to navigate back to my Agenda note from another part of the app when I want to see my tasks on mobile. If I was using a dedicated to-do app like Reminders or Todoist, I would always be in the task-management view, since it's the only thing those apps do.

Obsidian has a pretty easy way to create bookmarks and shortcuts to notes from outside of the app through [Obsidian URI support](https://help.obsidian.md/Advanced+topics/Using+obsidian+URI). And using the [Advanced URI plugin](https://github.com/Vinzent03/obsidian-advanced-uri), I can create a bookmark that will always open my Agenda view in preview mode rather than edit mode. I'm sure there's multiple ways to add bookmarks to the homescreen, but I just created a one-action Shortcut to open `obsidian://advanced-uri?filename=Agenda&viewmode=preview`, and iOS and Obsidian handle the rest. I have my two new shortcuts on my homescreen, and they look and work almost as seamlessly as if they were native apps.

![](/blog/images/obsidian-shortcuts.jpg)

These shortcuts were a real "holy shit" moment for me as I was building out my personal workflows. I certainly didn't expect iOS, which is notoriously difficult to customize, to be able to support these kinds of custom actions and integrations with Obsidian. It's opened my eyes to what Siri Shortcuts can do. iOS doesn't let me edit the system's crontab and set a Python script to run every four hours. However, Shortcuts _does_ let me create a "Personal Automation" to run a shortcut that I write every weekday at 8am, or every time I enter or leave a geofenced area. I'll certainly be thinking more about what I can do with Shortcuts going forward.

### Kanban View

I wanted to give an honorable mention to the [Obsidian Kanban](https://github.com/mgmeyers/obsidian-kanban) plugin. Trello never worked for me as a general task management system, but I've found that kanban boards do have their place in my workflow for personal project management. I'm currently working on a [video game](https://github.com/davish/rogue-asteroids) in my spare time. Having a board to keep track of my ideas has been a great way to organize my thoughts and the direction I want to take the game. I created another board to track article ideas through the writing process for this blog, too. And like everything in Obsidian, the plugin stores all the data as readable, plaintext Markdown files.

### Wrapping up

And that's the first part of my Obsidian workflow! Even if none of this feels like it clicked for you personally, I hope you learned something about Shortcuts, automation, or a new Obsidian plugin. And I hope to catch you in the next part of the series!
