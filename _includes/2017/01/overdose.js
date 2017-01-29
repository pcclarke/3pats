var muniSelect = "Percent";

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

// Bar chart variables

var barMargin = {top: 20, right: 20, bottom: 30, left: 120},
    barWidth = 740 - barMargin.left - barMargin.right,
    barHeight = 400 - barMargin.top - barMargin.bottom;

var x = d3.scaleLinear()
          .range([0, barWidth]);
var y = d3.scaleBand()
          .range([0, barHeight])
          .padding(0.1);

var barSvg = d3.select("#chart").append("svg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .append("g")
    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

d3.queue()
    .defer(d3.json, "{{ site.baseurl }}/data/2017/01/lowermainland.json")
    .defer(d3.csv, "{{ site.baseurl }}/data/2017/01/overdose_muni.csv", typeMuni)
    .await(function ready(error, bcMuni, data) {

        // Map

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

        setColorDomain();

        city.filter(function(d) { return muniOds.has(d.properties.CSDNAME); })
            .classed("odCity", true)
            .style("fill", function(d) { return color(muniOds.get(d.properties.CSDNAME)[0][muniSelect]); })
            .on("mouseover", function(d) { viewMuniInfo(d); })
            .on("mouseout", function(d) { labelMuniOut(d); });

        svg.selectAll(".cityLabel")
            .data(topojson.feature(bcMuni, bcMuni.objects.lowermainland).features)
            .enter().append("text")
            .filter(function(d) { return muniOds.has(d.properties.CSDNAME) && d.properties.CSDUID !== "5909027"; })
            .attr("class", function(d) {
                return "cityLabel label-" + getCommunity(d);
            })
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("dx", function(d) {
                var shift = 0;

                if (d.properties.CSDNAME == "Coquitlam") {
                    shift = "1em";
                }

                return shift;
            })
            .attr("dy", function(d) {
                var shift = ".35em";

                if (d.properties.CSDNAME == "Coquitlam") {
                    shift = "-1.5em";
                } else if (d.properties.CSDNAME == "Pitt Meadows") {
                    shift = "-1em";
                } else if (d.properties.CSDNAME == "Township of Langley") {
                    shift = "2em";
                } else if (d.properties.CSDNAME == "Surrey") {
                    shift = "-1em";
                }

                return shift;
            })
            .text(function(d) { return d.properties.CSDNAME; })
            .on("mouseover", function(d) { viewMuniInfo(d); })
            .on("mouseout", function(d) { labelMuniOut(d); });

        function getCommunity(d) { return d.properties.CSDNAME.replace(/ /g, "_").toLowerCase(); }

        function viewMuniInfo(d) {
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
            
            d3.select(".label-" + getCommunity(d)).classed("selLabel", true);

            d3.select("#hintMap").classed("hidden", true);
            d3.select("#detailsMap").classed("hidden", false);
        }

        function labelMuniOut(d) {
            
            d3.select(".label-" + getCommunity(d)).classed("selLabel", false);
        }

        function setColorDomain() {
            color.domain([
                d3.min(data, function(d) { return d[muniSelect]; }), 
                d3.max(data, function(d) { return d[muniSelect]; })
            ]);
        }

        d3.select("#selectMuni")
          .on("change", function(sel) {
            muniSelect = this.options[this.selectedIndex].value;

                    setColorDomain();

                    city.filter(function(d) { return muniOds.has(d.properties.CSDNAME); })
                        .style("fill", function(d) { return color(muniOds.get(d.properties.CSDNAME)[0][muniSelect]); });
                });
        
        // Bar chart

        x.domain([
            d3.min(data, function(d) { return d[muniSelect]; }) * 0.9, 
            d3.max(data, function(d) { return d[muniSelect]; })
          ]);
        y.domain(data.map(function(d) { return d.Community; }));

        console.log(x.domain());

        barSvg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(x.domain()[0]); })
              .attr("width", function(d) { return x(d[muniSelect]); })
              .attr("y", function(d) { return y(d.Community); })
              .attr("height", y.bandwidth())
              .attr("fill", function(d) { return color(d[muniSelect]); });

        barSvg.append("g")
            .attr("transform", "translate(0," + barHeight + ")")
            .call(d3.axisBottom(x));

        barSvg.append("g")
            .call(d3.axisLeft(y));
      });
        

function typeMuni(d) {
    d["Opioid 10wk avg"] = +d["Opioid 10wk avg"];
    d["Opioid YTD"] = +d["Opioid YTD"];
    d["Overall 10wk avg"] = +d["Overall 10wk avg"];
    d["Overall YTD"] = +d["Overall YTD"];
    d["Percent"] = +(d["Percent"]);

    return d;
}