---
layout: post
title: LotRO Revisited - Part 5 - User Interface
date: '2011-03-25T08:00:00.000-07:00'
author: Chris Glein
tags: video-games lotro mmo
series: Lord of the Rings Online
modified_time: '2011-03-25T08:00:19.480-07:00'
thumbnail: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj51_8MWuFlosTFuJtDX_Gf-xFekvgKj9gcEIzmjdNdq99oDsHC8i3xnnNresnCeNWf3kjBo0g8urVlEaUbkfCr7fK263JFZ0a8GyH1W4xIxr19B6__THo9ye1fIxDtDKRAbIf5d91dMnU/s72-c/Web_ActionBar28.jpg
blogger_id: tag:blogger.com,1999:blog-2342422231079442130.post-7653210510361597199
blogger_orig_url: https://chrisglein.blogspot.com/2011/03/lotro-revisited-part-5-user-interface.html
---

We're now at part five of my ramblings on [Lord of the Rings Online](http://my.lotro.com/referral/pnb). Time to stop beating around the bush and start complaining about what I really want to complain about: User Interface
<!--more-->

LotRO's UI is approachable, largely due to its similarity with WoW, but it lacks the same polish… There are a ton of small issues with the interface - I could really go on and on.

During almost every topic I've covered on this game at one point or another I've mentioned problems with the user interface. I should put a disclaimer here: I'm a professional user interface developer. It's safe to say that I'm more sensitive to this class of issue than most people. But the reason I do this for a living is because I think it's *extremely* important. Good interface creates happy experiences; bad interface creates frustrating experiences.

Looking at the progress of this game over the years, it has gotten better. They have fixed some hiccups in the experience. But there are still warts, and the rate of improvement is too slow. Too many problems that have been there for years are still festering. The only conclusion I can come to is that refining the interface isn't a priority, and that they don't have the right kind of talent focused on these issues.

**Iconography**

![Action Bar](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj51_8MWuFlosTFuJtDX_Gf-xFekvgKj9gcEIzmjdNdq99oDsHC8i3xnnNresnCeNWf3kjBo0g8urVlEaUbkfCr7fK263JFZ0a8GyH1W4xIxr19B6__THo9ye1fIxDtDKRAbIf5d91dMnU/s320/Web_ActionBar28.jpg)

*"Icons are too small and lack strong enough silhouettes to be quickly identified."*

Let's look at the action bar screenshot above that I talked about [last time]({% post_url /2011-03-23-lotro-revisited-part-4-systems %}). There are a couple things you might notice, but the first is probably that the icons are incredibly tiny. 32x32 pixels, specifically. You can scale this bar up, but the source assets are 32x32, so the scaled up version looks terrible. By comparison WoW's source icons are 64x64, containing 4 times the amount of information.

So why are they so small? Well, I'm pretty sure that's because of design choices made in the skill system. If there are many skills to choose from then the icons need to be very small to fit on screen. The decision to regularly give the player new toys has lead to these icons being small.

But the size of the icons isn't the real problem. Depending on your settings your WoW UI might display at a similar size (from my informal sample I found many people had a 34x34 display size for their WoW icons). No the real problem is with the *contents* of those icons.

You'll notice that the attack skills all have a red background to their icon. Skills that buff or heal seem to have green backgrounds. There's an intentional pattern here. A terrible, terrible pattern. By definition these are actions you need to perform in the heat of the moment. Most of these are attack skills, so your bar is going to be a sea of red. By giving the icons all the same primary color they've lost the most glance-able pieces of information.

The other problem, other than small size and uniform color, is that the icons are trying to be little paintings. There's too much detail in those 32x32 dimensions. I think it's time for a comparison:

![MMO Action Bar](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiu4f5NqJPTPcmxNHxJnFe_ybcBtma1jqxDl046OUtX-XysgnHAN6mPh3SOrndKrYdIxJtTD9bOcx5oQWR_pSqjDxsQWIXYjnnm6NOEdrJ9ygOgk-ZaCUrX54wMckxTSC7u8b6qUql-G7g/s320/MMOActionBar.jpg)

Here we have samples from 7 different MMOs. This is by no means a comprehensive list, it's just a set of MMOs that I personally have played (or have seen played, in the case of Rift). Not all of the above have excellent iconography, but you'll notice the ones from LotRO really blur together into one mass. The icons are too tightly grouped, they all have the same color, and it's hard to pick out strong silhouettes.

At this point you might think I'm nit picking. But your average MMO player spends almost as much time staring at these action bars as they do observing their virtual surroundings. I've known players to completely lose context of what was going on because they were overly focused on their bars. It's a mission critical piece of interface, and on this LotRO does a real sub-standard job.

**Inventory**

![Inventory](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhyIl_UXtCCjYrMZg1z7g9FyGEmpF_9EsaBIsQxp2N_xWRndRh3MV9rfJU8mdN_1pJ8-XSdLuvpCMn2DziS3uAtx8oMSmgRBY2bQTNCMk2MaCkE2_BlXfo7H2e2QllGvRmajt78ABUXAV4/s320/Web848_Sell.jpg)

*"The bag view is frustrating because you can't do key tasks from there like sell."*

To the right in the screenshot you see my bag view. Pretty standard, although once again you'll note that the icons are frustratingly small. To the left is the window that you get when you talk to a vendor. You'll note that one is a grid view and one is a list view.

So what if I want to sell something? I've probably arranged my bags in some way meaningful to me so that I can find items later, so you'd think I'd sell from my bag view. This is the MMO standard, but it's not how it works in LotRO. I have to open up the Sell tab in the vendor window, browse a list view of my bag contents, and find the item there. I have to track down the item in an alphabetized list where up until this moment I may have not known its name (the grid view doesn't show titles until you hover for a tooltip). And I have to do this despite the fact that I might have organized my bags in some way where this would be a trivial task from the grid view.

This is frustrating to do even once, and if you've ever played an MMO you know that selling trash to vendors is something you do very frequently. It's clear that the developers knew that this was awkward, because there are a number of features of the list view designed to make the experience less terrible.

You can lock items from the vendor window so that they won't show up as options to sell. But of course you can't lock an item from the bag view, further reinforcing it's presence as a useless visualization.

You can filter the list view to different qualities of items, presumably to help find the items you want to sell. But the filters are opposite of what you want. You can filter only by increasing quality, not decreasing quality - so you can't filter down to trash.

None of this fixes the core problem: the original design was bad. Either embrace the list or embrace the grid - don't attempt some unholy hybrid.

**The Solution?**

*"WoW provided an open platform that enabled the community to patch up the rough spots. Blizzard would watch popular trends and integrate those features into the core. The end result is that the default WoW UI has become better and better over the years at an impressive pace"*

At last we have a sign that the developers are paying attention: recently (as in within the last six months) LotRO opened up it's platform to support LUA scripted plugins. This is huge. This empowers the community to start making things better. What's there now from an API perspective is very conservative, but it's still a huge step in the right direction.

There aren't a ton of high quality plugins available yet. This stuff takes time. But the basic tools are there, and the developer is listening to what the community needs. If I didn't have a day-job I'd probably take matters into my own hands and start modding again. Alas, I have no interest in burning out like that, so I'm just going to have to hope the plugin development community does what needs to be done. Let the healing begin.

---

In the next and final segment I'll talk about the only thing all of you probably want to know: what does it actually mean to be "free to play"?