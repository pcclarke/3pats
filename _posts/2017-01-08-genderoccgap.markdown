---
layout: post
title:  "Canadian Gender Occupation Gaps"
date:   2017-01-08 12:00:00
---

I've been neglecting this blog for a while, on account of spending far too much time on [another project](http://pcclarke.github.io/civ-techs/). As a puny attempt at a new year's resolution, I thought I should try updating this blog again.

So here it is, an update.

I wasn't really planning on doing anything with gender gaps, but when I came across the data it seemed interesting. Sometimes that's all it takes to get a post started, apparently!

* * *

<div class="genderOccGapTitle">Differences in Total Wages by Type of Work and Sex</div>
<div class="genderOccGapSubTitle">Total wages for all employees in the selected occupation</div>

<div>
  <select id="genderOccGapSelect">
    <option value="Total" selected="selected">Total employees, all occupations</option>
    <option value="Management">Management occupations</option>
    <option value="Business">Business, finance and administration occupations</option>
    <option value="Natural">Natural and applied sciences and related occupations</option>
    <option value="Health">Health occupations</option>
    <option value="Government">Occupations in education, law and social, community and government services</option>
    <option value="Art">Occupations in art, culture, recreation and sport</option>
    <option value="Sales">Sales and service occupations</option>
    <option value="Trades">Trades, transport and equipment operators and related occupations</option>
    <option value="Resources">Natural resources, agriculture and related production occupations</option>
    <option value="Manufacturing">Occupations in manufacturing and utilities</option>
  </select>
</div>
<div id="genderOccGapChart" class="chart"></div>

<div id="genderOccGapTip">
	<div id="hint">
		<p class="tipInfo">Click or hover over a section of the chart area to view exact figures</p>
	</div>
	<div id="details" class="hidden">
		<p class="tipTitle"><span id="year"></span> Total Wages</p>
		<p class="tipInfo">All Male Workers: <span id="maleWages"></span> thousand dollars</p>
		<p class="tipInfo">All Female Workers: <span id="femaleWages"></span> thousand dollars</p>
		<p class="tipInfo">Difference: <span id="difference"></span> thousand dollars more for <span id="diffGender"></span></p>
	</div>
</div>

* * *

The occupations are taken from the [National Occupational Classification (NOC)](http://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=314243)

Source: [CANSIM table 282-0151](http://www5.statcan.gc.ca/cansim/a47)

<style>
	#genderOccGapChart text {
	  font-size: 10px;
	}

	#genderOccGapChart .axis path,
	#genderOccGapChart .axis line{
	  fill: none;
	  stroke: #000;
	  shape-rendering: crispEdges;
	}

	#genderOccGapChart .maleLine {
	  fill: none;
	  stroke: #000;
	  pointer-events: all;
	}

	#genderOccGapChart .femaleLine {
	  fill: none;
	  stroke: #FF0000;
	  pointer-events: all;
	}

	#genderOccGapChart .area.above {
	  fill: rgba(255, 0, 0, 0.5);
	}

	#genderOccGapChart .area.below {
	  fill: rgba(0, 0, 0, 0.5);
	}

	.genderOccGapTitle {
		font-size: 1.5em;
		margin-bottom: 0;
		text-align: center;
	}

	.genderOccGapSubTitle {
		font-style: italic;
		text-align: center;
	}

	#genderOccGapChart .vertical {
		stroke: rgba(100, 100, 100, 0.5);
	}

	#genderOccGapChart .tick line,
	#genderOccGapChart .x path {
		stroke: rgba(100, 100, 100, 0.5);
	}

	#genderOccGapChart .y path {
		display: none;
	}

	#genderOccGapChart .femaleLegendRect {
		fill: red;
	}

	/* Tooltip */

	#genderOccGapTip {

		margin-bottom: 15px;
	  	pointer-events: none;
		text-align: center;
	}

	#genderOccGapTip .tipTitle {
		font-size: 14px;
		font-weight: bold;
	  	margin-bottom: 8px !important;
	}

	#genderOccGapTip .tipInfo {
	  font-size: 12px;
	  margin: 0;
	}

	.hidden {
		display: none;
	}
</style>

<script>
var genderOccGap = function() {
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 740 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%m-%Y").parse;

	var parseWages = d3.format(",");

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

	var maleDrawLine = d3.svg.area()
		.interpolate("basis")
		.x(function(d) { return x(d.Date); })
		.y(function(d) { return y(d[occupation + "-Males"]); });

	var femaleDrawLine = d3.svg.area()
		.interpolate("basis")
		.x(function(d) { return x(d.Date); })
		.y(function(d) { return y(d[occupation + "-Females"]); });

	var area = d3.svg.area()
		.interpolate("basis")
		.x(function(d) { return x(d.Date); })
		.y1(function(d) { return y(d[occupation + "-Males"]); });

	var svg = d3.select("#genderOccGapChart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var occupation = "Total";

	d3.csv("{{ site.baseurl }}/data/2017/01/gender_gap_occupations_canada.csv", type, function(error, data) {
	  	if (error) throw error;

	  	setDomains();

		svg.datum(data);

	  	var clipBelow = svg.append("clipPath")
		  	.attr("id", "clip-below")
			.append("path")
		  	.attr("d", area.y0(height));

	  	var clipAbove = svg.append("clipPath")
		  	.attr("id", "clip-above")
			.append("path")
		  	.attr("d", area.y0(0));

	  	var areaAbove = svg.append("path")
			.attr("class", "area above")
			.attr("clip-path", "url(#clip-above)")
			.attr("d", area.y0(function(d) { return y(d[occupation + "-Females"]); }));

	  	var areaBelow = svg.append("path")
		  	.attr("class", "area below")
		  	.attr("clip-path", "url(#clip-below)")
		  	.attr("d", area);

	  	var maleLine = svg.append("path")
			.attr("class", "maleLine")
			.attr("d", maleDrawLine);

	  	var femaleLine = svg.append("path")
			.attr("class", "femaleLine")
			.attr("d", femaleDrawLine);

	  	svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

	  	svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -120)
			.attr("y", 6)
			.attr("dy", -48 + "px")
			.style("text-anchor", "end")
			.attr("class", "axisLabel")
			.text("Thousand dollars");
		  
		var vertical = svg.append("line")
			.attr("x1", 0)
			.attr("y1", y(y.domain()[0]))
			.attr("x2", 0)
			.attr("y2", y(y.domain()[1]))
			.attr("class", "vertical");
			
		d3.select("#genderOccGapChart")
			.on("mousemove", function(){
				updateVertical();
			 })
		  	.on("mouseover", function(){  
				updateVertical();
			})
			.on("click", function(){  
				updateVertical();
			});

		function setDomains() {
			x.domain(d3.extent(data, function(d) { return d.Date; }));
			y.domain([
				d3.min(data, function(d) { return Math.min(d[occupation + "-Males"], d[occupation + "-Females"]); }),
				d3.max(data, function(d) { return Math.max(d[occupation + "-Males"], d[occupation + "-Females"]); })
			]);
		}

		function updateVertical() {
			M = d3.mouse(svg[0][0]);
			var selYear = x.invert(M[0]).getFullYear();
			var baseYear = x.domain()[0].getFullYear();
			var endYear = x.domain()[1].getFullYear();

			if (selYear >= baseYear && selYear <= endYear) {
				vertical.attr("x1", M[0])
				vertical.attr("x2", M[0])
				updateTip(selYear, baseYear);
			}
		}
			
		function updateTip(selYear, baseYear) {
			var selMonth = x.invert(M[0]).getMonth();
			var item = ((selYear - baseYear) * 12) + selMonth;
			var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

			d3.select("#genderOccGapTip")
				.select("#hint")
				.classed("hidden", true);

			d3.select("#genderOccGapTip")
				.select("#details")
				.classed("hidden", false);

			d3.select("#genderOccGapTip")
				.select("#year")
				.text(monthNames[selMonth] + " " + selYear);

			d3.select("#genderOccGapTip")
				.select("#maleWages")
				.text(parseWages(Math.round(data[item][occupation + "-Males"])));

			d3.select("#genderOccGapTip")
				.select("#femaleWages")
				.text(parseWages(Math.round(data[item][occupation + "-Females"])));

			d3.select("#genderOccGapTip")
				.select("#difference")
				.text(parseWages(Math.round(Math.abs(data[item][occupation + "-Males"] - data[item][occupation + "-Females"]))));

			d3.select("#genderOccGapTip")
				.select("#diffGender")
				.text((data[item][occupation + "-Males"] > data[item][occupation + "-Females"]) ? "men" : "women");
		}

		d3.select("#genderOccGapSelect")
			.on("change", function(sel) {
				occupation = this.options[this.selectedIndex].value;

				setDomains();
				svg.select(".y")
					.call(yAxis);

				clipBelow.transition()
					.duration(1000)
					.attr("d", area.y0(height));
				clipAbove.transition()
					.duration(1000)
					.attr("d", area.y0(0));
				areaAbove.transition()
					.duration(1000)
					.attr("d", area.y0(function(d) { return y(d[occupation + "-Females"]); }));
				areaBelow.transition()
					.duration(1000)
					.attr("d", area);
				maleLine.transition()
					.duration(1000)
					.attr("d", maleDrawLine);
				femaleLine.transition()
					.duration(1000)
					.attr("d", femaleDrawLine);
		});

		// Legend

		svg.append("rect")
			.attr("x", 8)
			.attr("y", 13)
			.attr("width", 15)
			.attr("height", 15)
			.attr("class", "maleLegendRect");

		svg.append("text")
			.attr("x", 25)
			.attr("y", 25)
			.attr("class", "maleLegendText")
			.text("Men");

		svg.append("rect")
			.attr("x", 58)
			.attr("y", 13)
			.attr("width", 15)
			.attr("height", 15)
			.attr("class", "femaleLegendRect");

		svg.append("text")
			.attr("x", 75)
			.attr("y", 25)
			.attr("class", "femaleLegendText")
			.text("Women");
	});



	function type(d) {
		d.Date = parseDate(d.Date);
		d3.keys(d).filter(function(key) { return key !== "Date"; }).forEach(function(val) {
			d[val] = +d[val];
		});
		
		return d;
	}
	
}();
</script>