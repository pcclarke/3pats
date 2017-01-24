---
layout: post
title:  "Libertine Numbers"
date:   2015-10-13 20:00:00
---

Today, this flyer arrived in my mailbox from the Liberal party in Burnaby North – Seymour for Terry Beech:
![Thanks, Terry Beech!]({{ site.baseurl }}/img/2015/10/13/lib_flyer.jpg)

Now I'm not a supporter of raising the minimum wage – for starters, I don't think it should be set by the federal government – but I'm sure that more than one percent of Canadian workers are on minimum wage. So I would think that more than one percent of workers would be affected by raising the minimum wage to $15.

Here's the percentage of workers on minimum wage in 2014 for the provinces and Canada as a whole:

* * *

<div id="minWageChart"></div>
<div id="minTip">
	<p id="tipTop"><span id="tipProv"></span></p>
	<p class="tipInfo"><span id="tipPercent"></span> of workers on minimum wage</p>
</div>

* * *

Maybe they were supposed to send this flyer to Alberta, because that's much more than one percent everywhere else.

Also, where are they getting the Conservatives' eight straight deficits from? I count six deficits [just going by the fiscal years for the budgets]({% post_url 2015-10-10-fed-budgets %}) or seven [if you include the two budgets in 2011](http://www.budget.gc.ca/pdfarch/index-eng.html). Maybe I'm just misreading it and they mean fiscal updates instead of budgets.

UPDATE: Must be an [old flyer](http://politics.theglobeandmail.com/2015/09/07/ask-the-globe-how-many-deficits-has-the-conservative-government-run/), based on earlier forecasts of a budget deficit. And I don't understand how budget years work.

Source: [Description for Chart 2 - Proportion of employees paid at the minimum wage rate by province, 2014](http://www.statcan.gc.ca/pub/11-630-x/2015006/c-g/desc2-eng.htm)

<style>{% include 2015/10/minWage.css %}</style>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script>{% include 2015/10/minWage.js %}</script>