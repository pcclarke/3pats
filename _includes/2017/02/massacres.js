var mapMargin = {top: 30, right: 10, bottom: 10, left: 50},
    mapWidth = 740,
    mapHeight = 450;

var projection = d3.geoMercator()
    .scale(470)
    .translate([1165, 820]);

var path = d3.geoPath()
    .projection(projection);

var mapSvg = d3.select("#map").append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + mapWidth + " " + mapHeight)
      .classed("svg-content", true);

var type = function(d) {
    d.Deaths = +d.Deaths;

    return d;
}

d3.queue()
    .defer(d3.json, "{{ site.baseurl }}/data/2017/02/can_prov.json")
    .defer(d3.csv, "{{ site.baseurl }}/data/2017/02/massacres.csv", type)
    .await(function ready(error, prov, data) {

    // Map

    console.log(prov);

    var province = mapSvg.selectAll(".province")
            .data(topojson.feature(prov, prov.objects.can_prov).features)
            .enter().append("path")
            .attr("class", "province")
            .attr("d", path);

    });