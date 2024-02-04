---
title: "Asking the Right Questions to ChatGPT"
date: 2023-03-30T14:26:43Z
tags: ["ai", "chatgpt", "django"]
draft: false
---

_This is my generative AI take. I'm sure there are many like it, but this one is mine[.](https://www.usmcu.edu/Research/Marine-Corps-History-Division/Frequently-Requested-Topics/Marines-Rifle-Creed/)_

When it comes to social trends I'm often on the far side of [Moore's Chasm](https://en.wikipedia.org/wiki/Crossing_the_Chasm). I signed up for Snapchat a year after all of my friends, and joined Instagram two years after everyone else. So it was only appropriate that it took weeks after the internet was set on fire for me to see the value that applications of Large Language Models like [ChatGPT](https://openai.com/blog/chatgpt) and [GitHub Copilot](https://github.com/features/copilot) bring to programming. But now that I've given it a real shot, it's clear to me that if you have enough knowledge to ask specific tactical questions about a well-defined technology, framework or library, ChatGPT can be a huge force multiplier.

<!--more-->

When ChatGPT dropped a few months ago, I asked it a few questions right away, like "can you compare OCaml and Haskell?", and "What is COVID-19?". I wasn't super impressed with the depth of the answers, and hallucination was pretty obvious, even if the grammar and vocabulary was suprisingly coherent and humanlike.

This week I decided to give ChatGPT another shot. I've started working on an API built with [Django REST Framework](https://www.django-rest-framework.org) this week for the first time in about two years. I still had a notion of what I wanted to do even though my working knowledge of how to build stuff with the framework was rusty. While the Django and DRF documentation are both thorough, it's often frustrating to search through them for specific examples when you know what you're looking for.

ChatGPT was able to provide me with surprisingly good answers to my intermediate-to-advanced Django questions and prompts, like:

- Write a model definition with a `created_at` field that is set to the current time when the model is created.
- I have two django models, X and Y. Y has a ForeignKey relationship to X. When creating an X in the django admin I want to be able to create Ys in-line. Is this possible? (Yes, with an example `ModelAdmin` implementation)
- When should I use a through model in Django?
- I have a django model Y with a decimal field A and foreign keys to a User model and a model X. Is it possible to get the sum of A for all Ys in an X and the sum for all Ys linked to a User in an X in one query?
- I want to create a page where users can create a new X with a any number of Ys inline. How can I do this with django generic class-based views?

When searching for an answer to a technical question on Google it's often best to try and abstract your goal into a general question to see if there's any answers out there on the internet even tangentially related. With ChatGPT, I got the best answers when I gave it specifics about my use case and the models I was using. It was able to plug in my model names and properties that I gave it without any problem. It was also a lot easier to phrase my questions naturally without having to generalize them out like I would with Google.

I see two main components that led ChatGPT to being a great copilot on this Django project. Django and DRF are old, stable, and popular. I'm sure that tons of blog posts, StackOverflow answers, and books on the framework made it in to GPT-3's training corpus. Just as importantly, my own knowledge enabled me to ask precise questions that were within the bounds of possibility for the framework. I had worked with Django for years and knew the general vocabulary of the framework and what it was capable of. I stayed away from asking for ChatGPT's opinion or asking high-level design or architecture questions, and I suspect those kinds of questions are where the model is more likely to hallucinate.

For now, at least, LLMs are most useful when the prompter has sufficient domain knowledge to form precise questions. I don't think the robots are here for _all_ our jobs just yet. But this is a fast-moving field: we'll see what happens in the next 5 years – or even 5 months.
