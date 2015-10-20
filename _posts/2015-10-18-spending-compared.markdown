---
layout: post
title:  "New Spending Compared"
date:   2015-10-18 12:00:00
---

<div id="compSpendingChart"></div>
<div id="compSpendingTip">
	<p id="tipTop"><strong><span id="tipParty">Green 2017</span> New Spending</strong></p>
	<p class="tipInfo"><span id="tipVal">44,537 million dollars</span></p>
</div>

* * *

Now to compare the different spending plans proposed by the parties, here they are in one chart.

Note: The Green party includes some spending cuts on in their total for "Spending Increases", which is why the total is higher here.

Sources:

- [Liberal Costing Plan](http://www.liberal.ca/costing-plan/)
- [NDP Balanced Fiscal Plan](http://xfer.ndp.ca/2015/2015-Full-Platform-EN.pdf) (PDF)
- [Conservative Costing Plan](http://www.conservative.ca/media/plan/costing-plan.pdf) (PDF)
- [Green Budget Overview](http://www.greenparty.ca/en/budget)

<style>

#compSpendingChart text {
  font-size: 10px;
}
#compSpendingChart .axis path,
#compSpendingChart .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#compSpendingChart .axis--y path {
  display: none;
}

#compSpendingChart .data {
  fill: none;
  stroke: #aaa;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-width: 1.5px;
}

#compSpendingChart .budget--hover {
  stroke: #000 !important;
}

#compSpendingChart .liberal {
  stroke: #d6191f;
}

#compSpendingChart .conservative {
  stroke: #0b6aaa;
}

#compSpendingChart .green {
  stroke: #3d9c34;
}

#compSpendingChart .ndp {
  stroke: #f37122;
}

#compSpendingChart .focus text {
  text-anchor: middle;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
}

#compSpendingChart .voronoi path {
  fill: none;
  pointer-events: all;
}

#compSpendingChart .voronoi--show path {
  stroke: red;
  stroke-opacity: .2;
}

#compSpendingTip {
	display: block;
	margin-bottom: 15px;
  pointer-events: none;
	text-align: center;
}

#compSpendingTip #tipTop {
	font-size: 24px;
  margin-bottom: 10px !important;
}

#compSpendingTip .tipInfo {
  font-size: 12px;
  margin: 0;
}

.hidden {
	display: none;
}

</style>

<script>

partyBals();

function partyBals() {
  var years,
      yearFormat = d3.time.format("%Y");
			
	var numFormat = d3.format(",.0");

  var margin = {top: 10, right: 20, bottom: 30, left: 50},
      width = 740 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var voronoi = d3.geom.voronoi()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); })
      .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

  var svg = d3.select("#compSpendingChart").append("svg")
      .attr("class", "budgetPlotted")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("{{ site.baseurl }}/data/2015/10/18/total_spending.csv", type, function(error, data) {
		
		console.log(data);
    x.domain(d3.extent(years));
    y.domain([d3.min(data, function(c) { 
        return d3.min(c.values, function(d) { return d.value; }); 
      }), 
      55000]).nice();

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis()
			.ticks(4)
          .scale(x)
          .orient("bottom"));

    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.svg.axis()
          .scale(y)
          .orient("left"))
			  .append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("y", 6)
			    .attr("dy", ".71em")
			    .style("text-anchor", "end")
			    .text("Millions");

    svg.append("g")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", function(d) { d.line = this; return line(d.values); })
				.attr("class", function(d) {
					return "data " + d.name.toLowerCase();
				});

    var focus = svg.append("g")
        .attr("transform", "translate(-100,-100)")
        .attr("class", "focus");

    focus.append("circle")
        .attr("r", 3.5);

    focus.append("text")
        .attr("y", -10);

    var voronoiGroup = svg.append("g")
        .attr("class", "voronoi");

    voronoiGroup.selectAll("path")
      .data(voronoi(d3.nest()
        .key(function(d) { return x(d.date) + "," + y(d.value); })
        .rollup(function(v) { return v[0]; })
        .entries(d3.merge(data.map(function(d) { return d.values; })))
        .map(function(d) { return d.values; })))
      .enter().append("path")
        .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
        .datum(function(d) { return d.point; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    function mouseover(d) {
      d3.select("#compSpendingTip").select("#tipParty")
				.text(d.budget.name + " " + d.date.getFullYear());
				
      d3.select("#compSpendingTip").select("#tipVal")
				.text(numFormat(Math.abs(d.value)) + " million dollars ");

      d3.select(d.budget.line).classed("budget--hover", true);
      d.budget.line.parentNode.appendChild(d.budget.line);
      focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
    }

    function mouseout(d) {
      d3.select(d.budget.line).classed("budget--hover", false);
      focus.attr("transform", "translate(-100,-100)");
    }
  });

  function type(d, i) {
		console.log(d);
    if (!i) years = Object.keys(d).map(yearFormat.parse).filter(Number);
    var budget = {
      name: d.Party,
      values: null
    };
    budget.values = years.map(function(m) {
      return {
        budget: budget,
        date: m,
        value: (+d[yearFormat(m)])
      };
    });
    return budget;
  }
}

</script>