---
layout: post
title:  "Valley of the dolls, part 2"
date:   2017-02-20 5:00:00
thumbnail: /img/2017/01/overdoseThumb.jpg
---

This post follows up [my previous post on overdoses in the Fraser Valley]({% post_url 2017-01-30-overdose %}). This time, I'm visualizing overdoses at hospitals. The data reports on how many of those overdoses were by homeless people, although I'm not sure if you can draw much of a conclusion from that.

Like the previous post, this overdose data is for 2016 from the start of the year up to December 19th.

* * *

<div id="infoBox" class="infoBox hidden">
	<p class="infoTitle"><span id="label"></span></p>
	<p class="info"><span id="community"></span></p>
	<p class="info">Homeless: <span class="infoData"><span id="hlsVal"></span> (<span id="hlsPer"></span>) overdoses</span></p>
	<p class="info">Overall: <span class="infoData"><span id="ovVal"></span> overdoses</span></p>
</div>

<div class="chartTitle">Overdoses in Fraser Health Hospitals in 2016</div>

<div id="map" class="svg-container"></div>

* * *

<div id="chart"></div>

* * *

Sources: 

- [Fraser Health Hackathon Github](https://github.com/healthhackathon)

Disclaimer: as an employee of Fraser Health, this post in no way represents Fraser Health in any official capacity whatsoever.

<style>{% include 2017/02/hospitals.css %}</style>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/topojson.v2.min.js"></script>
<script src="https://d3js.org/queue.v1.min.js"></script>
<script src="https://d3js.org/d3-ease.v1.min.js"></script>
<script>{% include 2017/02/hospitals.js %}</script>