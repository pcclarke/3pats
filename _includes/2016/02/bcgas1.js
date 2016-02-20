var bcgas = function() {
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 740 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%Y").parse;

	var x = d3.time.scale()
    	.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);
		
	var M;

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var line = d3.svg.area()
		.interpolate("basis")
		.x(function(d) { return x(d.Year); })
		.y(function(d) { return y(d["Budget 2016"]); });

	var area = d3.svg.area()
		.interpolate("basis")
		.x(function(d) { return x(d.Year); })
		.y1(function(d) { return y(d["Budget 2016"]); });

	var svg = d3.select("#bcgasChart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("{{ site.baseurl }}/data/2016/02/bc_gas_royalties_t.csv", type, function(error, data) {
	  if (error) throw error;

		x.domain(d3.extent(data, function(d) { return d.Year; }));

	  y.domain([
		d3.min(data, function(d) { return Math.min(d["Budget 2016"], d["Budget 2015"]); }),
		d3.max(data, function(d) { return Math.max(d["Budget 2016"], d["Budget 2015"]); })
	  ]);

	  svg.datum(data);

	  svg.append("clipPath")
		  .attr("id", "clip-below")
		.append("path")
		  .attr("d", area.y0(height));

	  svg.append("clipPath")
		  .attr("id", "clip-above")
		.append("path")
		  .attr("d", area.y0(0));

	  svg.append("path")
		  .attr("class", "area above")
		  .attr("clip-path", "url(#clip-above)")
		  .attr("d", area.y0(function(d) { return y(d["Budget 2015"]); }))
		  .on("mouseover", function(d) {

		  });

	  svg.append("path")
		  .attr("class", "area below")
		  .attr("clip-path", "url(#clip-below)")
		  .attr("d", area);

	  svg.append("path")
		  .attr("class", "line")
		  .attr("d", line);

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Million dollars");
		  
		var vertical = svg.append("line")
			.attr("x1", 0)
			.attr("y1", y(y.domain()[0]))
			.attr("x2", 0)
			.attr("y2", y(y.domain()[1]))
			.attr("class", "vertical");
			
		d3.select("#bcgasChart")
		  .on("mousemove", function(){
			 M = d3.mouse(svg[0][0]);
			 vertical.attr("x1", M[0])
			 vertical.attr("x2", M[0])
			 updateTip();
			 })
		  .on("mouseover", function(){  
			 M = d3.mouse(svg[0][0]);
			 vertical.attr("x1", M[0])
			 vertical.attr("x2", M[0])
			 updateTip();
			})
			.on("click", function(){  
			 M = d3.mouse(svg[0][0]);
			 vertical.attr("x1", M[0])
			 vertical.attr("x2", M[0])
			 updateTip();
			});
			
		function updateTip() {
			var selYear = x.invert(M[0]).getFullYear();
			if (selYear >= 2009 && selYear <= 2017) {
				d3.select("#bcgasTip").classed("hidden", false);
				
				d3.select("#bcgasTip").select("#bcgasBudget")
					.text(x.invert(M[0]).getFullYear() + "/" + (x.invert(M[0]).getFullYear() - 1999));
				
				d3.select("#bcgasTip").select("#bcgasVal2015")
					.text(data[selYear - 2009]["Budget 2015"]);
				
				d3.select("#bcgasTip").select("#bcgasVal2016")
					.text(data[selYear - 2009]["Budget 2016"]);
					
				d3.select("#bcgasTip").select("#bcgasDiff")
					.text(data[selYear - 2009]["Budget 2016"] - data[selYear - 2009]["Budget 2015"]);
			}
		}
	});
	
	function type(d) {
		d.Year = parseDate(d.Year.substr(0, 4));
		d["Budget 2015"] = +d["Budget 2015"];
		d["Budget 2016"] = +d["Budget 2016"];
		
		return d;
	}
}();