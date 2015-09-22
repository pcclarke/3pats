---
layout: post
title:  "Federal and Provincial Budget Balances"
date:   2015-09-22 12:00:00
---

Here's an overview of the budget balances for the federal and provincial governments, to give some context to the federal government's recently announced budget surplus. You can select from three options:

1. *The budget balance.* Each government has its own accounting practices, so they aren't exactly comparable. I am using numbers from the Royal Bank of Canada, who has made decisions on what to include and exclude for me.
2. *The budget balance relative to GDP*. This is the percentage of Canada's or the province's GDP in the budget balance. Or in other words, it's the budget balance divided by that government's GDP.
3. *The budget balance adjusted for inflation*. The budget balance in 2015 dollars, to account for past inflation.

<div id="budgetTip" class="hidden">
  <p id="tipTop"><strong><span id="tipNum"></span> Budget</strong></p>
  <p class="tipInfo"><span id="tipVal"></span> <span id="tipBal"></span></p>
  <p class="tipInfo hidden" id="tipFore">(projected)</p>
</div>
<div>
  <select id="selectBudget">
    <option value="budget_balances" selected="selected">Budget balances</option>
    <option value="budget_balances_gdp">Budget balances relative to GDP</option>
    <option value="budget_balances_inf">Budget balances adjusted for inflation</option>
  </select>
</div>
<div id="budgetChart"></div>

Source: [Royal Bank of Canada, Canadian Federal and Provincial Fiscal Tables for September 15, 2015](http://www.rbc.com/economics/economic-reports/provincial-economic-forecasts.html), with the inflation adjustments courtesy of the [Bank of Canada's Inflation Calculator](http://www.bankofcanada.ca/rates/related/inflation-calculator/)

<style>
#budgetChart {
  height: 1100px;
}

#budgetChart svg:not(:nth-of-type(1)) {
  margin-top: 25px;
}

#budgetChart .bar.positive {
  fill: black;
}

#budgetChart .bar.negative {
  fill: brown;
}

#budgetChart .bar.forepositive {
  fill: #808080;
}

#budgetChart .bar.forenegative {
  fill: #FF5656;
}

#budgetChart .axis text {
  font: 10px sans-serif;
}

#budgetChart .axis path,
#budgetChart .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#selectBudget {
  font-size: 24px;
}

.hidden {
  display: none;
}

#budgetTip {
  border: 1px solid black;
  background-color: white;
  position: absolute;
  width: 180px;
  height: auto;
  padding: 5px;
  pointer-events: none;
}

#budgetTip strong {
  font-weight: bold;
}

#budgetTip #tipTop {
  font-size: 16px;
  margin-bottom: 10px !important;
}

#budgetTip .tipInfo {
  font-size: 12px;
  margin: 0;
}
</style>

<script src="http://d3js.org/d3.v3.min.js"></script>
<script>
budgetChart();

var coordinates = [0, 0];

var body = d3.select("body")
  .on("mousemove", function() {
    coordinates = d3.mouse(this);
  })
  .on("mousedown", function() {
    coordinates = d3.mouse(this);
  });

function budgetChart() {
budgetDraw("budget_balances");

function budgetDraw(kind) {
  d3.csv("{{ site.baseurl }}/data/" + kind + ".csv", type, function(error, data) {

    d3.keys(data[0]).filter(function(key) { return key !== "Year"; }).forEach(function(bud) {

      var margin = {top: 30, right: 10, bottom: 10, left: 50},
          width = 370 - margin.left - margin.right,
          height = 150 - margin.top - margin.bottom;

      var y = d3.scale.linear()
          .range([height, 0]);

      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .2);

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var budgetChart = d3.select("#budgetChart").append("svg")
        .attr("class", "budgetDebt")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    	
      x.domain(data.map(function(d) { return d.Year; }));
      y.domain(d3.extent(data, function(d) { return d[bud]; })).nice();

      var budgets = budgetChart.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", function(d) {
            if(checkForecast(d.Year, bud)) {
              return d[bud] < 0 ? "bar forenegative" : "bar forepositive"; 
            } else {
              return d[bud] < 0 ? "bar negative" : "bar positive"; 
            }
          })
          .attr("x", function(d) { return x(d.Year); })
          .attr("y", function(d) { return y(0); })
          .attr("width", x.rangeBand())
          .attr("height", function(d) { return 0; })
          .on("mouseover", function(d, i) {
            showTooltip(d, i);
          })
          .on("mousedown", function(d, i) {
            showTooltip(d, i);
          })
          .on("mouseout", function(d) {
            d3.select("#budgetTip").classed("hidden", true);
          });

      budgets.transition()
        .delay(function(d, i) { console.log(d); return i * 32})
        .attr("y", function(d) { return y(Math.max(0, d[bud])); })
        .attr("height", function(d) { return Math.abs(y(d[bud]) - y(0));});

      function showTooltip(d) {
        var xPos = coordinates[0] + 10;
        if (x(d.Year) > 150) {
          xPos = coordinates[0] - 200;
        }
        var yPos = coordinates[1];

        d3.select("#budgetTip")
          .style("left", xPos + "px")
          .style("top", yPos + "px")
          .select("#tipNum")
          .text(d.Year + " " + bud);

        if (bud === "Canada") {
          d3.select("#budgetTip").select("#tipNum")
            .text(d.Year + " Federal ");
        }

        if (kind !== "budget_balances_gdp") {
          if (Math.abs(d[bud]) > 1000) {
            d3.select("#budgetTip").select("#tipVal")
              .text(Math.abs(d[bud]/1000).toFixed(2) + " billion dollars ");
          } else {
            d3.select("#budgetTip").select("#tipVal")
              .text(Math.abs(d[bud]) + " million dollars ");
          }

          if (d[bud] > 0) {
            d3.select("#budgetTip").select("#tipBal")
              .text("surplus");
          } else {
            d3.select("#budgetTip").select("#tipBal")
              .text("deficit");
          }
        } else {
          d3.select("#budgetTip").select("#tipVal")
            .text(d[bud] + "%");
          d3.select("#budgetTip").select("#tipBal")
            .text("");
        }

        if (checkForecast(d.Year, bud)) {
          d3.select("#budgetTip").select("#tipFore").classed("hidden", false);
        } else {
          d3.select("#budgetTip").select("#tipFore").classed("hidden", true);
        }

        d3.select("#budgetTip").classed("hidden", false);
      }

      function checkForecast(year, province) {
        if((year == 2015 && (province === "Manitoba" || province === "Ontario" || province === "Quebec" || province === "New Brunswick" || province === "Prince Edward Island" || province === "Newfoundland and Labrador")) || year == 2016) {
          return 1; 
        }
        return 0;
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
}

function type(d) {
    d.Canada = +d.Canada;
    d.Alberta = +d.Alberta;
    d["British Columbia"] = +d["British Columbia"];
    d.Manitoba = +d.Manitoba;
    d["New Brunswick"] = +d["New Brunswick"];
    d["Newfoundland and Labrador"] = +d["Newfoundland and Labrador"];
    d["Nova Scotia"] = +d["Nova Scotia"];
    d.Ontario = +d.Ontario;
    d["Prince Edward Island"] = +d["Prince Edward Island"];
    d.Quebec = +d.Quebec;
    d.Saskatchewan = +d.Saskatchewan;
    d.Year = +(d.Year.substring(0, 4)) + 1;
  return d;
}

d3.select("#selectBudget")
  .on("change", selected);

function selected() {
  d3.selectAll(".budgetDebt")
    .remove();
  budgetDraw(this.options[this.selectedIndex].value);
}

}
</script>