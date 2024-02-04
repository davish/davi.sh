---
title: Top Classes in Undergrad
date: 2021-04-10
tags:
  - upenn
  - lists
  - college
  - advice
---

I'm graduating from college in May. Over my four years working towards
my degree, I've taken about forty different courses. As I enter the
last month of school, I thought it would be a good time to look back and
reflect on the courses that I enjoyed the most. I've picked out five
classes, and instead of trying to make any absolute ranking of them, I
just decided to present them in the order they were taken, and try and
express how each one impacted me.

# CIS 240: Introduction to Computer Architecture (Fall 2018)

CIS 240 with [C.J. Taylor](https://www.cis.upenn.edu/~cjtaylor/) was my
favorite introductory CS class I took at Penn. I came into school with
some programming experience, but I was certainly ignorant of the inner
workings of _how_ computers took the code I would write, execute it and
ultimately give output back to me. 240 started with transistors and
logic gates, built up to CMOS circuitry, before jumping the boundary
between atoms and bits and introducing us to machine code, assembly, and
C for an educational architecture known as
[LC4](https://www.cis.upenn.edu/~cis371/17sp/lc4.html). I've heard that
pointers in C are a notoriously difficult concept for beginners to
grasp, but the evolution up the ladder of abstraction within a computer
made C feel like a natural extension of assembly. The course had a very
intentional flow to it, and every separate concept felt like it fit into
the course well.

Outside of the material, Professor Taylor brought great enthusiasm and a
sense of humor to the class. Along with an arsenal of cheesy jokes (my
favorite kind) that I'm sure were honed over the semesters lecturing
for the course, he came to our midterm exam, which happened to be during
the final block of class on the afternoon of Halloween, dressed as Darth
Vader, mask and all. He somehow managed to stay in character the entire
exam, which I've always respected.

# PSCI 232 / COMM 226: Introduction to Political Communication (Fall 2018)

This course was billed to me as one of the most difficult, but also most
rewarding, political science courses at Penn. [Professor Kathleen Hall
Jamieson](https://en.wikipedia.org/wiki/Kathleen_Hall_Jamieson) had been
teaching the class since the late 90s, and her expertise shone through.
232 was all about presidential elections, the media, and the electorate.
It took a deep dive into presidential campaign advertising in every
presidential campaign since Eisenhower's election in 1952. Each week
we'd watch campaign ads from a certain campaign, and Professor Jamieson
would dig into what made each one persuasive to its audience, or why a
given ad flopped.

More important to me than the technicalities of advertising and public
communication, we dug into the role that the media itself has in shaping
the narrative around elections, and how campaigns can rise or fall in
how they take advantage of the media's agenda-setting powers. Jamieson
has been an outspoken voice about deception and falsehoods in politics
[for
decades](https://www.washingtonpost.com/archive/opinions/1988/10/30/our-appalling-politics/fefb1d63-1570-4875-872b-27e2947d38df/).
Standing in 2021, her warnings back then certainly seemed prescient, and
the class helped teach me the very active role that social and
traditional media play in helping decide how our politics unfolds in the
United States.

# PSCI 253: International Politics of the Middle East (Fall 2019)

The syllabus was so daunting I almost dropped 253 before the first
lecture. Six books in fourteen weeks would add up to roughly two hundred
pages of reading each week, and on top of an upperclassman engineering
course load, it didn't seem particularly feasible. But after a single
lecture with [Robert
Vitalis](https://live-sas-www-polisci.pantheon.sas.upenn.edu/people/standing-faculty/robert-vitalis),
I knew I would stick it through. I feel like it's pretty easy to
determine which professors have enjoyed tenure for a good amount of
time. While the observation is generally considered to be a nock against
a professor's dedication to their teaching responsibilities, I've come
to think that there are two distinct sub-types of the "tenured
professor" stereotype: there's the stereotypical apathetic professor,
but there's also those who take risks with their pedagogy that let you
know that they haven't had to justify their teaching methods to a
committee for some time. Professor Vitalis brought a particularly wacky
attitude to his lectures, often starting class with comments and
observations that were intentionally provocative to stir up discussion
and disagreement among the class. Even the 200-page weekly readings
were, in fact, a teachable moment. Our TA let it slip that Dr.
Vitalis's goal was to teach us how to skim effectively in a sort of
"baptism by fire."

The books we read in the course also tied into each other in
thought-provoking ways. Each dealt with American intervention in the
Middle East over the 20th century in a different light. Written
assignments were comparative book reviews, a format I haven't heard any
other professor using in their classes. The fundamental question of the
course, it seemed, was _why_? Why did the US maintain its interventions
on the other side of the world? Why did it present those interventions
to the public as it did? We never reached a real answer to any of these
questions, but the books brought another lens through which to look at
government and the responsibility of those that hold the levers of power
in American society, over not just our lives, but the lives of people
all over the world.

# [CIS 341](https://www.seas.upenn.edu/~cis341/current/): Compilers and Interpreters (Spring 2020)

I certainly didn't expect 341 to be the class that perfectly capped off
my computer science education when I first signed up for it. The course
is taught in a bottom-up manner, starting with an assembler for a subset
of X86 before moving up to an LLVM to x86 compiler backend. Only after
understanding some of the nuances of LLVM does the class move to the
frontend of the compiler and deal with lexing, parsing, and types.

[Steve Zdancewic](https://www.cis.upenn.edu/~stevez/) expertly connected
all the disparate threads of computer science that I'd experienced
throughout college and showed how mathematical theory and engineering
discipline can be combined to enable the programming languages that
developers take for granted today. I don't think there's a better way
to explain this than by listing all the topics that 341 touched on, and
the other courses that it built on top of:

- CIS320 (Data Structures and Algorithms): Graph coloring for register
  allocation
- CIS262 (Automata, Computability and Complexity): Parsing classes and
  context-free grammars
- CIS240: Assembly language and machine code
- CIS371 (Computer Architecture II): Optimizations around instruction
  ordering and processor pipelining

I was able to put some knowledge from this course to use right away.
Penn Course Review needs to load in a SQL dump of new course reviews
every semester. Up until now, we'd relied on loading all the data into
a blank MySQL database that we spun up, and then querying it back out in
the format we expected. It was a lot of moving parts and generally
pretty slow, too. I was able to [write a
parser](https://github.com/pennlabs/penn-courses/blob/1b6bd0cdf3bafd6d590d4c5a767372631bf5ea9c/backend/review/import_utils/parse_sql.py#L30)
that pulled out that same data without having to run it through a full
MySQL instance. It just goes to show how the skills that are involved in
writing a compiler are useful in their own merits, in addition to being
used for compilers.

341 was also where I got exposed to type theory as a subject for the
first time, and it sparked my interest in the study of programming
languages.

# [CIS 552](https://www.seas.upenn.edu/~cis552/current/): Advanced Programming (Fall 2020)

[Stephanie Weirich](https://www.cis.upenn.edu/~sweirich/) bills CIS552
as a class that "take[s] _good_ programmers and turn[s] them into
_excellent_ ones." It's Penn's only full-credit class taught with
Haskell and going into it, I knew next to nothing about the language
besides that monads are something people find scary. This might be kind
of cliché, but learning Haskell through 552 did change how I thought
about programming across the board. Haskell evaluates expressions lazily
when they're needed, and not when they're defined. This is an oddity
in mainstream languages, but it makes you think more critically about
when your code runs. It helped me realize that some expressions in my
Python code were being evaluated at their definition when they should
have been evaluated lazily.

552 shines in how it introduces monads and explains their usage. Monads
aren't not something that clicks for everyone, and they certainly
didn't for me right away. We started from the assumptioon that the
general definition of monads is too abstract for programming, and the
class worked more by example. Through the `Maybe`{.verbatim} monad,
State monad, List monad, and a few other examples, the intuition slowly
built up for me about how powerful the concept can really be. Haskell's
a fundamentally pure functional language that deals only with inputs and
outputs to functions. What monads add in this context is a way to
abstract out the glue code and plumbing behind a lot of programming
patterns in a way that makes code easier to follow and allows Haskell,
with a bit of syntactic sugar that the `do`{.verbatim} block provides,
to take on some imperative-seeming features that one may find in a more
traditional language, like exceptions and global contexts, while
maintaining its underlying purity.

The back half of the class was a great tour of what you can do when
strong typing is taken to its logical conclusion. I got to work with a
friend on a awesome final project, building a [typechecker for MongoDB
aggregation queries](https://github.com/eyingxuan/mqlint). We were both
impressed with the final state of the project, but it's pretty crazy
how much type-driven programming helped us out here. We started by
defining our abstract syntax tree, and then split up to work on the
schema and query parsers and the typechecker itself. Any changes we made
in the types were checked by the compiler and we were able to modify our
logic, and our monad stack, to add new features without worrying about
breaking existing ones.

I don't harbor any notions about how difficult it would be to find a
job working with Haskell in industry, but it's certainly a language
that I'll continue to play around with going forward. It's got some
awesome ideas that are starting to percolate down towards more
mainstream languages like Rust.

# Wrapping Up

All in all, I consider myself lucky to be able to study things that I
find interesting in their own right. Penn's been difficult at times,
but it's also afforded me the opportunity to learn from great
professors, work on [super awesome projects](https://pennlabs.org), and
meet other students who are extremely driven and passionate about every
topic under the sun.

I don't know if there's a single thread that runs through all five of
these classes. If I had to pick something, they all certainly had an
intentionality to their curriculum. The professors made sure that
everything they taught had its place in the larger narrative, helped me
understand how each lecture fit into the course topic, and how the
course itself fit into the larger field of study. As is pretty apparent
from me deciding to write this article, I like finding and understanding
patterns -- it makes sense that the courses I enjoyed the most were able
to weave fabrics out of seemingly disparate threads.

It's certainly cliché to say, but I don't plan on my education
stopping after I get my diploma. Who knows if I'll ever go back to
school, but I'll take what I've learned about learning itself along
with me as I start my career.
