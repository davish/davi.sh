---
layout: "/src/layouts/BlogPost.astro"
title: "Hello, Solar System!"
date: 2022-10-03
draft: true
tags: [meta, webdev, astro, javascript]
description: "Rewriting this website in the Astro web framework."
---

[Hello World](/blog/2020/02/my-first-post), again! I've rewritten this website using the [Astro web framework](https://astro.build). Astro's *very* new, but there's a few things that got me excited about it.

1. **JSX**.  JSX is the templating system that powers React. While Astro *can* build and use [React](https://docs.astro.build/en/guides/integrations-guide/react/), [Vue](https://docs.astro.build/en/guides/integrations-guide/vue/),  [Svelte](https://docs.astro.build/en/guides/integrations-guide/svelte/), or any framework from [a growing list](https://docs.astro.build/en/core-concepts/framework-components/) , [`.astro` templates](https://docs.astro.build/en/core-concepts/astro-components/) are written with a mix of TypeScript and JSX and are rendered directly to vanilla HTML with no JavaScript at runtime. I found Hugo's templating system that is built directly on [Go's templating library](https://pkg.go.dev/text/template) to be very limiting. At this point, I definitely believe the adage that "any powerful templating language eventually grows into an awkward programming language." Astro lets me write Typescript and get HTML out the other end.
2. **Scoped CSS**. CSS written in `.astro` templates are scoped to that template only. I'm not a fan of  [puritanical "separation of concerns" in CSS](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/). I also don't have much experience with Tailwind, and I enjoy writing SCSS. So scoped styles in all my templates is a happy medium where my styles live close to my templates, but I can write it all in a familiar syntax.
3. **Lightweight**. With everything from archetypes to taxonomies, Hugo is really a static CMS more than a blog generator. It's a much more general system than I need. Astro is a bit "closer to the metal" in that respect. When I've had to write some helpers that I took for granted in Hugo, writing custom helpers is much easier since it can be accomplished in a few lines of Typescript..

<!--more-->

Astro is sponsorted by [Netlify](https://www.netlify.com/), and in many ways appears to be their answer to [Vercel](https://vercel.com/solutions/nextjs)'s extremely popular [NextJS](https://nextjs.org/) framework serving a [more server-oriented niche](https://docs.astro.build/en/concepts/why-astro/#server-first). The two definitely have overlaps, though. Next is on its way to stabilizing support for [React Server Components](https://nextjs.org/docs/advanced-features/react-18/server-components), and Astro has its "[Islands](https://docs.astro.build/en/concepts/islands/)" which let developers add small segments of client-side reactivity using any frontend framework. I'm interested to see where the polyglot approach goes.

---

The transition from Hugo to Astro wasn't too bad. Most of my templates and partials had a 1-1 mapping with Astro components.  I'd like to give a special shoutout to [Bryce Wray](https://www.brycewray.com), whose blog posts on Astro and site repository were a great reference when building out my own site. The Astro docs are great, but they are also new, and there's a few things that I was able to find out about by snooping around Bryce's repo. 

Overall, I'm happy with the move, and think it'll help me make new additions to this site over time with less friction than before. We'll see how that goes!