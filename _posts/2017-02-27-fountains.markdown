---
layout: post
title:  "Reel Around the Fountain"
date:   2017-02-27 6:30:00
thumbnail: /img/2017/01/overdoseThumb.jpg
---

* * *

<div id="infoBox" class="hidden">
    <p class="infoTitle"><span id="area"></span> <span id="type"></span> Fountain</p>
    <p class="info">Neighbourhood: <span class="infoData"><span id="neighbourhood"></span></span></p>
    <p class="info">Colour/Material: <span class="infoData"><span id="colour"></span></span></p>
    <p class="info" id="styleLine">Style: <span class="infoData"><span id="style"></span></span></p>
    <p class="info" id="bowlLine">Bowl Height: <span class="infoData"><span id="height"></span></span> cm</p>
    <p class="info">Object ID: <span class="infoData"><span id="objid"></span></span></p>
    <img id="infoImg" />
</div>

<div id="map" class="svg-container"></div>
<div id="chart"></div>

* * *

Source: [New Westminster Open Data: Drinking Fountains](http://opendata.newwestcity.ca/datasets/drinking-fountains)

<style>{% include 2017/02/fountains.css %}</style>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="//d3js.org/d3-tile.v0.0.min.js"></script>
<script src="https://d3js.org/topojson.v2.min.js"></script>
<script src="https://d3js.org/queue.v1.min.js"></script>
<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
<script src="https://d3js.org/d3-ease.v1.min.js"></script>
<script>{% include 2017/02/fountains.js %}</script>