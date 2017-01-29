var OD = {
    muniSelect: "Percent"
}

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
    .defer(d3.csv, "{{ site.baseurl }}/data/2017/01/overdose_muni.csv", typeMuni)
    .await(function ready(error, bcMuni, data) {
        console.log(bcMuni);
        console.log(data);

        var city = svg.selectAll(".city")
            .data(topojson.feature(bcMuni, bcMuni.objects.lowermainland).features)
            .enter().append("path")
            .attr("class", function(d) {
                var community = d.properties.CSDNAME.replace(' ', "_").toLowerCase();
                return "city " + community;
            })
            .attr("d", path);

        var muniOds = d3.nest()
            .key(function(d) { return d.Community; })
            .map(data, d3.map);

        console.log(muniOds);

        color.domain([
            d3.min(data, function(d) { return d[OD.muniSelect]; }), 
            d3.max(data, function(d) { return d[OD.muniSelect]; })
        ]);

        city.filter(function(d) { return muniOds.has(d.properties.CSDNAME); })
            .style("fill", function(d) { return color(muniOds.get(d.properties.CSDNAME)[0][OD.muniSelect]); })
            .on("mouseover", function(d) {

                 d3.select("#label")
                    .text(muniOds.get(d.properties.CSDNAME)[0]["Community"]);
                d3.select("#op10wk")
                    .text(muniOds.get(d.properties.CSDNAME)[0]["Opioid 10wk avg"]);
                d3.select("#opytd")
                    .text(muniOds.get(d.properties.CSDNAME)[0]["Opioid YTD"]);
                d3.select("#ov10wk")
                    .text(muniOds.get(d.properties.CSDNAME)[0]["Overall 10wk avg"]);
                d3.select("#ov10ytd")
                    .text(muniOds.get(d.properties.CSDNAME)[0]["Overall YTD"]);
                d3.select("#opovper")
                    .text(muniOds.get(d.properties.CSDNAME)[0]["Percent"]);

                d3.select("#hint").classed("hidden", true);
                d3.select("#details").classed("hidden", false);
            });

		d3.select("#selectMuni")
			.on("change", function(sel) {
				OD.muniSelect = this.options[this.selectedIndex].value;

                color.domain([
                    d3.min(data, function(d) { return d[OD.muniSelect]; }), 
                    d3.max(data, function(d) { return d[OD.muniSelect]; })
                ]);

                city.filter(function(d) { return muniOds.has(d.properties.CSDNAME); })
                    .style("fill", function(d) { return color(muniOds.get(d.properties.CSDNAME)[0][OD.muniSelect]); });
            });

        });

function typeMuni(d) {
    d["Opioid 10wk avg"] = +d["Opioid 10wk avg"];
    d["Opioid YTD"] = +d["Opioid YTD"];
    d["Overall 10wk avg"] = +d["Overall 10wk avg"];
    d["Overall YTD"] = +d["Overall YTD"];
    d["Percent"] = +(d["Percent"]);

    return d;
}