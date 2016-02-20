var bcdebt = function() {

	var margin = {top: 40, right: 20, bottom: 30, left: 40},
		width = 740 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;
	
	var format = d3.time.format("%Y-%m-%d");
	var numFormat = d3.format(",");

	var bcf = 0;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
		.rangeRound([height, 0]);

	var color = d3.scale.ordinal()
		.range(["#bd0026", "#f03b20", "#fd8d3c", "#fecc5c", "#ffffb2", "#d0743c", "#ff8c00"]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	var svg = d3.select("#debtChart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("class", "bars");

	var sortOption = "Election";

	var showDissolution = 0;
	var first = 0;
	
	generateChart();

	d3.selectAll(".showBCF")
		.on("click", includeBCF);
		
	function includeBCF() {
		bcf = (bcf == 0) ? 1 : 0;
		console.log(bcf);
		d3.select("#debtChart g.bars").selectAll( "g" ).remove(); 
		generateChart();
	}

	function generateChart() {

		d3.csv("{{ site.baseurl }}/data/2016/02/bc_debt.csv", type, function(error, data) {
			if (error) throw error;

			var color = d3.scale.ordinal().range(["#ebebeb", "#d6d6d6", "#c0c0c0", "#a9a9a9", "#929292", "#919191", "#797979", "#5e5e5e", "#424242", "#212121"]);
			color.domain(d3.keys(data[0]).filter(function(key) { 
				if (bcf == 1) {
					return key !== "year";
				} else {
					return key !== "year" && key !== "BC Ferries";
				}
			}));

			// Assign new data types
			data.forEach(function(d) {
				var y0 = 0;
				d.lengths = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
				d.total = d.lengths[d.lengths.length - 1].y1;
			});

			x.domain(data.map(function(d) { return d.year; }));
			y.domain([0, d3.max(data, function(d) { return d.total; })]);

			// X axis
			svg.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(xAxis);

			// Y axis
			svg.append("g")
				  .attr("class", "y axis")
				  .call(yAxis)
				.append("text")
				  .attr("transform", "rotate(-90)")
				  .attr("y", 6)
				  .attr("dy", ".71em")
				  .style("text-anchor", "end")
				  .text("Millions");

		  // Create election length data, align it horizontally
			var election = svg.selectAll(".election")
					.data(data)
				.enter().append("g")
					.attr("class", "electionBar")
					.attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; });

		  // Position election length data
		  election.selectAll("rect")
			  .data(function(d) {  return d.lengths; })
			.enter().append("rect")
			  .attr("width", x.rangeBand())
			  .attr("y", height)
			  .attr("height", 0)
			  .style("fill", function(d) { return color(d.name); })
			.attr("class", "databar")
			.on("mouseover", function(d, i) {
				showTooltip(d, i);
			})
			.on("mousedown", function(d, i) {
				showTooltip(d, i);
			});

		  function showTooltip(d, i) {
			//console.log(d);
	  
			d3.select("#debtTip")
				.select("#debtYear").text(d.name);
			d3.select("#debtTip")
				.select("#debtVal").text(numFormat(d.y1 - d.y0));
	  
			d3.select("#debtTip").classed("hidden", false);
		  }

		  // Create bar labels
		  election.append("text")
			  .attr("x", (x.rangeBand() /2))
			  .attr("y", height)
			  .attr("text-anchor", "middle")
			  .text(function(d) { return numFormat(d.total); });
  
		  election.transition()
			  .delay(function(d, i) {return i * 8})
			  .selectAll("rect")
			  .attr("y", function(d) {  return y(d.y1); })
			  .attr("height", function(d) { return y(d.y0) - y(d.y1); });
  
		  election.transition()
			  .delay(function(d, i) {return i * 8})
			  .selectAll("text")
			  .attr("y", function(d) { return y(d.total) - 5; });
	
			svg.append("line")
				.attr("x1", function(d) {
					return x("2015/16") - 2.5;
				})
				.attr("y1", y(0))
				.attr("x2", function(d) {
					return x("2015/16") - 2.5;
				})
				.attr("y2", -10)
				.attr("class", "vertical");
				
			svg.append("line")
				.attr("x1", function(d) {
					return x("2016/17") - 2.5;
				})
				.attr("y1", y(0))
				.attr("x2", function(d) {
					return x("2016/17") - 2.5;
				})
				.attr("y2", -10)
				.attr("class", "vertical");
				
			svg.append("line")
				.attr("x1", function(d) {
					return x("2017/18") - 2.5;
				})
				.attr("y1", y(0))
				.attr("x2", function(d) {
					return x("2017/18") - 2.5;
				})
				.attr("y2", -10)
				.attr("class", "vertical");
				
			svg.append("text")
				.attr("x", x("2014/15"))
				.attr("y", -15)
				.attr("font-style", "italic")
				.attr("text-anchor", "right")
				.text("Actual");
				
			svg.append("text")
				.attr("x", x("2015/16") + (x.rangeBand() / 2))
				.attr("y", -15)
				.attr("font-style", "italic")
				.attr("text-anchor", "middle")
				.text("Forecast");
				
			svg.append("text")
				.attr("x", x("2016/17") + (x.rangeBand() / 2))
				.attr("y", -15)
				.attr("font-style", "italic")
				.attr("text-anchor", "middle")
				.text("Estimate");
				
			svg.append("text")
				.attr("x", x("2017/18") + 25)
				.attr("y", -15)
				.attr("font-style", "italic")
				.attr("text-anchor", "middle")
				.text("Plan");
		});
	
	}
	
	function type(d) {
	
		var keys = d3.keys(d).filter(function(key) { return key !== "year"; });
		for (var i = 0; i < keys.length; i++) {
			d[keys[i]] = +d[keys[i]];
		}
		
		return d;
	}
}();