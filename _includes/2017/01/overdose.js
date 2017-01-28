// Map variables

var margin = {top: 30, right: 10, bottom: 10, left: 50},
    width = 740,
    height = 300;

var projection = d3.geoMercator()
    .scale(22000)
    .translate([370, 130])
    .center([-122.275085, 49.292385]);

var color = d3.scaleSequential()
    .interpolator(d3.interpolateOrRd);

var parseDate = d3.timeParse("%m/%d/%Y");

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("#map").append("svg")
      .attr("class", "vanMap")
      .attr("width", width)
      .attr("height", height);

d3.queue()
    .defer(d3.json, "{{ site.baseurl }}/data/2017/01/lowermainland.json")
    .defer(d3.csv, "{{ site.baseurl }}/data/2017/01/overdose_muni.csv", type)
    .await(function ready(error, bcMuni, data) {
        console.log(bcMuni);
        console.log(data);

        var city = svg.selectAll(".city")
            .data(topojson.feature(bcMuni, bcMuni.objects.lowermainland).features)
            .enter().append("path")
            .attr("class", "city")
            .attr("d", path);

        var muniOds = d3.nest()
            .key(function(d) { return d.Community; })
            .map(data, d3.map);

        console.log(muniOds);

        color.domain([
            d3.min(data, function(d) { return d["Opioid YTD"]; }), 
            d3.max(data, function(d) { return d["Opioid YTD"]; })
        ]);
        console.log(color.domain());

        city.filter(function(d) { return muniOds.has(d.properties.CSDNAME); })
            .style("fill", function(d) { console.log(muniOds.get(d.properties.CSDNAME)[0]["Opioid YTD"]);
                return color(muniOds.get(d.properties.CSDNAME)[0]["Opioid YTD"]); });

        // svg.selectAll("path")
        //     .data(bcMuni.features)
        //     .enter()
        //     .append("path")
        //     .attr("d", path);

    });

function type(d) {
    d["Opioid YTD"] = +(d["Opioid YTD"]);

    return d;
}