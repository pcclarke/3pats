---
layout: post
title:  "Federal and Provincial Budgets by Year"
date:   2015-10-09 12:00:00
---

Whoops. Budget week (and this blog) got severely knocked off course, because I was knocked off my bike a couple weeks ago. I'm healed up, and back to the intense work of sitting down at my computer – it's hard to sit down when bending your knee hurts.

In part 3 of my series of budget charts, I compare the budget balances and debt on a line plot. This should make it clearer how the different jurisdictions compare in scale.

* * *

<div id="fpdbTip" class="hidden">
  <p id="tipTop"><strong><span id="tipNum"></span></strong></p>
  <p class="tipInfo"><span id="tipVal"></span> <span id="tipBal"></span> <span id="tipCap" class="hidden">per capita</span> <span id="tipInf" class="hidden">(in 2015 dollars)</span></p>
  <p class="tipInfo hidden" id="tipFore">(projected)</p>
</div>
<div>
  <select id="selectBudgetPlot">
    <option value="budget_balances_t" selected="selected">Budget balances</option>
		<option value="budget_balances_inf_t">Budget balances adjusted for inflation</option>
    <option value="budget_balances_gdp_t">Budget balances relative to GDP</option>
    <option value="net_debt_t">Net debt</option>
		<option value="net_debt_inf_t">Net debt adjusted for inflation</option>
    <option value="net_debt_gdp_t">Net debt relative to GDP</option>
    <option value="net_debt_capita_t">Net debt per capita</option>
  </select>
</div>
<div id="budgetPlot"></div>

* * *

Source: [Royal Bank of Canada, Canadian Federal and Provincial Fiscal Tables for September 15, 2015](http://www.rbc.com/economics/economic-reports/provincial-economic-forecasts.html), with the inflation adjustments courtesy of the [Bank of Canada's Inflation Calculator](http://www.bankofcanada.ca/rates/related/inflation-calculator/)


<style>

#budgetPlot text {
  font-size: 10px;
}
#budgetPlot .axis path,
#budgetPlot .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.axis--y path {
  display: none;
}

.cities {
  fill: none;
  stroke: #aaa;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-width: 1.5px;
}

.city--hover {
  stroke: #000;
}

.focus text {
  text-anchor: middle;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
}

.voronoi path {
  fill: none;
  pointer-events: all;
}

.voronoi--show path {
  stroke: red;
  stroke-opacity: .2;
}

.hidden {
  display: none;
}

#fpdbTip {
  border: 1px solid black;
  background-color: white;
  position: absolute;
  width: 180px;
  height: auto;
  padding: 5px;
  pointer-events: none;
}

#fpdbTip strong {
  font-weight: bold;
}

#fpdbTip #tipTop {
  font-size: 16px;
  margin-bottom: 10px !important;
}

#fpdbTip .tipInfo {
  font-size: 12px;
  margin: 0;
}
</style>

<script src="http://d3js.org/d3.v3.min.js"></script>

<script>

budgetPlot();

var coordinates = [0, 0];

var body = d3.select("body")
  .on("mousemove", function() {
    coordinates = d3.mouse(this);
  })
  .on("mousedown", function() {
    coordinates = d3.mouse(this);
  });

function budgetPlot() {
  var years,
      yearFormat = d3.time.format("%Y");

  var margin = {top: 20, right: 10, bottom: 30, left: 50},
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

  var sel = document.getElementById('selectBudgetPlot');
  drawBudgetPlot(sel.options[sel.selectedIndex].value);

  function drawBudgetPlot(kind) {
    var svg = d3.select("#budgetPlot").append("svg")
        .attr("class", "budgetPlotted")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("{{ site.baseurl }}/data/" + kind + ".csv", type, function(error, cities) {
      x.domain(d3.extent(years));
      y.domain([d3.min(cities, function(c) { 
          return d3.min(c.values, function(d) { return d.value; }); 
        }), 
        d3.max(cities, function(c) { 
          return d3.max(c.values, function(d) { return d.value; }); 
        })]).nice();

      svg.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.svg.axis()
            .scale(x)
            .orient("bottom"));

      svg.append("g")
          .attr("class", "axis axis--y")
          .call(d3.svg.axis()
            .scale(y)
            .orient("left"));

      svg.append("g")
          .attr("class", "cities")
        .selectAll("path")
          .data(cities)
        .enter().append("path")
          .attr("d", function(d) { d.line = this; return line(d.values); });

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
          .entries(d3.merge(cities.map(function(d) { return d.values; })))
          .map(function(d) { return d.values; })))
        .enter().append("path")
          .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
          .datum(function(d) { return d.point; })
          .on("mouseover", mouseover)
          .on("mouseout", mouseout);

      function mouseover(d) {
        var xPos = coordinates[0] + 10;

        if (d.date.getFullYear() > 2000) {
          xPos = coordinates[0] - 200;
        }
        var yPos = coordinates[1];

        
        d3.select("#fpdbTip")
          .style("left", xPos + "px")
          .style("top", yPos + "px")
          .select("#tipNum")
          .text(d.date.getFullYear() + " " + d.budget.name);

				if (kind.indexOf("budget") > -1) {
					if (kind !== "budget_balances_gdp_t") {
						
						if (Math.abs(d.value) > 1000) {
						  d3.select("#fpdbTip").select("#tipVal")
						    .text(Math.abs(d.value/1000).toFixed(2) + " billion dollars ");
						} else {
							console.log(kind.indexOf("budget"));
						  d3.select("#fpdbTip").select("#tipVal")
						    .text(Math.abs(d.value) + " million dollars ");
						}

						if (d.value > 0) {
						  d3.select("#fpdbTip").select("#tipBal")
						    .text("surplus");
						} else {
						  d3.select("#fpdbTip").select("#tipBal")
						    .text("deficit");
						}
					} else {
					d3.select("#fpdbTip").select("#tipVal")
					  .text(d.value + "% of GDP");
					d3.select("#fpdbTip").select("#tipBal")
					  .text("");
					}
				} else if (kind.indexOf("debt") > -1) {
	        if (kind !== "net_debt_gdp_t") {
	          if (Math.abs(d.value) > 1000) {
	            d3.select("#fpdbTip").select("#tipVal")
	              .text(Math.abs(d.value/1000).toFixed(2) + " billion dollars ");
	          } else {
	            d3.select("#fpdbTip").select("#tipVal")
	              .text(Math.abs(d.value) + " million dollars ");
	          }

	          if (d.value < 0) {
	            d3.select("#fpdbTip").select("#tipBal")
	              .text("excess");
	          } else {
	            d3.select("#fpdbTip").select("#tipBal")
	              .text("debt");
	          }
	        } else {
	          d3.select("#fpdbTip").select("#tipVal")
	            .text(Math.abs(d.value) + "% of GDP");
	          d3.select("#fpdbTip").select("#tipBal")
	            .text("");
	        }
				}

        if (kind.indexOf("capita") > -1) {
          d3.select("#fpdbTip").select("#tipCap").classed("hidden", false);
        } else {
          d3.select("#fpdbTip").select("#tipCap").classed("hidden", true);
        }

        if (kind.indexOf("inf") > -1) {
          d3.select("#fpdbTip").select("#tipInf").classed("hidden", false);
        } else {
          d3.select("#fpdbTip").select("#tipInf").classed("hidden", true);
        }

        if (checkForecast(d.date.getFullYear(), d.budget.name)) {
          d3.select("#fpdbTip").select("#tipFore").classed("hidden", false);
        } else {
          d3.select("#fpdbTip").select("#tipFore").classed("hidden", true);
        }

        d3.select("#fpdbTip").classed("hidden", false);

        d3.select(d.budget.line).classed("city--hover", true);
        d.budget.line.parentNode.appendChild(d.budget.line);
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
        /*focus.select("text").text(d.budget.name + " " + d.value);*/
      }

      function mouseout(d) {
        d3.select("#fpdbTip").classed("hidden", true);

        d3.select(d.budget.line).classed("city--hover", false);
        focus.attr("transform", "translate(-100,-100)");
      }
			
      function checkForecast(year, province) {
        if((year == 2015 && (province === "Manitoba" || province === "Ontario" || province === "Quebec" || province === "New Brunswick" || province === "Prince Edward Island" || province === "Newfoundland and Labrador")) || year == 2016) {
          return 1; 
        }
        return 0;
      }
    });
  }

  function type(d, i) {
    if (!i) years = Object.keys(d).map(yearFormat.parse).filter(Number);
    var budget = {
      name: d.Jurisdiction,
      values: null
    };
    budget.values = years.map(function(m) {
      return {
        budget: budget,
        date: m,
        value: +d[yearFormat(m)]
      };
    });
    return budget;
  }

  d3.select("#selectBudgetPlot")
    .on("change", function(d) {
      d3.select(".budgetPlotted")
        .remove();
      drawBudgetPlot(this.options[this.selectedIndex].value);
    });
}
</script>