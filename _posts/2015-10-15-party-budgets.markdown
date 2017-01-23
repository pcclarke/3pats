---
layout: post
title:  "Some budgets are bigger than others"
date:   2015-10-15 12:00:00
---

Here's a comparison of the different party budget balances from their costing plans. They're all very optimistic about 2020.

* * *

<div id="partyBalanceChart"></div>
<div id="partyBalanceTip">
	<p id="tipTop"><strong><span id="tipParty">NDP 2016-17</span> Budget</strong></p>
	<p class="tipInfo"><span id="tipVal">4.11 billion dollars</span> <span id="tipBal">surplus</span></p>
</div>

* * *

Sources:

- [Liberal Costing Plan](http://www.liberal.ca/costing-plan/)
- [NDP Balanced Fiscal Plan](http://xfer.ndp.ca/2015/2015-Full-Platform-EN.pdf) (PDF)
- [Conservative Costing Plan](http://www.conservative.ca/media/plan/costing-plan.pdf) (PDF)
- [Green Budget Overview](http://www.greenparty.ca/en/budget)

<style>

#partyBalanceChart {
  height: 400px;
}

#partyBalanceChart svg:not(:nth-of-type(1)) {
  margin-top: 25px;
}

#partyBalanceChart .bar.positive {
  fill: #808080;
}

#partyBalanceChart .bar.negative {
  fill: brown;
}

#partyBalanceChart .sel {
	fill: black !important;
}

#partyBalanceChart .axis text {
  font-size: 10px;
}

#partyBalanceChart .axis path,
#partyBalanceChart .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#partyBalanceTip {
	display: block;
	margin-bottom: 15px;
  pointer-events: none;
}

#partyBalanceTip #tipTop {
  font-size: 18px;
  margin-bottom: 10px !important;
}

#partyBalanceTip .tipInfo {
  font-size: 12px;
  margin: 0;
}

.hidden {
	display: none;
}

</style>

<script src="http://d3js.org/d3.v3.min.js"></script>

<script>

partyBalanceChart();

function partyBalanceChart() {
  d3.csv("{{ site.baseurl }}/data/2015/10/15/partyBal.csv", type, function(error, data) {

    d3.keys(data[0]).filter(function(key) { return key !== "Year" && key !== "YearLabel"; }).forEach(function(bud) {

      var margin = {top: 30, right: 10, bottom: 10, left: 50},
          width = 370 - margin.left - margin.right,
          height = 150 - margin.top - margin.bottom;

      var y = d3.scale.linear()
          .range([height, 0]);

      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .2);

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
					.ticks(4);

      var budgetChart = d3.select("#partyBalanceChart").append("svg")
        .attr("class", "budgetParties")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    	
      x.domain(data.map(function(d) { return d.Year; }));
	    y.domain([d3.min(data, function(d) { return d[bud] > 0 ? 0 : d[bud]; }),
				d3.max(data, function(d) { return d[bud]; })]).nice();

      var budgets = budgetChart.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", function(d) { 
						if (bud === "NDP" && d.Year == 2017) {
							return d[bud] < 0 ? "bar sel negative" : "bar sel positive"; 
						} else {
							return d[bud] < 0 ? "bar negative" : "bar positive"; 
						}
					})
          .attr("x", function(d) { return x(d.Year); })
          .attr("y", function(d) { return y(0); })
          .attr("width", x.rangeBand())
          .attr("height", function(d) { return 0; })
          .on("mouseover", function(d, i) {
						d3.selectAll("#partyBalanceChart .sel").classed("sel", false);
						d3.select(this).classed("sel", true);
            showTooltip(d);
          })
          .on("mousedown", function(d, i) {
						d3.selectAll("#partyBalanceChart .sel").classed("sel", false);
						d3.select(this).classed("sel", true);
            showTooltip(d);
          });

      budgets.transition()
        .delay(function(d, i) { return i * 32})
        .attr("y", function(d) { return y(Math.max(0, d[bud])); })
        .attr("height", function(d) { return Math.abs(y(d[bud]) - y(0));});

      function showTooltip(d) {
        d3.select("#partyBalanceTip").select("#tipParty")
          .text(bud + " " + d.YearLabel);

        if (Math.abs(d[bud]) >= 1000) {
          d3.select("#partyBalanceTip").select("#tipVal")
            .text(Math.abs(d[bud]/1000).toFixed(2) + " billion dollars ");
        } else {
          d3.select("#partyBalanceTip").select("#tipVal")
            .text(Math.abs(d[bud]) + " million dollars ");
        }

        if (d[bud] > 0) {
          d3.select("#partyBalanceTip").select("#tipBal")
            .text("surplus");
        } else {
          d3.select("#partyBalanceTip").select("#tipBal")
            .text("deficit");
        }
      }

      budgetChart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      budgetChart.append("g")
          .attr("class", "x axis")
        .append("line")
          .attr("y1", y(0))
          .attr("y2", y(0))
          .attr("x2", width);

      budgetChart.append("text")
        .attr("x", 0)
        .attr("dy", -10)
        .style("font-weight", "bold")
        .text(bud);
    });
  });
	
	function type(d) {
	    d.NDP = +d.NDP;
			d.Conservative = +d.Conservative;
			d.Liberal = +d.Liberal;
			d.Green = +d.Green;
			d.YearLabel = d.Year;
	    d.Year = +(d.Year.substring(0, 4)) + 1;
	  return d;
	}
}

</script>