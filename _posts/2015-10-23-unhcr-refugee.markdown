---
layout: post
title:  "UNHCR Refugees in Canada, Mapped"
date:   2015-10-23 22:00:00
---

<div id="unchrChart"></div>

An alternative source for refugees


<style>

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

var svg = d3.select("#unchrChart").append("svg")
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
		
var year = "2002";

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

  country.filter(function(d) { console.log(refugeesById.has(d.id) + " " + d.id); return refugeesById.has(d.id); })
      .style("fill", function(d) { 
				if (refugeesById.get(d.id)[0][year] > 0) {
					return color(refugeesById.get(d.id)[0][year]); 
				} else {
					return "#DDDDDD";
				}
			})
    .append("title")
      .text(function(d) {
        var refugees = refugeesById.get(d.id);
        return refugees[0].name + "\n" + refugees.map(function(d) { return d[year]; }).join("\n");
      });

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

d3.select(self.frameElement).style("height", height + "px");


</script>