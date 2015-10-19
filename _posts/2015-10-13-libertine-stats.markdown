---
layout: post
title:  "Libertine Numbers"
date:   2015-10-13 20:00:00
---

Today, this flyer arrived in my mailbox from the Liberal party in Burnaby North – Seymour for Terry Beech:
![Thanks, Terry Beech!]({{ site.baseurl }}/img/2015/10/13/lib_flyer.jpg)

Now I'm not a supporter of raising the minimum wage – for starters, I don't think it should be set by the federal government – but I'm sure that more than one percent of Canadian workers are on minimum wage. So I would think that more than one percent of workers would be affected by raising the minimum wage to $15.

Here's the percentage of workers on minimum wage in 2014 for the provinces and Canada as a whole:

<div id="minTip" class="hidden">
	<p id="tipTop"><strong><span id="tipProv"></span></strong></p>
	<p class="tipInfo"><span id="tipPercent"></span> of workers on minimum wage</p>
</div>
<div id="minWageChart"></div>

Maybe they were supposed to send this flyer to Alberta, because that's much more than one percent everywhere else.

Also, where are they getting the Conservatives' eight straight deficits from? I count six deficits [just going by the fiscal years for the budgets]({% post_url 2015-10-10-fed-budgets %}) or seven [if you include the two budgets in 2011](http://www.budget.gc.ca/pdfarch/index-eng.html). Maybe I'm just misreading it and they mean fiscal updates instead of budgets.

UPDATE: Must be an [old flyer](http://politics.theglobeandmail.com/2015/09/07/ask-the-globe-how-many-deficits-has-the-conservative-government-run/), based on earlier forecasts of a budget deficit. And I don't understand how budget years work.

Source: [Description for Chart 2 - Proportion of employees paid at the minimum wage rate by province, 2014](http://www.statcan.gc.ca/pub/11-630-x/2015006/c-g/desc2-eng.htm)

<style>

#minWageChart .bar {
  fill: #808080;
}

#minWageChart .barSel {
	fill: #000000 !important;
}

#minWageChart .barCan {
	fill: red;
}

#minWageChart .axis text {
  font-size: 10px;
}

#minWageChart .axis path,
#minWageChart .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#minWageChart .y.axis path {
  display: none;
}

#minTip {
  border: 1px solid black;
  background-color: white;
  position: absolute;
  width: 180px;
  height: auto;
  padding: 5px;
  pointer-events: none;
}

#minTip #tipTop {
  font-size: 18px;
  margin-bottom: 10px !important;
}

#minTip .tipInfo {
  font-size: 12px;
  margin: 0;
}

.hidden {
	display: none;
}


</style>

<script>

minChart();

var coordinates = [0, 0];

var body = d3.select("body")
  .on("mousemove", function() {
    coordinates = d3.mouse(this);
  })
  .on("mousedown", function() {
    coordinates = d3.mouse(this);
  });

function minChart() {

var margin = {top: 20, right: 30, bottom: 30, left: 150},
    width = 740 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);
		
var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .1);
		
var formatPercent = d3.format("%"),
		formatPercentDeci = d3.format(".1%");

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
		.tickFormat(formatPercent);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var minChart = d3.select("#minWageChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("{{ site.baseurl }}/data/2015/10/13/min_wage.csv", type, function(error, data) {
	
  y.domain(data.map(function(d) { return d.Province; }));
  x.domain([0, d3.max(data, function(d) { return d.percent; })]);

  minChart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  minChart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var minWages = minChart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", function(d) {
      	return (d.Province === "Canada") ? "barCan" : "bar";
      })
			.attr("x", function(d) { return x(0); })
      .attr("y", function(d) { return y(d.Province); })   
      .attr("width", function(d) { return x(0); })
      .attr("height", y.rangeBand())
		.on("mouseover", function(d) {
			d3.select(this).classed("barSel", true);
			showTooltip(d);
		})
		.on("mousedown", function(d) {
			d3.select(this).classed("barSel", true);
			showTooltip(d);
		})
		.on("mouseout", function(d) {
			d3.select(this).classed("barSel", false);
			d3.select("#minTip").classed("hidden", true);
		});
		
		minWages.transition()
			.delay(function(d, i) { return i * 8; })
			.attr("width", function(d) {return x(d.percent); });
		
		function showTooltip(d) {
	    var xPos = coordinates[0] + 10;
	    if (d.percent > 7) {
	      xPos = coordinates[0] - 250;
	    }
	    var yPos = coordinates[1];
			
		  d3.select("#minTip")
		    .style("left", xPos + "px")
		    .style("top", yPos + "px")
		    .select("#tipProv")
		    .text(d.Province);
				
			d3.select("#minTip").select("#tipPercent")
				.text(formatPercentDeci(d.percent));

			d3.select("#minTip").classed("hidden", false);
		}
});

function type(d) {
  d.percent = +d.percent;
	
  return d;
}

}

</script>