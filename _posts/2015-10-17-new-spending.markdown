---
layout: post
title:  "New Spending by Party"
date:   2015-10-17 12:00:00
---

It's absolutely remarkable how different the party costing plans are for new spending... plus how absolutely massive the Liberals' Canada Child Benefit and the Greens' Carbon Dividend is.

Note: The Green party includes some spending cuts in their total for "Spending Increases", which is why the total is higher here.

* * *

<div>
  <select id="selectSpending">
    <option value="ndp" selected="selected">NDP</option>
    <option value="lib">Liberal</option>
    <option value="con">Conservative</option>
    <option value="green">Green</option>
  </select>
</div>
<div id="partySpendingChart"></div>
<div id="partySpendingTip">
  <p id="tipTop"><span id="tipRegion"></span></p>
</div>

* * *

Sources:

- [Liberal Costing Plan](http://www.liberal.ca/costing-plan/)
- [NDP Balanced Fiscal Plan](http://xfer.ndp.ca/2015/2015-Full-Platform-EN.pdf) (PDF)
- [Conservative Costing Plan](http://www.conservative.ca/media/plan/costing-plan.pdf) (PDF)
- [Green Budget Overview](http://www.greenparty.ca/en/budget)


<style>{% include 2015/10/partySpending.css %}</style>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script>{% include 2015/10/partySpending.js %}</script>