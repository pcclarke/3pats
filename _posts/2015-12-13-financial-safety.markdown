---
layout: post
title:  "Spiders Should be Squished"
date:   2015-12-13 12:00:00
---

Maclean's recently put out a [set of 50 charts](http://www.macleans.ca/economy/economicanalysis/the-most-important-charts-for-the-canadian-economy-in-2016/), which were culled from a variety of experts and academics for what they think will be the most important chart for 2016. While the charts are pretty interesting for their data, their design is about what you might expect from non-designers. 

There is one particularly egregious [spider chart](http://www.macleans.ca/wp-content/uploads/2015/11/RObson.jpeg) from Jennifer Robson that stands as a good reminder of why spider (or radar) charts are a bad idea: it's really hard to compare the values on different axes. It's not the worst example of a spider chart because all of the data share the same scales and the lines fit neatly inside each other to make different sized webs (or nets?). But I think wanting to compare the values between the assets is a really obvious question, and the spider chart makes that difficult.

My redesign is similiar to a parallel coordinates chart, except that here all the values are percentages so it's not really a true parallel coordinates chart. Rather than using Robson's data, I used the Statistics Canada report she mentions, the [2012 Survey of Financial Security](http://www.statcan.gc.ca/daily-quotidien/150127/dq150127d-eng.htm). Since it has previous years, I thought it would be more interesting to show than just the 2012 values. But that means my categories are somewhat different than hers, which may or may not be important...

* * *

<div id="safetyTip" class="hidden">
  <p id="tipTop"><span id="tipTitle"></span></p>
  <p class="tipInfo hidden" id="tipWarning">Data unavailable or too unreliable to be published</span></p>
  <p class="tipInfo"><span id="tipText1"></span></p>
</div>
<p class="safetyTitle">Ownership of financial assets by household income quintile</p>
<div id="safetyChart"></div>
<label><input id="setBase" data-key="axes" type="checkbox" name="axes">Set all axes to 0-100%</label>

* * *

Source: [Statistics Canada CANSIM Table 205-0003](http://www5.statcan.gc.ca/cansim/a26?lang=eng&retrLang=eng&id=2050003&&pattern=&stByVal=1&p1=1&p2=-1&tabMode=dataTable&csid=)


<style>{% include 2015/12/safety.css %}</style>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="{{ site.baseurl }}/js/colorbrewer.js"></script>
<script>{% include 2015/12/safety.js %}</script>