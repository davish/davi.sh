---
title: "Asking the Right Questions"
date: 2023-03-29T16:49:08Z
tags: ["ai", "chatgpt", "django"]
description: "AIs are as useful as the questions you know how to ask."
---

*This is my generative AI take. I'm sure there are many like it, but this one is mine[.](https://www.usmcu.edu/Research/Marine-Corps-History-Division/Frequently-Requested-Topics/Marines-Rifle-Creed/)*

When it comes to trends I'm almost always on the far side of [Moore's Chasm](https://en.wikipedia.org/wiki/Crossing_the_Chasm). I signed up for Snapchat a year after all of my friends, and joined Instagram two years after everyone else. So it was only appropriate that it took weeks after the internet was set on fire for me to see the value applications of Large Language Models (LLMs) like [ChatGPT](https://openai.com/blog/chatgpt) and [GitHub Copilot](https://github.com/features/copilot) bring to programming. But now that I've given it a real shot, it's clear to me that if you have enough knowledge to ask specific tactical questions about a given framework or technology that's popular enough, ChatGPT can be a huge force multiplier.

When ChatGPT dropped a few months ago, I asked it a few questions right away, like "can you compare OCaml and Haskell?", and "What is COVID-19?".  I wasn't super impressed with the depth of the answers, and hallucination was pretty obvious, even if the grammar and vocabulary was suprisingly coherent and humanlike.

This week I decided to give ChatGPT another shot. I've started working on an API built with [Django REST Framework](https://www.django-rest-framework.org) this week for the first time in about two years. My working knowledge of how to build stuff with the framework was rusty, but I still had a notion of what I wanted to do and how to do it. Django and DRF documentation are both thorough, but it's often tough to search through them when you know what you're looking for. I tried using ChatGPT as an alternative to the official Django and DRF docs. Both Django and DRF are over a decade old and very stable, so GPT 3.5's late-2021 knowledge cliff wasn't an issue.

ChatGPT was able to provide me with surprisingly good answers to my intermediate-to-advanced Django questions, like:
- Writing a model definition with a `created_at` field that is set to the current time when the model is created.
- I have two django models, X and Y. Y has a ForeignKey relationship to X. When creating an X in the django admin I want to be able to create Ys in-line. Is this possible? (Yes, with an example `ModelAdmin` implementation)
- When should I use a through model in Django?
- I have a django model Y with a decimal field A and foreign keys to a User model and a model X. Is it possible to get the sum of A for all Ys in an X and the sum for all Ys linked to a User in an X in one query?
- I want to create a page where users can create a new X with a any number of Ys inline. How can I do this with django generic class-based views?

When asking a searching for an answer to a technical question on Google it's often best to try and abstract your goal into a general question to see if there's any answers out there on the internet. With ChatGPT, I got the best answers when I gave it specifics about my problem and the models I was using. It was able to plug in my model names and properties that I gave it without any problem.

I see two main components that led ChatGPT to being a great copilot on this Django project:
1. Django and DRF are old, stable, and popular. I'm sure that tons of blog posts, StackOverflow answers, and books on the framework made it in to GPT-3's training corpus.
2. My own knowledge enabled me to ask precise questions that were within the bound of possibility. I've worked for years with Django. Even though I'd forgotten many of the specifics, I still knew the general vocabulary of the framework and what it was capable of. I stayed away from asking for ChatGPT's opinion or asking high-level design or architecture questions. Based on my other experience with ChatGPT, I suspect that those kinds of questions are where the model is more likely to hallucinate.

For now, at least, LLMs are most useful when the prompter has sufficient domain knowledge to form precise questions. I don't think the robots are here for *all* our jobs, just yet. But this is a fast-moving field: we'll see what happens in the next 5 years – or even 5 months.