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