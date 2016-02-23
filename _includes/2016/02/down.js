var downBudget = function() {

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = 740 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	var x0 = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
		.range([height, 0]);

	var color = d3.scale.ordinal()
		.range(["#d6d6d6", "#c0c0c0", "#a9a9a9", "#929292", "#919191", "#797979", "#5e5e5e"]);

	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	var svg = d3.select("#downChart").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("{{ site.baseurl }}/data/2016/02/down.csv", function(error, data) {
	  if (error) throw error;

	  var budNames = d3.keys(data[0]).filter(function(key) { return key !== "year"; });

	  data.forEach(function(d) {
		d.buds = budNames.map(function(name) { return {name: name, year: d.year, value: +d[name]}; });
	  });

	  x0.domain(data.map(function(d) { return d.year; }));
	  x1.domain(budNames).rangeRoundBands([0, x0.rangeBand()]);
	  y.domain([d3.min(data, function(d) { return d3.min(d.buds, function(d) { return d.value; }); }), 
	  	d3.max(data, function(d) { return d3.max(d.buds, function(d) { return d.value; }); })]);
	  
		var vertical = svg.append("g");
		  	
		vertical.append("line")
			.attr("class", "vertical")
			.attr("x1", x0("2016/17") - 8)
			.attr("y1", y(y.domain()[0]))
			.attr("x2", x0("2016/17") - 8)
			.attr("y2", y(y.domain()[1]));
			
		vertical.append("line")
			.attr("class", "vertical")
			.attr("x1", x0("2017/18") - 8)
			.attr("y1", y(y.domain()[0]))
			.attr("x2", x0("2017/18") - 8)
			.attr("y2", y(y.domain()[1]));
		
	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);
		  
		svg.append("g")
			.attr("class", "xLine")
		.append("line")
		  .attr("y1", y(0))
		  .attr("y2", y(0))
		  .attr("x1", 0)
		  .attr("x2", width)
		  .style("stroke", "black");

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Billions");

	  var state = svg.selectAll(".state")
		  .data(data)
		.enter().append("g")
		  .attr("class", "state")
		  .attr("transform", function(d) { return "translate(" + x0(d.year) + ",0)"; });

	  var bars = state.selectAll("rect")
		  .data(function(d) { return d.buds; })
		.enter().append("rect")
			.attr("class", "bars")
		  .attr("width", x1.rangeBand())
		  .attr("x", function(d) { return x1(d.name); })
		  .attr("y", function(d) { return y(0); })
		  .attr("height", 0)
		  .style("fill", function(d) { return color(d.name); })
		  .on("mouseover", function(d) { toolTip(d, this); })
		  .on("click", function(d) { toolTip(d, this); });
		  
		bars.transition()
			.delay(function(d, i) {return i * 32})
			.attr("y", function(d) { return y(Math.max(0, d.value)); })
		  	.attr("height", function(d) { return Math.abs(y(d.value) - y(0)); });
		  
		var selected;
		
		  function toolTip(d, obj) {
		  	if (selected) {
		  		d3.select(selected).classed("selected", false);
			}
			
			selected = obj;
			d3.select(obj).classed("selected", true);
		  
			d3.select("#downTip")
				.select("#downName").text(d.name + " " + d.year);
			d3.select("#downTip")
				.select("#downVal").text(d.value + " billion dollars " + ((d.value > 0) ? "surplus" : "deficit"));
	  
			d3.select("#downTip").classed("hidden", false);
		  }

	});

}();