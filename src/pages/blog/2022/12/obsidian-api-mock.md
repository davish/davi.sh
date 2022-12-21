---
title: "Adventures with Mocking Obsidian's Markdown Parser"
date: 2022-12-20T12:00
draft: false
tags: ["obsidian", "typescript", "testing", "webdev", "obsidian-full-calendar", "airplane-articles"]
description: "Who writes tests for their test code?"
---

I've been working on a plugin for Obsidian called [Obsidian Full Calendar](https://github.com/davish/obsidian-full-calendar) on-and-off for the past 10 months or so. For most of that time the plugin has had zero unit tests, but I finally got around to changing that. Testing can be cumbersome – especially writing test mocks. I ended up pretty happy the little DSL I wrote for constructing mock file metadata that I wanted to share.

Tests are easiest when code doesn't have side effects since filesystems and network calls often aren't available in the environment the tests are running in. Obsidian's core code is closed-source and can only be run from inside the Electron app, so plugin developers who want test coverage aren't left with many options but to test their plugins completely outside of Obsidian. Unfortunately for me, my plugin is mostly a pile of glue sitting between [FullCalendar](https://fullcalendar.io) as the view layer and the Obsidian filesystem APIs for persistence. I would need to mock out the relevant APIs from Obsidian if I wanted to have any meaningful test coverage of my own code. 

There isn't yet any comprehensive mock Obsidian API for use in a testing environment that I could reach for, so I went ahead writing my own!

<!--more-->

## Taking Stock

There are two Obsidian APIs that I make heavy use of:
- `Vault`: The filesystem API. This API allows you to create, read, update and delete files. The core type that is passed around these APIs is `TAbstractFile`, which can either be a `TFolder` or a `TFile`.
- `MetadataCache`: To support everything from file search to graph view to the backlink count, Obsidian parses every Markdown file in a Vault and saves relevant information about its structure in the `MetadataCache`. I'm most interested in:
	- YAML frontmatter, parsed into a dictionary
	- Position and task status of lists and list items
	- Position and text of Markdown headings

## First Thoughts

Mocking out relevant parts of the `Vault` API isn't that bad, but keeping a mock MetadataCache that was in sync with file contents felt like it was going to be a big pain. Every item in a cache entry records its location in its file, consisting of line/column information as well as the character offset. Writing cache entries by hand would require recording the position of every single heading and list item within the file – a single character change would have a cascading effect on the whole cache entry.

My first thought to avoid this was just to write a simplified metadata parser for testing purposes. My mock API would just take in file contents and would parse out the metadata itself. I wasn't particularly in the mood to write a Markdown parser just for unit tests. A library like [`mdast`](https://github.com/syntax-tree/mdast) might have made this easier, but that can be a rabbit hole for another day.

## The `FileBuilder`

The solution I landed on is to build up a file's contents line-by-line while also constructing the metadata for each line at the same time. It's sort of the inverse of parsing  – the file is constructed in a structured format that's easy to write, and then serialized to a string *and* to the metadata format at the same time! The resulting builder DSL is super readable for the verbosity of the output it produces.

The following expression:

```ts
const [contents, metadata] = new FileBuilder()
    .frontmatter({ hello: "world" })
    .heading(2, "Journal")
    .text("this is a journal entry!")
    .text("and a second line!")
    .heading(2, "My list")
    .list(
      new ListBuilder()
        .item("first list item")
        .item("second list item")
        .item("to-do", false)
        .item("done", true)
        .item("nested list")
        .list(
          new ListBuilder()
            .item("nested list item")
            .item("another nested item")
        )
    )
    .done();
```

Renders this Markdown:
```
---
hello: world
---
## Journal
this is a journal entry!
and a second line!
## My list
- first list item
- second list item
- [ ] to-do
- [x] done
- nested list
	- nested list item
	- another nested item
```

<details>
<summary>And constructs the following metadata, which I'll hide in a dropdown.</summary>

```json
{
    frontmatter: {
        hello: "world",
        position: {
            start: { line: 0, col: 0, offset: 0 },
            end: { line: 2, col: 3, offset: 20 },
        },
    },
    headings: [
        {
            position: {
                start: { line: 3, col: 0, offset: 21 },
                end: { line: 3, col: 10, offset: 31 },
            },
            heading: "Journal",
            level: 2,
        },
        {
            position: {
                start: { line: 6, col: 0, offset: 76 },
                end: { line: 6, col: 10, offset: 86 },
            },
            heading: "My list",
            level: 2,
        },
    ],
    listItems: [
        {
            position: {
                start: { line: 7, col: 0, offset: 87 },
                end: { line: 7, col: 17, offset: 104 },
            },
            parent: -7,
        },
        {
            position: {
                start: { line: 8, col: 0, offset: 105 },
                end: { line: 8, col: 18, offset: 123 },
            },
            parent: -7,
        },
        {
            position: {
                start: { line: 9, col: 0, offset: 124 },
                end: { line: 9, col: 11, offset: 135 },
            },
            parent: -7,
            task: " ",
        },
        {
            position: {
                start: { line: 10, col: 0, offset: 136 },
                end: { line: 10, col: 10, offset: 146 },
            },
            parent: -7,
            task: "x",
        },
        {
            position: {
                start: { line: 11, col: 0, offset: 147 },
                end: { line: 11, col: 13, offset: 160 },
            },
            parent: -7,
        },
        {
            position: {
                start: { line: 12, col: 2, offset: 163 },
                end: { line: 12, col: 22, offset: 183 },
            },
            parent: 11,
        },
        {
            position: {
                start: { line: 13, col: 2, offset: 186 },
                end: { line: 13, col: 25, offset: 209 },
            },
            parent: 11,
        },
    ],
}
```
</details>

## Testing the test code
I'm never sure of what the best practice is for testing code that you've written for the purpose of testing, but this case I'd constructed a complex enough API and written enough code that I decided to see how deep this rabbit hole goes.

The main thing I wanted to avoid was manually writing out the output that I was expecting. Constructing metadata by hand was what I wanted to avoid in the first place, and I didn't want to track down small typos in my transcription of the Markdown documents.  I came up with a testing strategy that minimized the amount of typing I had to do for each of the output formats, allowing me to add a lot of test cases with minimal effort.

### Text output
Jest comes with built-in [snapshot testing functionality](https://jestjs.io/docs/snapshot-testing) that allows test authors to simply visually validate the test output after the test is run the first time. On subsequent runs, the result is compared to the accepted output to make sure there isn't any regression.

We get the option of using separate snapshot files or [keeping the snapshots inline](https://jestjs.io/docs/snapshot-testing#inline-snapshots). I opted for inline snapshots since the output isn't particularly long for any given test. Here's an example of what the inline snapshot assertion looks like after it's accepted:

```ts
const [contents, metadata] = new FileBuilder()
  .heading(2, "First heading")
  .heading(2, "Second heading")
  .heading(2, "Third heading")
  .done();
expect(contents).toMatchInlineSnapshot(`
  "## First heading
  ## Second heading
  ## Third heading
  "
`);
```

### Parsed metadata
The goal of this whole builder is to make sure that the metadata produced is identical to the metadata that Obsidian constructs from parsing a Markdown file. To verify that, I wanted to use Obsidian's actual parser output as the source-of-truth for these tests.

I copy/pasted the inline snapshot result for every test into a blank Obsidian note and added a small Obsidian command to my local copy of my plugin to grab the current note's metadata and copy the full assertion to the clipboard:

```typescript
this.addCommand({
  id: "full-calendar-FCTEST",
  name: "FCTEST",
  callback: async () => {
    const leaf = this.app.workspace.getMostRecentLeaf();
     if (leaf.view instanceof MarkdownView) {
      const file = leaf.view.file;
      const cache = {
        ...this.app.metadataCache.getFileCache(file),
      };
      delete cache["sections"];
      if (cache) {
        console.log(cache);
        await navigator.clipboard.writeText(
          `assert.deepStrictEqual(metadata, ${JSON.stringify(
            cache
          )})`
        );
      }
    }
  },
});
```

Adding an assertion for metadata to each test only took a copy-paste and five or so keypresses!

The code for this is still on an [in-progress branch](https://github.com/davish/obsidian-full-calendar/tree/feature/cache/src/test_helpers) in Obsidian Full Calendar, but I think it would be generally usable for other plugins, so I might split it out into a separate package in the future.