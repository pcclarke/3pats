msp("Single Adult", "sin_nc", "msp_single_nochild-diff.csv", "msp_single_nochild-data.csv");
msp("Couple", "cou_nc", "msp_couple_nochild-diff.csv", "msp_couple_nochild-data.csv");
msp("Senior Couple", "sen_cou", "msp_senior_couple-diff.csv", "msp_senior_couple-data.csv");
msp("Single Parent - Two Children", "sin_ch", "msp_single_child-diff.csv", "msp_single_child-data.csv");
msp("Couple - Two Children", "cou_ch", "msp_couple_child-diff.csv", "msp_couple_child-data.csv");

function msp(chartName, chartId, diffFile, dataFile) {
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 740 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%Y").parse;
	
	var numFormat = d3.format(".2f"),
		numFormatComma = d3.format(",");

	var x = d3.scale.linear()
    	.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);
		
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var line = d3.svg.area()
		.x(function(d) { return x(d.Income); })
		.y(function(d) { return y(d["2017"]); });

	var area = d3.svg.area()
		.x(function(d) { return x(d.Income); })
		.y1(function(d) { return y(d["2017"]); });

	var svg = d3.select("#mspChart").append("svg")
		.attr("id", chartId)
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	queue()
	    .defer(d3.csv, "{{ site.baseurl }}/data/2016/02/" + diffFile, typeDiff)
		.defer(d3.csv, "{{ site.baseurl }}/data/2016/02/" + dataFile, typeData)
	    .await(ready);

	function ready(error, diff, data) {
	  if (error) throw error;

		x.domain(d3.extent(diff, function(d) { return d.Income; }));
		y.domain([0, 160]);
	  /*y.domain([
		d3.min(diff, function(d) { return Math.min(d["2017"], d["2016"]); }),
		d3.max(diff, function(d) { return Math.max(d["2017"], d["2016"]); })
	  ]);*/
	  
	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		  .append("text")
		  .attr("x", width - 1)
		  .attr("y", -5)
		  .style("text-anchor", "end")
		  .text("Annual Household Net Income");

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Monthly Premium");

	  svg.datum(diff);

	  svg.append("clipPath")
		  .attr("id", "clip-below" + chartId + "")
		.append("path")
		  .attr("d", area.y0(height));

	  svg.append("clipPath")
		  .attr("id", "clip-above" + chartId + "")
		.append("path")
		  .attr("d", area.y0(0));

	  svg.append("path")
		  .attr("class", "area above")
		  .attr("clip-path", "url(#clip-above" + chartId + ")")
		  .attr("d", area.y0(function(d) { return y(d["2016"]); }));

	  svg.append("path")
		  .attr("class", "area below")
		  .attr("clip-path", "url(#clip-below" + chartId + ")")
		  .attr("d", area);

		var stripes = textures.lines()
			.stroke("black")
			.background("#CCCCCC")
			.size(4)
			.strokeWidth(1);   
		svg.call(stripes);
		d3.select("#" + chartId).select(".below").style("fill", stripes.url());
		
		var dots = textures.circles()
			.fill("white")
			.background("#CCCCCC")
			.radius(1)
			.complement();
		svg.call(dots);
		d3.select("#" + chartId).select(".above").style("fill", dots.url());
		  
		mspLines("2016");
		mspLines("2017");
		
		var selected;
		
		function mspLines(year) {
			svg.selectAll(".msp" + year)
				.data(data)
				.enter()
				.append("line")
				.attr("class", "msp" + year)
				.attr("x1", function(d) { return x(d.Income1); })
				.attr("y1", function(d) { return y(d[year]); })
				.attr("x2", function(d) { return x(d.Income2); })
				.attr("y2", function(d) { return y(d[year]); })
				.on("mouseover", function(d) {
					showTip(d, this);
				})
				.on("click", function(d) {
					showTip(d, this);
				});
				
			function showTip(d, obj) {
				if (selected) {
					d3.select(selected).classed("selected", false);
				}
				selected = obj;
				d3.select(obj).classed("selected", true);
			
				var income1 = (d.Income1 < 15000) ? 0 : numFormatComma(d.Income1);
				var income2 = (d.Income2 > 55000) ? "and up" : ("to " + numFormatComma(d.Income2));
				var change = 0;
				if (d["2016"] == 0)
					change = 0;
				if (d["2017"] == 0 && d["2016"] != 0)
					change = -100;
				if (d["2016"] > d["2017"])
					change = ((1 - (d["2017"] / d["2016"])) * -100);
				else
					change = ((d["2017"] / d["2016"] -1) * 100);
				console.log(change);
				d3.select("#" + "tip1_" + chartId)
					.text(income1 + " " + income2);
				d3.select("#" + "tip2_" + chartId)
					.text("2016: $" + numFormat(d["2016"]));
				d3.select("#" + "tip3_" + chartId)
					.text("2017: $" + numFormat(d["2017"]));
				d3.select("#" + "tip4_" + chartId)
					.text("Change: " + numFormat(change) + "%");
			}
		}
		
		// TOOLTIP
		svg.append("text")
			.attr("class", "chartName")
			.attr("x", 40)
			.attr("y", 5)
			.text(chartName);
			
		svg.append("text")
			.attr("class", "tipInfo")
			.attr("id", "tip1_" + chartId)
			.attr("x", 40)
			.attr("y", 23)
			.text("");
			
		svg.append("text")
			.attr("class", "tipInfo")
			.attr("id", "tip2_" + chartId)
			.attr("x", 40)
			.attr("y", 38)
			.text("");
			
		svg.append("text")
			.attr("class", "tipInfo")
			.attr("id", "tip3_" + chartId)
			.attr("x", 40)
			.attr("y", 53)
			.text("");
			
		svg.append("text")
			.attr("class", "tipInfo")
			.attr("id", "tip4_" + chartId)
			.attr("x", 40)
			.attr("y", 68)
			.text("");
			
		// LEGEND
		svg.append("rect")
			.attr("x", 40)
			.attr("y", height - 100)
			.attr("width", 20)
			.attr("height", 20)
			.style("fill", stripes.url());
			
		svg.append("rect")
			.attr("x", 40)
			.attr("y", height - 70)
			.attr("width", 20)
			.attr("height", 20)
			.style("fill", dots.url());
			
		svg.append("text")
			.attr("x", 62)
			.attr("y", height - 86)
			.attr("class", "tipInfo")
			.text("increase");
			
		svg.append("text")
			.attr("x", 62)
			.attr("y", height - 56)
			.attr("class", "tipInfo")
			.text("decrease");
	}
	
	function typeDiff(d) {
		d.Income = +d.Income;
		d["2016"] = +d["2016"];
		d["2017"] = +d["2017"];

		return d;
	}
	
	function typeData(d) {
		d.Income1 = +d.Income1;
		d.Income2 = +d.Income2;
		d["2016"] = +d["2016"];
		d["2017"] = +d["2017"];

		return d;
	}
}