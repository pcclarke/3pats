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
  <p id="tipTop"><strong><span id="tipBudget"></span></strong></p>
	<p id="tipInfo"><span id="tipVal"></span></p>
</div>

* * *

Sources:

- [Liberal Costing Plan](http://www.liberal.ca/costing-plan/)
- [NDP Balanced Fiscal Plan](http://xfer.ndp.ca/2015/2015-Full-Platform-EN.pdf) (PDF)
- [Conservative Costing Plan](http://www.conservative.ca/media/plan/costing-plan.pdf) (PDF)
- [Green Budget Overview](http://www.greenparty.ca/en/budget)


<style>

#versusChart {
  font-size: 10px;
}

#versusChart .axis path,
#versusChart .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#versusChart .x.axis path {
  display: none;
}

#versusChart .area.above {
  fill: rgba(252,141,89,0.5);
}

#versusChart .area.below {
  fill: rgba(145,207,96,0.5);
}

#versusChart .spendLine {
  fill: none;
  stroke: red;
  stroke-width: 1.5px;
}

#versusChart .revLine {
  fill: none;
  stroke: #808080;
  stroke-width: 1.5px;
}

#versusChart .circle {
	fill: #808080;
}

#versusChart .sel {
	stroke: #000000 !important;
}

#versusTip {
	display: block;
	margin-bottom: 15px;
  min-height: 50px;
	text-align: center;
	text-transform: capitalize;
}

#versusTip #tipTop {
	font-size: 24px;
  margin-bottom: 10px !important;
}

#versusTip .tipInfo {
  font-size: 12px;
  margin: 0;
}

.hidden {
	display: none;
}

#selectVersus {
  font-family: Lora, Georgia, serif;
  font-size: 20px;
  padding: 5px 15px;
}


</style>

<script src="http://d3js.org/d3.v3.min.js"></script>

<script>

versusChart();

function versusChart() {

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 740 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var numFormat = d3.format(",.0");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
		.ticks(4)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var revLine = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d["Revenue"]); });
		
var spendLine = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d["Spending"]); });

var area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y1(function(d) { return y(d["Revenue"]); });
		
drawVersus("liberal");
		
function drawVersus(kind) {
	var svg = d3.select("#versusChart").append("svg")
			.attr("class", "versusSvg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("{{ site.baseurl }}/data/2015/10/19/" + kind.toLowerCase() + "_versus.csv", function(error, data) {
	  if (error) throw error;

	  data.forEach(function(d) {
	    d.date = parseDate(d.date);
	    d["Revenue"]= +d["Revenue"];
	    d["Spending"] = +d["Spending"];
	  });

	  x.domain(d3.extent(data, function(d) { return d.date; }));

	  y.domain([
	    d3.min(data, function(d) { return Math.min(d["Revenue"], d["Spending"]); }),
	    d3.max(data, function(d) { return Math.max(d["Revenue"], d["Spending"]); })
	  ]);

	  svg.datum(data);

	  svg.append("clipPath")
	      .attr("id", "clip-below")
	    .append("path")
	      .attr("d", area.y0(height));

	  svg.append("clipPath")
	      .attr("id", "clip-above")
	    .append("path")
	      .attr("d", area.y0(0));

	  svg.append("path")
	      .attr("class", "area above")
	      .attr("clip-path", "url(#clip-above)")
	      .attr("d", area.y0(function(d) { return y(d["Spending"]); }));

	  svg.append("path")
	      .attr("class", "area below")
	      .attr("clip-path", "url(#clip-below)")
	      .attr("d", area);

	  svg.append("path")
	      .attr("class", "revLine")
	      .attr("d", revLine)
				.on("mouseover", function(d) {
					showTooltip(d, this, "Revenue");
				})
		    .on("mousedown", function(d) {
					showTooltip(d, this, "Revenue");
		    });
			
	  svg.append("path")
	      .attr("class", "spendLine")
	      .attr("d", spendLine)
				.on("mouseover", function(d) {
					showTooltip(d, this, "Spending");
				})
		    .on("mousedown", function(d) {
					showTooltip(d, this, "Spending");
		    });
				
		/*svg.selectAll(".revCircle")
				.data(data)
			.enter().append("circle")
				.attr("class", "circle")
				.attr("r", 5)
				.attr("cx", function(d) { return x(d.date); })
				.attr("cy", function(d) { return y(d.Revenue); })
				
				
		svg.selectAll(".spendCircle")
				.data(data)
			.enter().append("circle")
				.attr("class", "circle")
				.attr("r", 5)
				.attr("cx", function(d) { return x(d.date); })
				.attr("cy", function(d) { return y(d.Spending); })
				.on("mouseover", function(d) {
					showTooltip(d, this, "Spending");
				})
		    .on("mousedown", function(d) {
					showTooltip(d, this, "Spending");
		    });*/
				
		function showTooltip(d, obj, val) {
			d3.selectAll("#versusChart .sel").classed("sel", false);
			d3.select(obj).classed("sel", true);
	    d3.select("#versusTip").select("#tipBudget")
				.text(kind + " New " + val);
		}

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Millions ($)");
	});
}

d3.select("#selectVersus")
  .on("change", selected);

function selected() {
  d3.selectAll(".versusSvg")
    .remove();
  d3.select("#versusTip").select("#tipBudget")
    .text("");
  drawVersus(this.options[this.selectedIndex].value);
}

}

</script>