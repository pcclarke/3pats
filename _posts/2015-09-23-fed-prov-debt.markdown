---
layout: post
title:  "Federal and Provincial Debt"
date:   2015-09-23 12:00:00
---

In part 2 of what has now become budget week, I'm following up yesterday's budget charts with debt charts. Once again, I'm comparing data between the federal government and provinces using data collected by the Royal Bank of Canada.

1. *Net debt*. As with the budget balances, debt is not exactly comparable between jurisdictions. These charts should just give you a general idea of the different debt patterns between governments.
2. *Net debt relative to GDP*. Shows the debt as a percentage of the GDP for that jurisdiction at that year.
3. *Net debt per capita*. The net debt per person in that jurisdiction. That is, the net debt divided by the number of people living in that area. I'm not sure if any distinction is made between residents and citizens when calculating per person.
4. *Net debt adjusted for inflation*. The net debt, adjusted for 2015 dollars to compensate for inflation.

<div id="debtTip" class="hidden">
  <p id="tipTop"><strong><span id="tipNum"></span></strong></p>
  <p class="tipInfo"><span id="tipVal"></span> <span id="tipBal"></span> <span id="tipCap" class="hidden">per capita</span> <span id="tipInf" class="hidden">(in 2015 dollars)</span></p>
  <p class="tipInfo hidden" id="tipFore">(projected)</p>
</div>
<div>
  <select id="selectDebt">
    <option value="net_debt" selected="selected">Net debt</option>
    <option value="net_debt_gdp">Net debt relative to GDP</option>
    <option value="net_debt_capita">Net debt per capita</option>
    <option value="net_debt_inf">Net debt adjusted for inflation</option>
  </select>
</div>
<div id="debtChart"></div>

Source: [Royal Bank of Canada, Canadian Federal and Provincial Fiscal Tables for September 15, 2015](http://www.rbc.com/economics/economic-reports/provincial-economic-forecasts.html), with the inflation adjustments courtesy of the [Bank of Canada's Inflation Calculator](http://www.bankofcanada.ca/rates/related/inflation-calculator/)

<style>
#debtChart {
  height: 1100px;
}

#debtChart svg:not(:nth-of-type(1)) {
  margin-top: 25px;
}

#debtChart .bar.positive {
  fill: black;
}

#debtChart .bar.negative {
  fill: brown;
}

#debtChart .bar.forepositive {
  fill: #808080;
}

#debtChart .bar.forenegative {
  fill: #FF5656;
}

#debtChart .axis text {
  font: 10px sans-serif;
}

#debtChart .axis path,
#debtChart .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#selectDebt {
  font-family: Lora, Georgia, serif;
  font-size: 20px;
  padding: 5px 15px;
}

.hidden {
  display: none;
}

#debtTip {
  border: 1px solid black;
  background-color: white;
  position: absolute;
  width: 180px;
  height: auto;
  padding: 5px;
  pointer-events: none;
}

#debtTip strong {
  font-weight: bold;
}

#debtTip #tipTop {
  font-size: 16px;
  margin-bottom: 10px !important;
}

#debtTip .tipInfo {
  font-size: 12px;
  margin: 0;
}
</style>

<script src="http://d3js.org/d3.v3.min.js"></script>
<script>
debtChart();

var coordinates = [0, 0];

var body = d3.select("body")
  .on("mousemove", function() {
    coordinates = d3.mouse(this);
  })
  .on("mousedown", function() {
    coordinates = d3.mouse(this);
  });

function debtChart() {
var sel = document.getElementById('selectDebt');
debtDraw(sel.options[sel.selectedIndex].value);

function debtDraw(kind) {
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

      var budgetChart = d3.select("#debtChart").append("svg")
        .attr("class", "fedProvDebt")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    	
      x.domain(data.map(function(d) { return d.Year; }));
      //y.domain(d3.extent(data, function(d) { return d[bud]; })).nice();
      y.domain([d3.max(data, function(d) { return d[bud]; }), 
        d3.min(data, function(d) { return d[bud] > 0 ? 0 : d[bud]; })]);

      var budgets = budgetChart.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", function(d) {
            if(checkForecast(d.Year, bud)) {
              return d[bud] > 0 ? "bar forenegative" : "bar forepositive"; 
            } else {
              return d[bud] > 0 ? "bar negative" : "bar positive"; 
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
            d3.select("#debtTip").classed("hidden", true);
          });

      budgets.transition()
        .delay(function(d, i) { return i * 32})
        .attr("y", function(d) { return y(Math.min(0, d[bud])); })
        .attr("height", function(d) { return Math.abs(y(0) - y(d[bud]));});

      function showTooltip(d) {
        var xPos = coordinates[0] + 10;
        if (x(d.Year) > 150) {
          xPos = coordinates[0] - 200;
        }
        var yPos = coordinates[1];

        d3.select("#debtTip")
          .style("left", xPos + "px")
          .style("top", yPos + "px")
          .select("#tipNum")
          .text(d.Year + " " + bud);

        if (bud === "Canada") {
          d3.select("#debtTip").select("#tipNum")
            .text(d.Year + " Federal ");
        }

        if (kind !== "net_debt_gdp") {
          if (Math.abs(d[bud]) > 1000) {
            d3.select("#debtTip").select("#tipVal")
              .text(Math.abs(d[bud]/1000).toFixed(2) + " billion dollars ");
          } else {
            d3.select("#debtTip").select("#tipVal")
              .text(Math.abs(d[bud]) + " million dollars ");
          }

          if (d[bud] < 0) {
            d3.select("#debtTip").select("#tipBal")
              .text("excess");
          } else {
            d3.select("#debtTip").select("#tipBal")
              .text("debt");
          }
        } else {
          d3.select("#debtTip").select("#tipVal")
            .text(Math.abs(d[bud]) + "% of GDP");
          d3.select("#debtTip").select("#tipBal")
            .text("");
        }

        if (kind === "net_debt_capita") {
          d3.select("#debtTip").select("#tipCap").classed("hidden", false);
        } else {
          d3.select("#debtTip").select("#tipCap").classed("hidden", true);
        }

        if (kind === "net_debt_inf") {
          d3.select("#debtTip").select("#tipInf").classed("hidden", false);
        } else {
          d3.select("#debtTip").select("#tipInf").classed("hidden", true);
        }

        if (checkForecast(d.Year, bud)) {
          d3.select("#debtTip").select("#tipFore").classed("hidden", false);
        } else {
          d3.select("#debtTip").select("#tipFore").classed("hidden", true);
        }

        d3.select("#debtTip").classed("hidden", false);
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

d3.select("#selectDebt")
  .on("change", selected);

function selected() {
  d3.selectAll(".fedProvDebt")
    .remove();
  debtDraw(this.options[this.selectedIndex].value);
}

}
</script>