---
layout: post
title:  "UNHCR Refugees in Canada"
date:   2015-10-23 22:00:00
---

<div id="unchrChart"></div>

An alternative source for refugees


<style>

/*#unchrChart .graticule {
  fill: none;
  stroke: #777;
  stroke-width: .5px;
  stroke-opacity: .5;
}

#unchrChart .land {
  fill: #222;
}

#unchrChart .boundary {
  fill: none;
  stroke: #fff;
  stroke-width: .5px;
}*/

#unchrChart {
  background: #fcfcfa;
}

#unchrChart .stroke {
  fill: none;
  stroke: #000;
  stroke-width: 3px;
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
}

</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.19/topojson.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-geo-projection/0.2.9/d3.geo.projection.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/queue-async/1.0.7/queue.min.js"></script>
<script src="{{ site.baseurl }}/js/colorbrewer.js"></script>

<script>

var parseDate = d3.time.format("%Y-%m-%d").parse,
    formatDate = d3.time.format("%x");

var width = 740,
    height = 400;

var projection = d3.geo.naturalEarth()
    .scale(130)
    .translate([width / 2, height / 2])
    .precision(.1);

var color = d3.scale.quantize()
    .domain([0, 27732])
    .range(colorbrewer.Reds[9]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#unchrChart").append("svg")
		.attr("class", "Reds")
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
    .defer(d3.csv, "{{ site.baseurl }}/data/2015/10/23/unhcr_1994.csv", type)
    .await(ready);

function ready(error, world, refugees) {
  if (error) throw error;
	
	var quantize = d3.scale.quantize().domain([0, 30000]).range(d3.range(0, 9));

  var refugeesById = d3.nest()
      .key(function(d) { return d.id; })
      .sortValues(function(a, b) { return a.refugees - b.refugees; })
      .map(refugees, d3.map);

  var country = svg.insert("g", ".graticule")
      .attr("class", "land")
    .selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)
    .enter().append("path")
      .attr("d", path);
			
			console.log(refugeesById);

  country.filter(function(d) { return d.id === 124; })
      .style("fill", "#000000")
    .append("title")
      .text("Canada");

  country.filter(function(d) { return refugeesById.has(d.id); })
      .style("fill", function(d) { return color(refugeesById.get(d.id)[0].refugees); })
			//.attr("class", function(d) { console.log(quantize(refugeesById.get(d.id)[0].refugees)); return "q" + quantize(refugeesById.get(d.id)[0].refugees) + "-9"; })
    .append("title")
      .text(function(d) {
        var refugees = refugeesById.get(d.id);
        return refugees[0].name + "\n" + refugees.map(function(d) { return d.refugees; }).join("\n");
      });

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
}

function type(d) {
  d.id = +d.id;
  d.refugees = +d.refugees;
  return d;
}

d3.select(self.frameElement).style("height", height + "px");

/*unhcr();

function unhcr() {

var width = 960,
    height = 480;

var projection = d3.geo.equirectangular()
    .scale(153)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("#unchrChart").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

d3.json("{{ site.baseurl }}/data/2015/10/14/world-50m.json", function(error, world) {
  if (error) throw error;

  svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");

}*/

</script>