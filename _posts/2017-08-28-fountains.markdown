---
layout: post
title:  "Reel Around the Fountain"
date:   2017-08-26 6:30:00
thumbnail: /img/2017/08/fountainsThumb.jpg
---

blah blah blah

* * *

<div class="chartTitle">Drinking Fountains in New Westminster</div>

<div id="infoBox" class="hidden">
    <p class="infoTitle"><span id="type"></span> Fountain</p>
    <p class="info"><span class="infoLabel">Location</span>: <span class="infoData"><span id="area"></span></span></p>
    <p class="info"><span class="infoLabel">Neighbourhood</span>: <span class="infoData"><span id="neighbourhood"></span></span></p>
    <img id="infoImg" />
</div>

<div id="legend">
    <div class="legTitle">Legend</div>
    <div class="legItem"><img src="{{ site.baseurl }}/img/2017/08/standard_fountain.png"> Standard drinking fountain</div>
    <div class="legItem"><img src="{{ site.baseurl }}/img/2017/08/dog_fountain.png"> Dog tap</div>
    <div class="legItem"><img src="{{ site.baseurl }}/img/2017/08/combo_fountain.png"> Combo standard/dog fountain</div>
    <div class="legItem"><img src="{{ site.baseurl }}/img/2017/08/tap_fountain.png"> Drinking tap</div>
    <div class="legItem"><img src="{{ site.baseurl }}/img/2017/08/decomissioned_fountain.png"> Decomissioned fountain</div>
</div>

<div id="map"></div>

* * *

Sources:

- [New Westminster Open Data](http://opendata.newwestcity.ca/datasets/drinking-fountains)

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"
   integrity="sha512-M2wvCLH6DSRazYeZRIm1JnYyh22purTM+FDB5CsyxtQJYeKq83arPe5wgbNmcFXGqiSH2XR8dT/fJISVA1r/zQ=="
   crossorigin=""/>
<style>{% include 2017/08/fountains.css %}</style>

<script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"
   integrity="sha512-lInM/apFSqyy1o6s89K4iQUKg6ppXEgsVxT35HbzUupEVRh2Eu9Wdl4tHj7dZO0s1uvplcYGmt3498TtHq+log=="
   crossorigin=""></script>
<script src="//d3js.org/d3.v4.min.js"></script>
<script src="//d3js.org/d3-tile.v0.0.min.js"></script>
<script>{% include 2017/08/fountains.js %}</script>