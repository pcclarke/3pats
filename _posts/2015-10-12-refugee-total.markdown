---
layout: post
title:  "Total Refugees in Canada by Origin"
date:   2015-10-12 12:00:00
---

...but while we may be receiving more refugees from the Africa and the Middle East, the total number of refugees has declined over the past decade. Africa and the Middle East has increased in share mainly because the number of refugees from there has remained constant.

* * *

<div>
	<form id="refTotalForm">
	  <label><input type="radio" name="mode" value="multiples" checked> Separated</label>
	  <label><input type="radio" name="mode" value="stacked"> Stacked</label>
	</form>
</div>
<div id="refTotalChart"></div>
<div id="refTotalTip" class="hidden">
  <p id="tipTop"><strong><span id="tipRegion"></span></strong></p>
	<p class="tipInfo">Refugees: <span id="tipVal"></span></p>
</div>

* * *

Source: [Facts and figures 2014 – Immigration overview: Permanent residents](http://www.cic.gc.ca/english/resources/statistics/facts2014/permanent/08.asp)

<style>{% include 2015/10/refTotal.css %}</style>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script>{% include 2015/10/refTotal.js %}</script>