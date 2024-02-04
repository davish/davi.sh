---
title: "Hotwiring the Web: What does Basecamp's New Magic bring to the table?"
date: 2020-12-22T19:38:55-04:00
slug: Hotwiring the Web
tags:
  - django
  - webdev
  - react
  - hotwire
  - turbo
---

[Hotwire](https://hotwire.dev), which seems to be short for (H)tml
(O)ver (T)he (Wire), is a collection of frameworks just announced by
Basecamp that work together to help build "traditional"
server-rendered web applications that look and feel to users like
modern, Single-Page Applications (SPAs) built in React, Angular, Vue or
other frontend frameworks. [Basecamp's CTO put out a blog
post](https://m.signalvnoise.com/html-over-the-wire/) on why he believes
in Hotwire, but most of the justification seems to be handwavy claims
that JavaScript is inherently "complex," never mind that Ruby's
syntax and dynamic type system can be just as head-scratching to a
newcomer. I think that Basecamp's built a really interesting tool, and
a better argument for Hotwire can be made by fully engaging with the
benefits that SPA "[thick
clients](https://www.computerhope.com/jargon/t/thickcli.htm)" bring to
the table, their specific shortcomings, and all the different ways
framework developers are trying to address those shortcomings today.

# Problems with Web Application Development Today

I want to separate "web app" development from general "web"
development, simply because most websites aren't single-page
applications, or web apps in the sense we think of gmail, or
[hey.com](https://hey.com). It's put most concisely in "[How the Web
is Really Built](https://css-tricks.com/how-the-web-is-really-built/)".
Here, though, I'll be talking about that subset of the web which _can_
be categorized more as an application than simply a web site.

Building a web app is always going to be a complex endeavour. SPA view
libraries like React have emerged in the past five or so years as an
awesome way to handle that complexity on the client side, allowing
developers to build interactive user-interfaces in a composable way,
re-using components easily in different parts of the site.

## Duplication of Concerns

Generally, when building a React app, you get any dynamic data through a
loosely coupled JSON API (in my personal preference, probably written
with [Django REST Framework](https://www.django-rest-framework.org)). If
you're using a web framework like Django or Ruby on Rails, then you're
going to have a lot of complexity and business logic on both the
frontend and backend. Whenever you add a feature, you need to ask
yourself where it should be added. The loose coupling between parts that
may very well be written in different languages means that it's really
difficult to share code, and even if you're doing something as simple
as validating a form, you'll probably end up with a decent amount of
duplicated business logic, a big no-no if you follow the [DRY
principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)!

## Data Fetching Boilerplate

Loosely-coupled APIs present another challenge when building web apps:
the boilerplate that comes along with getting the data out of your
database and displayed in a browser. The general process for an SPA
follows this outline:

1.  [User] Navigates to a page, submits a form, or clicks on a
    resource.
2.  [Browser] Send a request, along with any route parameters and
    arguments, to a backend API endpoint.
3.  [Server] API endpoint is called, fetches data from the database
    using the parameters in the request.
4.  [Server] After retrieving data from the database, marshal that
    data into JSON to be sent back to the client.
5.  [Browser] Receive JSON from request, un-marshal the JSON into data
    structures that the web app can understand. For a React app, this
    would include passing the data as props to each component that uses
    the data to for render itself.

And that's only the happy path! In the case of a validation error, for
example, the server would return a 400 response with some JSON details,
and the client again would need to catch that error, and render it
properly. It really is a lot of boilerplate for any given request.

There are frontend libraries like [SWR](https://swr.vercel.app) which
factor out as much boilerplate as possible and encourage declarative
patterns for your own data fetching, but "thick client" web apps will
always need to marshal data to JSON on the server, and un-marshal to
some view-able format on the client.

# Managing SPA Complexity in 2020

There's a bunch of different solutions to these problems for those who
still want to provide an SPA experience, and they fall broadly into two
separate categories.

## Frontend-First: The JAMStack

In recent years, there's been a big push towards the
[JAMStack](https://jamstack.org/what-is-jamstack/): pushing all your
complexity and business logic onto your frontend, and relying mostly on
commodified API services for your backend work. JSON is still the lingua
franca here, but reliance on pre-built backends as a service for
different functionalities, along with query languages like GraphQL,
means that there isn't any backend boilerplate handled by developers.
All the complexity and business logic is pushed to the client-side,
which alleviates worries about duplication of concerns.

JAMStack and associated "micro-backends" like
[Auth0](https://auth0.com), or "backends-as-a-service" like
[Supabase](https://supabase.io) and [Google
Firebase](https://firebase.google.com) allow people who haven't done
too much backend work in the past to build truly full-stack apps on
their own. [m3o](https://m3o.com) is even building a constellation of
JAMStack-oriented "micro-services" to provide the batteries to power
most web apps. Hmm... "batteries included"? Where
[have](https://www.phoenixframework.org) we
[heard](https://www.djangoproject.com) [that](https://laravel.com)
[before](https://rubyonrails.org)...

## Backend-First: Re-discovering the batteries

MVC Frameworks like Django and Rails came about during the heyday of Web
2.0 to abstract away a lot of the boilerplate associated with building
CRUD web applications, the exact issues that we spoke about above. Back
in 2006, all those interactions were through normal browser HTTP
requests. SPAs, built with anything from
[Backbone](https://backbonejs.org) or [Ember](https://emberjs.com) to
React and Vue, were more responsive. These web frameworks became
frameworks for JSON API servers, and for many web app developers,
functionality like Django's
[templates](https://docs.djangoproject.com/en/3.1/ref/templates/) and
[forms](https://docs.djangoproject.com/en/3.1/topics/forms/#more-about-django-form-classes)
and the battle-tested
[abstractions](https://docs.djangoproject.com/en/3.1/topics/class-based-views/generic-display/)
for linking them together became vestiges of an earlier age. Django's
`Form`{.verbatim} classes can render validation errors in templates with
virtually no boilerplate written by developers. As soon as you want to
put that form action over a JSON API, any responses from your server,
which were previously just the HTML that the browser displayed, now have
to be un-marshalled from JSON on the client and handled specifically.
How much was Django really a "batteries included" framework if you
needed to pull in [REST
Framework](https://www.django-rest-framework.org) and [OAuth
Toolkit](https://github.com/jazzband/django-oauth-toolkit) whenever you
wanted to work with a "modern" frontend?

Many people, myself included, enjoy modeling business logic in the ways
Django and its ilk allow for. Backend-first fullstack frameworks have
begun to proliferate built on top of these existing frameworks. [Phoenix
LiveView](https://www.phoenixframework.org/blog/build-a-real-time-twitter-clone-in-15-minutes-with-live-view-and-phoenix-1-5)
and [Laravel Livewire](https://laravel-livewire.com) are two that come
to mind immediately, and have been around for a year or more.

On Monday, even the React Core team at Facebook threw their hat in the
ring, with their [Server
Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html)
that have the opportunity to allow for React components to be rendered
much like PHP templates, interspersing database calls and server-side
JavaScript with the layout description inside a server component's
`render`{.verbatim} function.

These fullstack frameworks go a long way towards solving both of the
concerns with traditional SPAs listed above. Separation of concerns is
no longer an issue, since there is no separate, loosely coupled frontend
codebase. Data fetching is drastically simpler in this paradigm. No
longer does all your data need to be serialized to JSON before being
converted into HTML; your data-fetching flow looks a lot more like this:

1.  [User] Navigates to a page, submits a form, etc.
2.  [Server] Backend route is called, fetches/stores appropriate data
    from the database based on the request.
3.  [Server] Data is used to populate an HTML template, which is sent
    to the client and rendered with the help of the framework.

Your backend business logic renders HTML directly, completely replacing
steps 3, 4 and 5 above with a single step: map your data into its visual
representation in HTML. The two server steps remaining _are_ the actual
business logic in your application: the full-stack framework handles the
smooth transitions, without the developer having to worry about
serializing and de-serializing their own data. The logical flow of your
application becomes a lot simpler for a single developer to follow and
to handle.

Even React's Server Components fit this new paradigm: Data fetching no
longer happens in AJAX requests, but by declaring a child server
component which fetches the data and displays it in its own DOM tree
without the developer having to serialize to/from JSON themselves. After
the component renders on the backend, its virtual DOM gets sent to the
frontend _by React itself_ for display. The developer's interface into
this whole process remains high-level and declarative.

## As the Pendulum Swings

We started the decade with frameworks like
[Meteor.js](https://www.meteor.com) with extremely tight couplings
between the client and server, and after a long time wandering in the
wilderness of duplicated compelxity across loosely-coupled frontend and
backend, it seems like we're entering the twenties with a renewed push
towards a [more
monolithic](https://m.signalvnoise.com/the-majestic-monolith/) approach
to web development. When even a frontend framework like React is
beginning to bridge the gap with the backend, you know it's an
interesting idea to explore right now.

# So what is Hotwire?

The folks at Basecamp, the company behind Hotwire, have always been
skeptical of thick clients with loads of JavaScript. Hotwire is
Basecamp's latest answer to the challenge of building modern,
responsive, "snappy" single-page applications where the domain logic
lives entirely on the server. They used it to build out their new email
service, Hey.com.

At Hotwire's core is [Turbo](https://turbo.hotwire.dev), a new library
that takes HTML from AJAX requests and dynamically modifies the currrent
page. It comes out of an existing library called Turbolinks, now called
"[Turbo Drive](https://turbo.hotwire.dev/handbook/drive)" as of today,
which is a utility that intercepts all click events on anchor tags,
loads the resources over AJAX, and swaps out the `<body>`{.verbatim}
tags, all while handling browser history.

[Turbo Frames](https://turbo.hotwire.dev/handbook/frames), one of the
new components, is pretty intriguing. Turbo Drive will still AJAX-ify
form submissions and link clicks behind the scenes, but instead of
swapping out the entire webpage each time, Turbo will look for matching
`<turbo-frame>`{.verbatim} tags on the current page and in the new
page's content. If there's a match, it'll _dynamically replace that
section of the page_. Basically, you can compose webpages together,
using `<turbo-frame>`{.verbatim} to delineate template partials as
scoped components, similarly to how you'd think of components in a
React app. The benefit here being that all the logic is handled on the
server-side rather than split between two code-bases.

# Trying out Hotwire with Django

What's special about Turbo when compared to Phoenix LiveView and
Laravel Livewire is that Turbo is completely backend-agnostic: Drop the
JS bundle into a `<script>`{.verbatim} tag in your page's
`<head>`{.verbatim}, and Turbo Drive works its magic without any
co-operation from the server. Turbo Frames can be adapted by wrapping
`<turbo-frame>`{.verbatim} tags around template partials in any backend
framework. [Turbo Streams](https://turbo.hotwire.dev/handbook/streams),
the solution for incremental data updates, can also be used in the
context of HTTP requests without any co-operation from the server beyond
modifying your template partials. It's only if you want to use Turbo
Streams over WebSockets where you'll need some custom code for your
specific backend framework.

Since the push behind Hotwire came from DHH and Basecamp, it makes sense
that their examples are with Ruby on Rails, and that's where they've
made their supporting libraries. I decided to take a shot at building a
demo app similar to what's shown in Hotwire's demo video using Django
rather than Rails. [It really didn't take
long!](https://github.com/davish/hotwire-django-demo-chat) I got my
start in Web Development with a JQuery app with a REST API, and even
after moving on to Django, I always used Django REST Framework. I never
really took advantage of the templating functionality, or the
super-useful built-in CRUD operations with Django forms. It was an
interesting experience working with `CreateView`{.verbatim} and
`DetailView`{.verbatim} rather than `ModelViewSet`{.verbatim}, and I'll
be excited to keep exploring this going forward.

After an hour or so more of experimentation and digging into the
turbo-rails codebase, I got a working prototype of a Turbo Streams
`Broadcastable`{.verbatim} mixin for Django! I'm working on [something
similar for Django REST
Framework](https://github.com/pennlabs/django-rest-live) right now,
which definitely helped in hitting the ground running. I'll probably
look to clean up the code and make sure it works for the other actions,
and split it out into its own pypi package.

I'll have to look at how the Rails integration handles authorization --
right now, anyone would be able to subscribe to any stream for a given
model, which is obviously not ideal for actual production applications.

I was really surprised at how easy it was to set up Turbo to work
effectively with a Django backend. The chat app that I built was really
simple, but it also was just not many lines of code: not having to worry
about moving data around from the frontend to the backend really
decreased the amount of time spent on the implementation. Turbo though
is in a pretty early beta, and the one main thing I'd like to see be
addressed would be a good fallback mechanism for Turbo Streams over
websockets. Right now, if you want to broadcast updates over websockets,
then you can't also send Turbo Streams in HTTP responses to form
actions without getting duplicate data appended. The solution in the
Hotwire demo video is simply to not send updates over HTTP, and only
stream over websockets. This doesn't seem particularly robust, however,
in the case that a websocket connection fails or a client simply
doesn't support it. In addition to the five actions, there should
probably be an `append-or-replace`{.verbatim} action that looks for an
element with a matching `id`{.verbatim}, performs a `replace`{.verbatim}
action if one is found, and otherwise performs an `append`{.verbatim}
action. The duplicate updates from the HTTP response and the websocket
stream wouldn't conflict in that case, since one will append, and the
other will replace with identical data.

## Closing Thoughts

This is definitely an exciting time for frontend development! I'm
hoping to do some more experimentation in the coming weeks, and I'm
glad that framework authors accross the board are putting effort into
thinking about how to move the web app developer experience to the next
level.
