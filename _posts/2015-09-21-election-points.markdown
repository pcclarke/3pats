---
layout: post
title:  "What is the normal length of an election campaign?"
date:   2015-09-21 12:00:00
---

Here's another thought: what constitutes an normal length election, anyways? Taking into account the time between elections and the party that called them, it isn't clear what the trend is, if there is one at all.

<div id="pointsTooltip" class="hidden">
	<p id="tipTop"><strong><span id="tipNum"></span> General Election</strong></p>
	<p class="tipInfo">Called by: <span id="tipParty"></span>, <span id="tipLeader"></span></p>
	<p class="tipInfo">Dissolution of previous parliament: <span id="tipDissolution"></span></p>
	<p class="tipInfo">Writs issued: <span id="tipWrits"></span></p>
	<p class="tipInfo">Election Day(s): <span id="tipElection"></span><span id="tipElection2" class="hidden"></span></p>
	<p class="tipInfo">Number of Days from Dissolution to Election: <span id="tipDissolutionDays"></span></p>
	<p class="tipInfo">Number of Days from Writ to Election: <span id="tipWritDays"></span></p>
</div>
<div id="pointsChart"></div>

<style>{% include 2015/09/epoints.css %}</style>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script>{% include 2015/09/epoints.js %}</script>