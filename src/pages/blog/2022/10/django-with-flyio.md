---
layout: "/src/layouts/BlogPost.astro"
title: "Deploy a Django app with fly.io"
date: 2022-10-04
draft: true
tags: ["webdev", "django", "fly.io", "devops"]
description: "A step-by-step guide."
---

I started a new project a few days ago built with Django. [Heroku is killing their free tier](https://techcrunch.com/2022/08/25/heroku-announces-plans-to-eliminate-free-plans-blaming-fraud-and-abuse/), and I've read that [Fly.io is the cool new thing](https://xeiaso.net/blog/fly.io-heroku-replacement), so I decided to try it out.

Overall, Fly.io has great documentation. Their [Language and Framework Guides](https://fly.io/docs/languages-and-frameworks/) are pretty comprehensive, but in a list that includes popular frameworks like Rails and Laravel and [less boring](https://mcfunley.com/choose-boring-technology) options like RedwoodJS and Remix, I couldn't help but notice Django's conspicuous absence.

I was able to get everything working great with Django and Fly.io after some trial and error, so I wanted to write up my process to make it easier for people going forward.

<!--more-->

---

If you want to get everything set up when starting a new project, use the `startproject` template I made which you can find at [github.com/davish/django-flyio-template](https://github.com/davish/django-flyio-template). If you're interested in a more in-depth look, then read on!

---

As opionated as Django is, there's still some choices you need to make when starting a project. Here's my stack that I'll use throughout this post:

- **Poetry** for package management.
- **Daphne** for the production webserver.
- **Docker** to describe the deployment.
  - Fly also has [support for heroku-style buildpacks and Procfiles](https://fly.io/docs/reference/builders/#buildpacks).
- **Postgres** for the production database, since Fly has [built-in support for Postgres](https://fly.io/docs/reference/postgres/).
  - Local development still uses **SQLite**.

## 1. Initialize the Poetry project and Django App

From inside an empty directory where you want to store your project, run:

```bash
$ poetry init
$ poetry add django dj-database-url daphne psycopg2-binary
$ poetry run django-admin startproject <project> .
```

## 2. Add the Dockerfile

```docker
FROM python:3

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY poetry.lock pyproject.toml /app/

RUN pip3 install poetry
RUN poetry install --no-root

COPY . .

ENV DJANGO_SETTINGS_MODULE "<project>.settings"
ENV DJANGO_SECRET_KEY "this is a secret key for building purposes"

RUN poetry run python manage.py collectstatic --noinput

CMD poetry run daphne -b 0.0.0.0 -p 8080 <project>.asgi:application
```

It's also important to also add a [`.dockerignore` file](https://docs.docker.com/engine/reference/builder/#dockerignore-file), especially if you're storing your site in a Git repository. Feel free to include `fly.toml` in `.dockerignore` as well.

```ignore
.git/
__pycache__/

fly.toml
*.sqlite3

# Files that store secrets
.env

# macOS file
.DS_Store

# Editor-specific configuration
.idea/
.vscode
```

## 3. Configure the Fly.io app

1. Run `flyctl launch` to create a project and get a name and URL. Say `n` to deploying a Postgres database, and also say `n` to deploying now. We have to make some more changes before we can do that.
2. The last command will have generated a `fly.toml` file. Open it up and add these lines, starting with the existing empty `[env]`block:

```toml
[env]
  DJANGO_SETTINGS_MODULE = "<project>.settings"

[deploy]
  release_command = "poetry run python manage.py migrate"

[[statics]]
  guest_path = "/app/static"
  url_prefix = "/static"
```

## 4. Link a Postgres Database

```shell
$ flyctl postgres create
# Make a note of the db app name you choose.
$ flyctl postgres attach <db-name>
# db-name should be what you selected in the previous step.
```

- The `postgres attach` subcommand creates a properly permissioned database user and generates a connection string that's stored as a [secret](https://fly.io/docs/reference/secrets/) named `DATABASE_URL`.

## 5. Configure Django settings

Back in our Django project, there's a bit of configuration that we'll need to do in the project's `settings.py` file.

### The `DATABASES` dictionary

```python
import os
import dj_database_url
# ...
DATABASES = {
    "default": dj_database_url.config(
        default="sqlite:///" + os.path.join(BASE_DIR, "db.sqlite3")
    )
}
```

[`dj-database-url`](https://github.com/jazzband/dj-database-url) will pick up the connection string that `flyctl postgres attach` set in our environment and properly configure our database connection for us. To avoid dealing with Postgres locally, however, we'll default to a SQLite database when we don't have a database URL defined.

### Static files

Django collects static files through the `collectstatic` command that we run in our Docker build process. We both need to tell Django where to store static files on the filesystem (`STATIC_ROOT`) and at what relative path these static files will be served from (`STATIC_URL`). These need to match The `guest_path` and `url_prefix` from our `fly.toml` file, respectively. `guest_path` is `/app/static` because we placed our app to the `/app` directory in our Dockerfile.

```python
STATIC_URL = "static/"
STATIC_ROOT = "static"
```

With Heroku and some other hosting providers, you'd have to set up and configure [WhiteNoise](http://whitenoise.evans.io/en/stable/) to serve static files through Django. I think it's great that Fly makes it easy to bypass the running web server and grab static files directly with so little configuration.

### Allowed hosts

Run `flyctl status` if you've forgotten what domain Fly.io has set aside for your app. Once you've got that hostname, set these two settings:

```python
ALLOWED_HOSTS = ['hostname.fly.dev']
CSRF_TRUSTED_ORIGINS = ['https://hostname.fly.dev']
```

### Generate a new secret key

Django generates a secret key by default and stores it in plaintext in your settings file. This is bad practice, since secrets should never be stored in source files where they can get caught up in verison control. As its name implies, [secret keys should be kept secret](https://docs.djangoproject.com/en/4.1/ref/settings/#secret-key), and are important for validating session cookies and other cryptographic uses throughout the framework.

```python
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
```

And then run:

```bash
flyctl secrets set DJANGO_SECRET_KEY=<generated secret key>
```

You can store any other sensitive values in Fly's secrets -- check out [the docs](https://fly.io/docs/reference/secrets/) for more info.

## 6. Deploy to fly.io

We're finally ready to deploy our app! Run `flyctl deploy --local-only`, and the tool will build your Dockerfile and push it up to Fly.io. I needed to use `--local-only` because the remote builder in my account had shut down and I had no way of turning it back on, but your mileage may vary. Local builds require Docker be installed and running locally.

Try visiting your site, and see if you can see the default django welcome page!

## 7. Create admin user

The last thing that you'll need to do is [create a superuser](https://docs.djangoproject.com/en/4.1/ref/django-admin/#createsuperuser) for accessing [Django's built-in admin site](https://docs.djangoproject.com/en/4.1/ref/contrib/admin/). Luckily, we can run any management commands against our production server just by `ssh`ing right into the box:

```bash
$ flyctl ssh console
# From inside the ssh session, run:
> cd app
> poetry run python manage.py createsuperuser
```

## Next Steps

And that's it! You should have a fully functional Django app on Fly.io with a Postgres database, and hopefully you learned some useful `flyctl` commands along the way.

What I've presented here is a "minimum viable deployment", but to make sure your deployment is safe for users and not vulnerable to attacks, it's important to look through Django's [deployment checklist](https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/). Parts have already been addressed throughout this article, but items like the `DEBUG` setting are important to be aware of for production Django.
