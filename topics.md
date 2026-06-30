---
title: Topics
description: Browse every post by topic.
layout: page
---

<ul class="topic-index">
{% assign sorted_tags = site.tags | sort %}
{% for tag in sorted_tags %}
  {% assign tag_name = tag[0] %}
  {% assign tag_posts = tag[1] %}
  {% capture tag_url %}/tags/{{ tag_name }}.html{% endcapture %}
  {% assign tag_page = site.pages | where: "url", tag_url %}
  <li>
    {% if tag_page.size > 0 %}<a href="{{ tag_url | absolute_url }}">{{ tag_name | replace: "-", " " }}</a>{% else %}<span class="topic-plain">{{ tag_name | replace: "-", " " }}</span>{% endif %}
    <span class="count">{{ tag_posts | size }}</span>
  </li>
{% endfor %}
</ul>
