otherChart();

var coordinates = [0, 0];

var body = d3.select("body")
  .on("mousemove", function() {
    coordinates = d3.mouse(this);
  })
  .on("mousedown", function() {
    coordinates = d3.mouse(this);
  });

function otherChart() {
	var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 740 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
		
	var y = d3.scale.linear()
    .range([height, 0]);

	var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2);
		
	var xAxis = d3.svg.axis();

	var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
		
	var format = d3.time.format("%Y");
	
	var otherChart = d3.select("#otherChart")
		.append("svg")
		  .attr("class", "otherBudgets")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
	var dispData = "Budget Balance";
	
	var parties = d3.scale.ordinal()
		.domain(["Liberal", "Progressive Conservative", "Conservative"])
		.range(["#bf988f", "#ceeaf2", "#bfbfbf"]);
	
	var other = [
		{ "Year": 2007, "Value": 479 },
		{ "Year": 2008, "Value": 34 },
		{ "Year": 2009, "Value": -318 },
		{ "Year": 2010, "Value": 211 },
		{ "Year": 2011, "Value": 2142 },
		{ "Year": 2012, "Value": -2292 },
		{ "Year": 2013, "Value": 64 },
		{ "Year": 2014, "Value": 2660 },
		{ "Year": 2015, "Value": -2360 }
	];
	
	var line = d3.svg.line()
    .x(function(d) { return x(d.Year) + 6; })
    .y(function(d) { return y(d.Value/1000); });
	
	d3.csv("{{ site.baseurl }}/data/fed_budgets.csv", type, function(error, data) {
		x.domain(data.map(function(d) { return d.Year; }));
		y.domain(d3.extent(data, function(d) { return d["Budget Balance"]; })).nice();

		drawAxes();
		
		var otherBudgets = otherChart.selectAll(".bar")
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
		    .attr("height", function(d) { return 0; });

    otherBudgets.transition()
      .delay(function(d, i) { return i * 32})
      .attr("y", function(d) { return y(Math.max(0, d["Budget Balance"])); })
      .attr("height", function(d) { return Math.abs(y(d["Budget Balance"]) - y(0)); });
		
		otherChart.append("path")
      .datum(other)
      .attr("class", "line")
      .attr("d", line);
		
		otherChart.selectAll(".other")
				.data(other)
			.enter().append("circle")
				.attr("class", "bar other")
				.attr("r", 3)
				.attr("cx", function(d) { return x(d.Year) + 6; })
				.attr("cy", function(d) { return y(d.Value/1000); })
			.on("mouseover", function(d) {
				d3.select(this).classed("sel", true);
				showTooltip(d);
			})
	    .on("mousedown", function(d) {
				d3.select(this).classed("sel", true);
				showTooltip(d);
	    })
	    .on("mouseout", function(d) {
				d3.select(this).classed("sel", false);
	      d3.select("#otherTip").classed("hidden", true);
	    });
			
		function showTooltip(d) {
	    var xPos = coordinates[0] + 10;
	    if (d.Year > 2000) {
	      xPos = coordinates[0] - 250;
	    }
	    var yPos = coordinates[1];
		
	    d3.select("#otherTip")
	      .style("left", xPos + "px")
	      .style("top", yPos + "px")
	      .select("#tipYear")
	      .text(d.Year);
			
	    d3.select("#otherTip").select("#tipVal")
	      .text(d.Value/1000);
		
      d3.select("#otherTip").select("#tipBal")
        .text((d.Value > 0) ? "surplus" : "deficit");
		
			d3.select("#otherTip").classed("hidden", false);
		}
			
	  var legend = otherChart.selectAll(".fedLegend")
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
			
		function drawAxes() {
			otherChart.append("g")
			    .attr("class", "x axis")
			  .append("line")
			    .attr("y1", y(0))
			    .attr("y2", y(0))
					.attr("x2", width);

		  otherChart.append("g")
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
		d.Year = + d.Year;
		d["Budget Balance"] = (+d["Budget Balance"]) / 1000;
		d["Budget Balance adjusted for inflation"] = (+d["Budget Balance adjusted for inflation"]) / 1000;
		
		return d;
	}
	
}