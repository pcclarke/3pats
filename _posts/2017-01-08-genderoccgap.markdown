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

<div id="genderOccGapTip" class="hidden">
	<p class="tipTitle"><span id="year"></span></p>
	<p class="tipInfo">All Male Workers Total Wages: <span id="maleWages"></span> thousand dollars</p>
	<p class="tipInfo">All Female Workers Total Wages: <span id="femaleWages"></span> thousand dollars</p>
	<p class="tipInfo">Difference: <span id="difference"></span> thousand dollars more for <span id="diffGender"></span></p>
</div>

* * *

Source [CANSIM table 282-0151](http://www5.statcan.gc.ca/cansim/a47)

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

	#genderOccGapChart .axis--y path {
	  display: none;
	}

	#genderOccGapChart .data {
	  fill: none;
	  stroke: rgba(100, 100, 100, 0.4);
	  stroke-linejoin: round;
	  stroke-linecap: round;
	  stroke-width: 1.5px;
	}

	#genderOccGapChart .budget--hover {
	  stroke: #000 !important;
	}

	#genderOccGapChart .focus text {
	  text-anchor: middle;
	  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
	}

	#genderOccGapChart .line {
	  fill: none;
	  stroke: #000;
	  pointer-events: all;
	}

	#genderOccGapChart .voronoi--show path {
	  stroke: red;
	  stroke-opacity: .2;
	}

	#genderOccGapChart .area.above {
	  fill: rgba(0, 0, 0, 0.5);
	}

	.genderOccGapTitle {
		font-size: 1.5em;
		margin-bottom: 0;
		text-align: center;
	}

	.subBcgasTitle {
		text-align: center;
	}

	.vertical {
		stroke: rgba(0, 0, 0, 0.25);
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

	var line = d3.svg.area()
		.interpolate("basis")
		.x(function(d) { return x(d.Date); })
		.y(function(d) { return y(d[occupation + "-Males"]); });

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
			.text("Thousand dollars");
		  
		var vertical = svg.append("line")
			.attr("x1", 0)
			.attr("y1", y(y.domain()[0]))
			.attr("x2", 0)
			.attr("y2", y(y.domain()[1]))
			.attr("class", "vertical");
			
		d3.select("#genderOccGapChart")
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

		function setDomains() {
			x.domain(d3.extent(data, function(d) { return d.Date; }));
			y.domain([
				d3.min(data, function(d) { return Math.min(d[occupation + "-Males"], d[occupation + "-Females"]); }),
				d3.max(data, function(d) { return Math.max(d[occupation + "-Males"], d[occupation + "-Females"]); })
			]);
		}
			
		function updateTip() {
			var selYear = x.invert(M[0]).getFullYear();
			var selMonth = x.invert(M[0]).getMonth();
			var baseYear = x.domain()[0].getFullYear();
			var endYear = x.domain()[1].getFullYear();
			var item = ((selYear - baseYear) * 12) + selMonth;
			var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

			if (selYear >= baseYear && selYear <= endYear) {
				d3.select("#genderOccGapTip").classed("hidden", false);

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
		}

		d3.select("#genderOccGapSelect")
			.on("change", function(sel) {
				occupation = this.options[this.selectedIndex].value;

				setDomains();
				svg.select(".y")
					//.transition().duration(1500).ease("sin-in-out")
					.call(yAxis);

				clipBelow.attr("d", area.y0(height));
				clipAbove.attr("d", area.y0(0));
				areaAbove.attr("d", area.y0(function(d) { return y(d[occupation + "-Females"]); }));
				areaBelow.attr("d", area);
				maleLine.attr("d", line);
		});
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