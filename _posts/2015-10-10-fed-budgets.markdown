---
layout: post
title:  "Federal Budgets by Party"
date:   2015-10-10 12:00:00
---

In what may be the last (no promises, though) in my series of budget charts, I show the federal budgets and the party that passed them.

* * *

<div>
  <select id="selectFed">
    <option value="budgetBal" selected="selected">Budget balance</option>
    <option value="budgetInf">Budget balance adjusted for inflation (in 2015 dollars)</option>
  </select>
</div>
<div id="fedTip" class="hidden">
  <p id="tipTop"><span id="tipYear"></span> Federal Budget</p>
  <p class="tipInfo"><span id="tipVal"></span> billion dollars <span id="tipBal"></span> <span id="tipInf" class="hidden">(in 2015 dollars)</span></p>
  <p class="tipInfo">Party: <span id="tipParty"></span></p>
	<p class="tipInfo">Prime Minister: <span id="tipPM"></span></p>
	<p class="tipInfo">Finance Minister: <span id="tipFin"></span></p>
</div>
<div id="fedChart"></div>

* * *

Note that I really would have liked to include data from before 1968, but I could find virtually nothing about where to find said budgets. Another example of the [war on data](http://www.macleans.ca/news/canada/vanishing-canada-why-were-all-losers-in-ottawas-war-on-data/)?

Sources:

- [Department of Finance, Fiscal Reference Tables September 2015](http://www.fin.gc.ca/frt-trf/2015/frt-trf-15-eng.asp)
- [Government of Canada, Archived Budget Documents](http://www.budget.gc.ca/pdfarch/index-eng.html)
- Inflation adjustments courtesy of the [Bank of Canada's Inflation Calculator](http://www.bankofcanada.ca/rates/related/inflation-calculator/)


<style>{% include 2015/10/fedBud.css %}</style>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script>{% include 2015/10/fedBud.js %}</script>