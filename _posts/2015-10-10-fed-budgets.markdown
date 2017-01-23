---
layout: post
title:  "Federal Budgets by Party"
date:   2015-10-10 12:00:00
---

In what may be the last (no promises, though) in my series of budget charts, I show the federal budgets and the party that passed them.

* * *

<div>
  <select id="selectFed">
    <option value="budgetBal" selected="selected">Budget balance</option>
    <option value="budgetInf">Budget balance adjusted for inflation (in 2015 dollars)</option>
  </select>
</div>
<div id="fedTip" class="hidden">
  <p id="tipTop"><strong><span id="tipYear"></span> Federal Budget</strong></p>
  <p class="tipInfo"><span id="tipVal"></span> billion dollars <span id="tipBal"></span> <span id="tipInf" class="hidden">(in 2015 dollars)</span></p>
  <p class="tipInfo">Party: <span id="tipParty"></span></p>
	<p class="tipInfo">Prime Minister: <span id="tipPM"></span></p>
	<p class="tipInfo">Finance Minister: <span id="tipFin"></span></p>
</div>
<div id="fedChart"></div>

* * *

Note that I really would have liked to include data from before 1968, but I could find virtually nothing about where to find said budgets. Another example of the [war on data](http://www.macleans.ca/news/canada/vanishing-canada-why-were-all-losers-in-ottawas-war-on-data/)?

Sources:

- [Department of Finance, Fiscal Reference Tables September 2015](http://www.fin.gc.ca/frt-trf/2015/frt-trf-15-eng.asp)
- [Government of Canada, Archived Budget Documents](http://www.budget.gc.ca/pdfarch/index-eng.html)
- Inflation adjustments courtesy of the [Bank of Canada's Inflation Calculator](http://www.bankofcanada.ca/rates/related/inflation-calculator/)


<style>
#fedChart .fedLegend {
	font-size: 12px;
}

#fedChart svg:not(:nth-of-type(1)) {
  margin-top: 25px;
}

#fedChart .bar.sel {
  fill: black;
}

#fedChart .bar.lib {
	fill: #BF3513;
}

#fedChart .bar.con {
	fill: #1340BF;
}

#fedChart .bar.pc {
	fill: #00BEF2;
}

#fedChart .axis text {
	font-size: 10px;
}

#fedChart .axis path,
#fedChart .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#fedTip {
  border: 1px solid black;
  background-color: white;
  position: absolute;
  width: 225px;
  height: auto;
  padding: 5px;
  pointer-events: none;
}

#fedTip strong {
  font-weight: bold;
}

#fedTip #tipTop {
  font-size: 16px;
  margin-bottom: 10px !important;
}

#fedTip .tipInfo {
  font-size: 12px;
  margin: 0;
}

.hidden {
	display: none;
}

</style>

<script src="http://d3js.org/d3.v3.min.js"></script>

<script>

fedChart();

var coordinates = [0, 0];

var body = d3.select("body")
  .on("mousemove", function() {
    coordinates = d3.mouse(this);
  })
  .on("mousedown", function() {
    coordinates = d3.mouse(this);
  });

function fedChart() {
	var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 740 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
		
	var y = d3.scale.linear()
    .range([height, 0]);

	var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2);
		
	var xAxis = d3.svg.axis();

	var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
		
	var format = d3.time.format("%Y");
	
	var fedChart = d3.select("#fedChart")
		.append("svg")
		  .attr("class", "fedBudgets")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
	var dispData = "Budget Balance";
	
	var parties = d3.scale.ordinal()
		.domain(["Liberal", "Progressive Conservative", "Conservative"])
		.range(["#BF3513", "#00BEF2", "#1340BF"]);
	
	d3.csv("{{ site.baseurl }}/data/fed_budgets.csv", type, function(error, data) {
		x.domain(data.map(function(d) { return d.Year; }));
		y.domain(d3.extent(data, function(d) { return d["Budget Balance"]; })).nice();
		
		drawAxes();
		
		var fedBudgets = fedChart.selectAll(".bar")
		    .data(data)
		  .enter().append("rect")
		    .attr("class", function(d) {
					if (d.Party === "Liberal") {
						return "bar lib";
					} else if (d.Party === "Conservative") {
						return "bar con";
					} else {
						return "bar pc";
					}
		    })
		    .attr("x", function(d) { return x(d.Year); })
		    .attr("y", function(d) { return y(0); })
		    .attr("width", x.rangeBand())
		    .attr("height", function(d) { return 0; })
		    .on("mouseover", function(d) {
					d3.select(this).attr("opacity", 0.5);
		      showTooltip(d);
		    })
		    .on("mousedown", function(d) {
					d3.select(this).attr("opacity", 0.5);
		      showTooltip(d);
		    })
		    .on("mouseout", function(d) {
					d3.select(this).attr("opacity", 1);
		      d3.select("#fedTip").classed("hidden", true);
		    });
				
				function showTooltip(d) {
	        var xPos = coordinates[0] + 10;
	        if (d.Year > 2000) {
	          xPos = coordinates[0] - 250;
	        }
	        var yPos = coordinates[1];
					
	        d3.select("#fedTip")
	          .style("left", xPos + "px")
	          .style("top", yPos + "px")
	          .select("#tipYear")
	          .text(d.Year);
						
          d3.select("#fedTip").select("#tipVal")
            .text(Math.abs(d[dispData]).toFixed(2));
					
          if (d[dispData] > 0) {
            d3.select("#fedTip").select("#tipBal")
              .text("surplus");
          } else {
            d3.select("#fedTip").select("#tipBal")
              .text("deficit");
          }
					
					if (dispData === "Budget Balance") {
						d3.select("#fedTip").select("#tipInf").classed("hidden", true);
					} else {
						d3.select("#fedTip").select("#tipInf").classed("hidden", false);						
					}
					
					d3.select("#fedTip").select("#tipParty")
						.text(d.Party);
						
					d3.select("#fedTip").select("#tipPM")
						.text(d["Prime Minister"]);
						
					d3.select("#fedTip").select("#tipFin")
						.text(d["Finance Minister"]);
					
					d3.select("#fedTip").classed("hidden", false);
				}
		
    fedBudgets.transition()
      .delay(function(d, i) { return i * 32})
      .attr("y", function(d) { return y(Math.max(0, d["Budget Balance"])); })
      .attr("height", function(d) { return Math.abs(y(d["Budget Balance"]) - y(0));});
			
	  var legend = fedChart.selectAll(".fedLegend")
	      .data(parties.domain())
	    .enter().append("g")
				.attr("class", "fedLegend")
	      .attr("transform", function(d, i) { return "translate(0," + i * -20 + ")"; });
				
	  legend.append("rect")
	      .attr("x", width - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", parties);

	  legend.append("text")
	      .attr("x", width - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d) { return d; });
			
		d3.select("#selectFed")
			.on("change", function(d) {
				if (this.options[this.selectedIndex].value === "budgetBal") {
					y.domain(d3.extent(data, function(d) { return d["Budget Balance"]; })).nice();
					
			    fedBudgets.transition()
			      .delay(function(d, i) { return i * 32})
			      .attr("y", function(d) { return y(Math.max(0, d["Budget Balance"])); })
			      .attr("height", function(d) { return Math.abs(y(d["Budget Balance"]) - y(0));});

					d3.selectAll("#fedChart g .x.axis").remove();
					d3.selectAll("#fedChart g .y.axis").remove();
				
					drawAxes();
						
					dispData = "Budget Balance";
				} else {
					y.domain(d3.extent(data, function(d) { return d["Budget Balance adjusted for inflation"]; })).nice();
					
			    fedBudgets.transition()
			      .delay(function(d, i) { return i * 32})
			      .attr("y", function(d) { return y(Math.max(0, d["Budget Balance adjusted for inflation"])); })
			      .attr("height", function(d) { return Math.abs(y(d["Budget Balance adjusted for inflation"]) - y(0));});
						
					d3.selectAll("#fedChart g .x.axis").remove();
					d3.selectAll("#fedChart g .y.axis").remove();
					
					drawAxes();
						
					dispData = "Budget Balance adjusted for inflation";
				}
			});
			
		function drawAxes() {
			fedChart.append("g")
			    .attr("class", "x axis")
			  .append("line")
			    .attr("y1", y(0))
			    .attr("y2", y(0))
					.attr("x2", width);

		  fedChart.append("g")
			    .attr("class", "y axis")
			    .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Billions");
		}	
	});
	
	function type(d) {
		//d.Year = format.parse(d.Year);
		d.Year = + d.Year;
		d["Budget Balance"] = (+d["Budget Balance"]) / 1000;
		d["Budget Balance adjusted for inflation"] = (+d["Budget Balance adjusted for inflation"]) / 1000;
		
		return d;
	}
	
}
</script>