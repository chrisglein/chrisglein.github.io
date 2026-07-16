---
layout: post
title: "A Pattern for Ranking Things"
tags: programming
---
Having a list of favorites or a ranking of media is fun. But ranking a big list all at once is genuinely hard. Breaking it into a sequence of comparisons (which of *these two* I like more) makes it actually achievable.

<!--more-->

## Albums

This all started when I decided to buy a record player (a story for another time). Immediately this posed a problem: which records do I actually buy to seed a collection? Vinyl is expensive. Replicating the equivalent of my old CD collection wholesale wouldn't be viable. And not everything I've enjoyed through streaming is a candidate for a full album purchase.

I needed some criteria.

- A record worth buying had to be something I loved in its entirety, beginning to end.
- It had to be good for focused listening (something I'm eager to sit in the same room with, willing to get up and flip the disc).
- And ideally it would be an aesthetically pleasing object, a little piece of personal expression on the shelf.

My partner and I brainstormed an initial candidate list, but it was long and we needed to cut it down dramatically. That's where the idea of running a bracket first emerged: turn a big decision into many tiny decisions.

So I vibe-coded a small thing to help: a single page of HTML that shows you two items, you pick the one you like more, and after a handful of rounds it hands you a ranked list (or at least a group of tiers). It worked great. We used it to narrow the field and pick a dozen records to start the collection with.

[Try it out]({{ '/album-ranker/' | relative_url }}).

## Board Games

I have a group of friends that meets regularly to play board games. Over time I've developed a feel for what lands and what doesn't. And I've already spent time here outlining [how I rate games]({% post_url 2024-08-16-The-Cody-Scale %}). But I was curious about the unspoken preferences hidden under the surface and drowned out by groupthink.

So I took a list of every game we'd played more than once and turned it into a seed for another bracket. All four of us completed this bracket-based ranking process. Then I dumped everyone's results into a spreadsheet to visualize them together and find the true top games.

[Try it out]({{ '/board-game-ranker/' | relative_url }}).

## Movies

Over lunch a coworker asked everyone for their top four movies. I declined to answer on the spot, but the question stuck with me. In the following weeks I kept bringing it up with other friends, sparking all sorts of great conversations. But making a concrete list is hard.

My daughter turned out to be the real test case. She doesn't like to pick favorites, but she was intrigued by the topic. For the last few years I've logged our movie watching and asked her opinions on likes and dislikes. So I have rough buckets of what she liked, at least recently. I took those lists, added a brainstorm of her favorites from her younger years, and that became the seed for her bracket. She was able to cozy up and churn through those tough calls on her phone in a matter of minutes.

[Try it out]({{ '/movie-ranker/' | relative_url }}).

## The Pattern

Clearly, this stopped being a one-off and became a pattern I turn to. It's a tool for taking big absolute judgments and turning them into smaller relative ones.

Some learnings as I've iterated on this:

- **Make it visually compelling.** This makes it fun. But also it helps streamline the process, as images help with pattern recognition when you're going through multiple comparisons within the same set of items.
- **Make it mobile-friendly.** We're making A/B comparisons here, and the phone posture is great for that. But the layout needs to work well with that screen size.
- **Make the results easy to export.** What do you do with the results? That's up to you, but it can't stay on the webpage.
- **Make it easy to reuse.** In less than 6 months I've found 3 clear uses for this (and another is brewing). It should be trivial to spin up another.
- **We live in an era of bespoke software.** If you can express requirements clearly, and judge results critically, and know how to use the tools... tiny software problems are trivial. It's weird times, yo.

## The Tool

![Screenshot of the tool with 3 different media types](/media/posts/bracket-game.png)

Under the hood is a single, media-agnostic engine that runs rounds of pairwise comparisons, tallies wins, and buckets the results into tiers. Everything specific to a use case lives in a tiny bit of configuration:

- Some light metadata, like what you call the thing being ranked ("movie", "album", "game") or the prompt shown at each matchup ("Pick the movie you like more").
- How to render a card (and optional support for a link).
- The data itself (a list of items and optionally some art).


I've put the whole thing up as open source [here on GitHub](https://github.com/chrisglein/bracket-game). 
