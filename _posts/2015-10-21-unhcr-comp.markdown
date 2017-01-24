---
layout: post
title:  "UNHCR Refugees to Canada, Compared"
date:   2015-10-21 12:00:00
---

A considerably more detailed source for information on refugees is the United Nations High Commissioner for Refugees (UNHCR) population statistics. Unlike Citizenship and Immigration Canada, they do have data on which countries refugees come from and go to. However, they're far broader in defining what constitutes a refugee, so the numbers are much higher. This data includes refugees and "refugee-like" situations, which are described as "[groups of persons who are outside their country or territory of origin and who face protection risks similar to those of refugees, but for whom refugee status has, for practical or other reasons, not been ascertained.](http://www.unhcr.org/45c06c662.html)"

The relevant bit, though, is that I've highlighted Syria in the above chart -- and you would still have a hard time finding it. The number of refugees in Canada from Syria has gone up by only around two hundred people since the civil war broke out. Compare that to Bosnia and Herzegovina in the 1990s or Afghanistan in the early 2000s.

* * *

<div id="unhcrChart"></div>
<div id="unhcrTip">
  <p id="tipTop"><span id="tipCountry"></span></p>
	<p class="tipInfo"><span id="tipRefugees"></span></p>
</div>

* * *

Source: [UNHCR Population Statistics](http://popstats.unhcr.org/en/overview)


<style>{% include 2015/10/unhcr.css %}</style>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script>{% include 2015/10/unhcr.js %}</script>