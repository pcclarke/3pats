---
layout: post
title:  "One Last Look at the Party Costing Plans"
date:   2015-10-20 12:00:00
---

Just for posterity, let's go over the party costing plans once again. This time, I'll show the full hierarchy in which the parties organized their spending. This is mainly so we can all remember the ridiculous names under which they categorized their spending, such as:

- "Our Conservative Plan for Hard-Working Families and Seniors"
- "Help Where it's Needed Most"
- "Finding Hidden Money"
- "Public health healthy kids campaign"

Guess which party wrote which – except the Conservative one of course.

Note: The Green party includes some spending cuts in their total for "Spending Increases", which is why the total is higher here.

* * *

<div id="costingChart"></div>
<form>
  <label><input type="radio" name="mode" value="2016-17" checked> 2016-17</label>
  <label><input type="radio" name="mode" value="2017-18"> 2017-18</label>
	<label><input type="radio" name="mode" value="2018-19"> 2018-19</label>
	<label><input type="radio" name="mode" value="2019-20"> 2019-20</label>
</form>
<div>
  <select id="selectCosting">
		<option value="Liberal" selected="selected">Liberal</option>
		<option value="Conservative">Conservative</option>
    <option value="NDP">NDP</option>
    <option value="Green">Green</option>
  </select>
</div>
<div id="costingTip">
  <p id="tipTop"><span id="tipBudget"></span></p>
	<p id="tipInfo"><span id="tipVal"></span></p>
</div>

* * *

Sources:

- [Liberal Costing Plan](http://www.liberal.ca/costing-plan/)
- [NDP Balanced Fiscal Plan](http://xfer.ndp.ca/2015/2015-Full-Platform-EN.pdf) (PDF)
- [Conservative Costing Plan](http://www.conservative.ca/media/plan/costing-plan.pdf) (PDF)
- [Green Budget Overview](http://www.greenparty.ca/en/budget)


<style>{% include 2015/10/costing.css %}</style>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script>{% include 2015/10/costing.js %}</script>
