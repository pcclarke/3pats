---
layout: post
title:  "Big mean debt machine"
date:   2016-02-19 12:00:00
---

* * *

<div class="debtTitle">BC Budget Debt</div>

<label class="showBCFerries"><input class="show" name="bcFerries" type="checkbox">Include BC Ferries debt (to 2015)</label>

<div id="debtChart"></div>
<div id="debtTip" class="hidden">
	<p class="tipTitle"><span id="debtYear"></span></p>
	<p class="tipInfo"><span id="debtVal"></span> million dollars</p>
</div>

* * *

<style>{% include 2016/02/bcdebt.css %}</style>
<script type="text/javascript" src="{{ site.baseurl }}/js/colorbrewer.js"></script>
<script>{% include 2016/02/bcdebt.js %}</script>