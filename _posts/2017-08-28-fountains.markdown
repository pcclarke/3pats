---
layout: post
title:  "Reel Around the Fountain"
date:   2017-08-28 13:30:00
thumbnail: /img/2017/08/fountainsThumb.jpg
---

Ever wonder where the drinking fountains in New Westminster are? Or where you can find a dog fountain? Here’s a map that can tell you just that, courtesy of New Westminster’s open data and me running around taking photos of drinking fountains.

*Note*: The combo icons are guesses based on whether a dog bowl was present. I did not have a dog to test with.

* * *

<div class="chartTitle">Drinking Fountains in New Westminster</div>

<div id="infoBox" class="hidden">
    <p class="infoTitle"><span id="type"></span> Fountain</p>
    <p class="info"><span class="infoLabel">Location</span>: <span class="infoData"><span id="area"></span></span></p>
    <p class="info"><span class="infoLabel">Neighbourhood</span>: <span class="infoData"><span id="neighbourhood"></span></span></p>
    <img id="infoImg" />
</div>

<div id="map"></div>

* * *

Source: [New Westminster Open Data](http://opendata.newwestcity.ca/datasets/drinking-fountains)

<link rel="stylesheet" href="https://mapzen.com/js/mapzen.css">
<style>{% include 2017/08/fountains.css %}</style>

<script src="https://mapzen.com/js/mapzen.min.js"></script>
<script src="//d3js.org/d3.v4.min.js"></script>
<script src="//d3js.org/d3-tile.v0.0.min.js"></script>
<script>{% include 2017/08/fountains.js %}</script>