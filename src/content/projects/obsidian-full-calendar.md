---
name: Obsidian Full Calendar
tags: [obsidian-full-calendar, obsidian]
description: Plugin for the PKM tool Obsidian with over 100,000 users.
date: 2022-02
details: true
---

### Summary

[Obsidian Full Calendar](https://github.com/davish/obsidian-full-calendar) integrates the [FullCalendar](https://fullcalendar.io) library with [Obsidian](https://obsidian.md) so that Obsidian users can manage their events and tasks from inside Obsidian. It's most popular event management plugin in the Obsidian ecosystem, with over 50,000 users. Its development takes place on GitHub.

### Motivation

Obsidian is built for extensibility. The core app is a rock-solid Markdown editor with built-in support for wikilink-style hyperlinks, with all other functionality built on top as plugins.

One of Obsidian's main value propositions is that all your data is stored in local Markdown files on your own machine. Plugin authors have taken advantage of this to use local Markdown and YAML frontmatter as the backend source-of-truth for a variety of tools, from Kanban to to-do lists to a PDF annotator, that normally require storing your data on a third-party server.

Obsidian is a productivity app. Keeping on top of your calendar and task due dates are a core part of most people's productivity. Obsidian Full Calendar came out of the desire to bring another part of the productivity story into Obsidian where calendar data can live in an open format, fully owned by end-users without any intermediary.

### Stack

- Typescript
- React
- Jest
- Ladle (Storybook-compatible component stories)
- fullcalendar.io
