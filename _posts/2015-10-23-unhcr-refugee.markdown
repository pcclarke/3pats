---
layout: post
title:  "UNHCR Refugees in Canada, Mapped"
date:   2015-10-23 22:00:00
---

<div><b>Year:</b>
  <select id="selectUnhcr">
		<option value="1994" selected="selected">1994</option>
		<option value="1995">1995</option>
    <option value="1996">1996</option>
    <option value="1997">1997</option>
    <option value="1998">1998</option>
    <option value="1999">1999</option>
    <option value="2000">2000</option>
    <option value="2001">2001</option>
		<option value="2002">2002</option>
    <option value="2003">2003</option>
    <option value="2004">2004</option>
    <option value="2005">2005</option>
    <option value="2006">2006</option>
    <option value="2007">2007</option>
    <option value="2008">2008</option>
    <option value="2009">2009</option>
    <option value="2010">2010</option>
    <option value="2011">2011</option>
    <option value="2012">2012</option>
    <option value="2013">2013</option>
    <option value="2014">2014</option>
  </select>
</div>
<div id="unchrChart"></div>
<div id="unhcrSparkline"></div>

An alternative source for refugees


<style>

#selectUnhcr {
  font-family: Lora, Georgia, serif;
  font-size: 20px;
  padding: 5px 15px;
	width: 200px;
}

#unchrChart {
  background: #fcfcfa;
}

#unchrChart .stroke {
  fill: none;
  stroke: #000;
  stroke-width: 1px;
}

#unchrChart .fill {
  fill: #fff;
}

#unchrChart .land {
  fill: #ddd;
}

#unchrChart .boundary {
  fill: none;
  stroke: #fff;
	stroke-width: 0.5px;
}

</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.19/topojson.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-geo-projection/0.2.9/d3.geo.projection.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/queue-async/1.0.7/queue.min.js"></script>
<script src="{{ site.baseurl }}/js/colorbrewer.js"></script>

<script>
// Leaning heavily on http://bl.ocks.org/mbostock/5912673

unhcrMap();

function unhcrMap() {

var parseDate = d3.time.format("%Y-%m-%d").parse,
    formatDate = d3.time.format("%x");

var width = 740,
    height = 400;

var projection = d3.geo.naturalEarth()
    .scale(130)
    .translate([width / 2, height / 2])
    .precision(.1);

var color = d3.scale.quantize()
    .range(colorbrewer.Reds[9]);

var path = d3.geo.path()
    .projection(projection);
		
drawMap("2002");

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

	  country.filter(function(d) { return refugeesById.has(d.id); })
	      .style("fill", function(d) { 
					if (refugeesById.get(d.id)[0][year] > 0) {
						return color(refugeesById.get(d.id)[0][year]); 
					} else {
						return "#DDDDDD";
					}
				})
				.on("mouseover", function(d) {
					console.log(d);
					d3.select("#unhcrSparkline").text(d.id);
				})
	    .append("title")
	      .text(function(d) {
	        var refugees = refugeesById.get(d.id);
	        return refugees[0].name + "\n" + refugees.map(function(d) { return d[year]; }).join("\n");
	      })
				;

	  svg.insert("path", ".graticule")
	      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
	      .attr("class", "boundary")
	      .attr("d", path)
				;
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
  .on("change", selected);

function selected() {
	d3.selectAll(".unhcrMap").remove();
  drawMap(this.options[this.selectedIndex].value);
	
}

}

</script>