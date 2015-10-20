---
layout: post
title:  "UNHCR Refugees in Canada"
date:   2015-10-14 22:00:00
---

<div id="unchrChart"></div>

An alternative source for refugees


<style>

#unchrChart .graticule {
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
}

</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.19/topojson.min.js"></script>
<script>

unhcr();

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

}

</script>