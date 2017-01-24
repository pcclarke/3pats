---
layout: post
title:  "New Revenue Versus New Spending"
date:   2015-10-19 12:00:00
---

The Liberals, Greens, and NDP – but not the Conservatives – all claim that they will find new sources of revenue by raising taxes and cutting various spending programs. But as with their spending plans, the numbers vary widely by party plan. The Liberals plan to spend far more than raise new revenues, the Greens plan to raise far more more than they will increase spending, and the NDP are somewhere in between.

The chart above compares their planned new spending versus new revenue. It does not include the expected budget revenue or spending, which would be in addition to this spending and revenue.

Note (yet again): The Green party includes some spending cuts on in their total for "Spending Increases". Here their spending only includes spending increases, and their new revenue includes some of the spending cuts included in spending increases. This is consistent with how the the Liberal and NDP costing.

* * *

<div>
  <select id="selectVersus">
		<option value="Liberal" selected="selected">Liberal</option>
    <option value="NDP">NDP</option>
    <option value="Green">Green</option>
  </select>
</div>
<div id="versusChart"></div>
<div id="versusTip">
  <p id="tipTop"><span id="tipBudget"></span></p>
	<p id="tipInfo"><span id="tipVal"></span></p>
</div>

* * *

Sources:

- [Liberal Costing Plan](http://www.liberal.ca/costing-plan/)
- [NDP Balanced Fiscal Plan](http://xfer.ndp.ca/2015/2015-Full-Platform-EN.pdf) (PDF)
- [Conservative Costing Plan](http://www.conservative.ca/media/plan/costing-plan.pdf) (PDF)
- [Green Budget Overview](http://www.greenparty.ca/en/budget)


<style>{% include 2015/10/versus.css %}</style>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script>{% include 2015/10/versus.js %}</script>