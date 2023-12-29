---
title: Posts
description: All blog posts
layout: page
---

<div class="posts">
  {% for post in site.posts %}
  <div class="post">
    <h1 class="post-title">
      <a href="{{ post.url | absolute_url }}">
        {{ post.title }}
      </a>
    </h1>

    <span class="post-date">{{ post.date | date_to_string }}</span>

    {{ post.excerpt }}

    <a href="{{ post.url | absolute_url }}">
      More
    </a>
  </div>
  {% endfor %}
</div>
