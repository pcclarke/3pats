// Leaning heavily on http://bl.ocks.org/mbostock/5912673

// Map
var parseDate = d3.timeFormat("%Y-%m-%d").parse,
    formatDate = d3.timeFormat("%x");

var width = 740,
    height = 400;

var projection = d3.geoMercator()
    .scale(130)
    .translate([width / 2, height / 2])
    .precision(.1);

var color = d3.scaleSequential()
    .interpolator(d3.interpolateOrRd);

var path = d3.geoPath()
    .projection(projection);

// Sparkline
var margin = {top: 1, right: 1, bottom: 1, left: 1},
    sWidth = 100 - margin.left - margin.right,
    sHeight = 25 - margin.top - margin.bottom;
		
var x = d3.scaleLinear()
		.domain([0, 20])
    .range([0, sWidth]);

var y = d3.scaleLinear()
    .range([sHeight, 0]);
		
var line = d3.line()
    .x(function(d, i) { return x(i); })
    .y(function(d) { return y(d); });
		
var numFormat = d3.format(",");
		
drawMap("1994");

function drawMap(year) {
	var svg = d3.select("#unchrChart").append("svg")
			.attr("class", "unhcrMap")
	    .attr("width", width)
	    .attr("height", height);

	svg.append("defs").append("path")
	    .datum({type: "Sphere"})
	    .attr("id", "sphere")
	    .attr("d", path);

	svg.append("use")
	    .attr("class", "stroke")
	    .attr("xlink:href", "#sphere");

	svg.append("use")
	    .attr("class", "fill")
	    .attr("xlink:href", "#sphere");
	
	queue()
	    .defer(d3.json, "{{ site.baseurl }}/data/world-50m.json")
	    .defer(d3.csv, "{{ site.baseurl }}/data/2015/10/23/unhcr_ids.csv", type)
	    .await(ready);
		
	function ready(error, world, refugees) {
	  if (error) throw error;
		
			color.domain([0, d3.max(refugees, function(d) { return d[year]; })]);

	  var refugeesById = d3.nest()
	      .key(function(d) { return d.id; })
	      .sortValues(function(a, b) { return a[year] - b[year]; })
	      .map(refugees, d3.map);
				
	  var country = svg.insert("g", ".graticule")
	      .attr("class", "land")
	    .selectAll("path")
	      .data(topojson.feature(world, world.objects.countries).features)
	    .enter().append("path")
	      .attr("d", path);
			
	  /*country.filter(function(d) { return d.id === 124; })
	      .style("fill", "#000000")
	    .append("title")
	      .text("Canada");*/

	  country.filter(function(d) { return refugeesById.has(d.id) && refugeesById.get(d.id)[0][year] > 0; })
	      .style("fill", function(d) { return color(refugeesById.get(d.id)[0][year]); })
				.on("mouseover", function(d) {
					showTooltip(d, this);
				});
				
		function showTooltip(d, obj) {
			d3.selectAll("#unchrChart .sel").classed("sel", false);
			d3.select(obj).classed("sel", true);
			d3.selectAll(".spark").remove();
			
			var sparkLine = d3.select("#unhcrSparkline").append("svg")
					.attr("class", "spark")
			    .attr("width", sWidth + margin.left + margin.right)
			    .attr("height", sHeight + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
			var data = [];
					
					var i = 1994;
					while (i < 2015) {
						var poof = refugeesById.get(d.id);
						data.push(poof[0][i]);
						i++;
					}
					
			y.domain([d3.min(data), d3.max(data)]);
			
			sparkLine.append("path")
			      .datum(data)
			      .attr("class", "line")
			      .attr("d", line);
						
			sparkLine.append("circle")
						.attr("r", 3)
						.attr("cx", x(year - 1994))
						.attr("cy", y(data[year - 1994]));

      console.log(refugeesById.get(d.id));
      console.log(year);
			
			d3.select("#sparkValue")
      	.text(numFormat(refugeesById.get(d.id).map(function(e) { console.log(e); return e[year]; })));
			d3.select("#mapCountry")
				.text(refugeesById.get(d.id)[0].name);
				
			d3.select("#sparkGroup").classed("hidden", false);
		}

	  svg.insert("path", ".graticule")
	      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
	      .attr("class", "boundary")
	      .attr("d", path);
	}

	function type(d) {
	  d.id = +d.id;
		var i = 1994;
		while (i < 2015) {
		  d[i] = +d[i];
			i++;
		}
	  return d;
	}
}

d3.select(self.frameElement).style("height", height + "px");

d3.select("#selectUnhcr")
    .on("change", function() {
        d3.selectAll(".unhcrMap").remove();
        d3.select("#sparkGroup").classed("hidden", true);
      
        drawMap(this.options[this.selectedIndex].value);
    });