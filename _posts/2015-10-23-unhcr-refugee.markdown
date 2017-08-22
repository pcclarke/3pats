---
layout: post
title:  "UNHCR Refugees in Canada, Mapped"
date:   2015-10-23 22:00:00
thumbnail: /img/2015/10/unhcrMapThumb.jpg
---

And finally, here is the UNHCR data mapped.

Note that the colour scheme is relative to each year. The darkest red is the country with the most refugees living in Canada for that year. But a dark red in one year is not the same as a dark red in another year; there were twice as many refugees from Poland in 1994 as from Afghanistan in 2001.

**Update 22-08-2017**: Includes 2015 and 2016 refugee data.

* * *

<div><b>Year:</b>
  <select id="selectUnhcr">
	<option value="1994" selected="selected">1994</option>
	<option value="1995">1995</option>
    <option value="1996">1996</option>
    <option value="1997">1997</option>
    <option value="1998">1998</option>
    <option value="1999">1999</option>
    <option value="2000">2000</option>
    <option value="2001">2001</option>
	<option value="2002">2002</option>
    <option value="2003">2003</option>
    <option value="2004">2004</option>
    <option value="2005">2005</option>
    <option value="2006">2006</option>
    <option value="2007">2007</option>
    <option value="2008">2008</option>
    <option value="2009">2009</option>
    <option value="2010">2010</option>
    <option value="2011">2011</option>
    <option value="2012">2012</option>
    <option value="2013">2013</option>
    <option value="2014">2014</option>
    <option value="2015">2015</option>
    <option value="2016">2016</option>
  </select>
</div>

<div id="unchrChart" class="svg-container"></div>

<div id="sparkGroup" class="hidden">
  <p id="mapCountry"></p>
  <div id="unhcrSparkline"></div><span id="sparkValue"></span>
</div>

* * *

Source: [UNHCR Population Statistics](http://popstats.unhcr.org/en/overview)


<style>{% include 2015/10/unhcrMap.css %}</style>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/topojson.v2.min.js"></script>
<script src="https://d3js.org/queue.v1.min.js"></script>
<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
<script src="https://d3js.org/d3-ease.v1.min.js"></script>
<script>{% include 2015/10/unhcrMap.js %}</script>