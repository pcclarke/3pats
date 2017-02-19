---
layout: post
title:  "Valley of the dolls, part 2"
date:   2017-02-15 9:30:00
thumbnail: /img/2017/01/overdoseThumb.jpg
---

I recently had the privilege of participating at the [Fraser Health hackathon](https://www.healthhackathon.ca/index.html), where my team presented on the [overdose analytics challenge](https://www.healthhackathon.ca/themes/theme7.html). There we got to work with some new data that Fraser Health has made available, including overdoses within the Fraser Health Authority's communities. Here it is visualized, with some additional data for context.

This data is for 2016, from the start of the year up to December 19th. As far as I know, no other health authority has released similar data, but I would imagine that the overdose situation isn't much different in the rest of British Columbia.

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
- [BC Stats Population Estimates](http://www.bcstats.gov.bc.ca/StatisticsBySubject/Demography/PopulationEstimates.aspx)

Disclaimer: as an employee of Fraser Health, this post in no way represents Fraser Health in any official capacity whatsoever.

<style>{% include 2017/02/hospitals.css %}</style>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/topojson.v2.min.js"></script>
<script src="https://d3js.org/queue.v1.min.js"></script>
<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
<script src="https://d3js.org/d3-ease.v1.min.js"></script>
<script>{% include 2017/02/hospitals.js %}</script>