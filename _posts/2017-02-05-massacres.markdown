---
layout: post
title:  "Still, mostly peaceful"
date:   2017-02-05 12:30:00
thumbnail: /img/2017/02/massacresThumb.jpg
---

The recent Quebec mosque shooting may have been yet another reminder that Canada is not immune to extremism or violence, major violence remains thankfully unusual here. Compared to many other countries, our list of mass shootings and massacres is short. Let us hope it stays that way.

* * *

<div id="infoBox" class="hidden">
	<p class="infoTitle"><span id="label"></span></p>
	<p class="info"><span class="infoData"><span id="date"></span></span></p>
	<p class="info"><span class="infoData"><span id="location"></span></span></p>
	<p class="info"><span class="infoData"><span id="deaths"></span> deaths (includes victims and perpetrators)</span></p>
</div>

<div class="chartTitle">Notable Canadian Massacres and Murders Since 1950</div>

<div id="map" class="svg-container"></div>

* * *

<div id="chart"></div>

* * *

Sources:

- [List of massacres in Canada, *Wikipedia*](https://en.wikipedia.org/wiki/List_of_massacres_in_Canada)
- [This week in history: Police officer Leonard Hogue's grisly murder-suicide shocked region, *Vancouver Sun*](http://www.vancouversun.com/news/This+week+history+Police+officer+Leonard+Hogue+grisly+murder+suicide+shocked+region/9753959/story.html)
- [Trail leads from drug raid to murders, *Prime Time Crime*](http://www.primetimecrime.com/Recent/Murder/Sun%20Trail%20leads.htm)
- [2014 Edmonton killings, *Wikipedia*](https://en.wikipedia.org/wiki/2014_Edmonton_killings)
- [Wells Gray murders won’t soon be forgotten: Mulgrew (with video), *Vancouver Sun*](http://www.vancouversun.com/news/Wells+Gray+murders+soon+forgotten+Mulgrew+with+video/7262564/story.html)
- [10 of the worst mass murders in Canada, *Toronto Star*](https://www.thestar.com/news/canada/2014/12/30/10_of_the_worst_mass_murders_in_canada.html)
- [Canada's Deadliest Mass Murders (1900 - Present), *Night Time Podcast*](https://www.nighttimepodcast.com/blogmaster/canadas-worst-mass-murders)


<style>{% include 2017/02/massacres.css %}</style>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/topojson.v2.min.js"></script>
<script src="https://d3js.org/queue.v1.min.js"></script>
<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
<script src="https://d3js.org/d3-ease.v1.min.js"></script>
<script>{% include 2017/02/massacres.js %}</script>