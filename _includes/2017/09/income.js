var margin = {top: 50, right: 200, bottom: 30, left: 200},
    width = 740 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scaleOrdinal()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var format = d3.format(",");

var line = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.value); });

var svg = d3.select("#incomes")
  .append("svg")
    .attr("class", "gender_income")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var type = function(d) {
  d["Median amount (2015 constant dollars), 2005"] = +d["Median amount (2015 constant dollars), 2005"];
  d["Median amount (2015 constant dollars), 2015"] = +d["Median amount (2015 constant dollars), 2015"];
  d["Median amount (2015 constant dollars), % change"] = +d["Median amount (2015 constant dollars), % change"];

  return d;
}

var setYDomain = function(data, income) {
  y.domain([d3.min(data, function(c) { return d3.min(c[income], function(d) { return d.value; }); }),
            d3.max(data, function(c) { return d3.max(c[income], function(d) { return d.value; }); })]);

}

d3.csv("{{ site.baseurl }}/data/2017/09/98-402-X2016006-T2-CANPR-Eng.CSV", type, function(error, rawData) {

  var entries = d3.nest()
    .key(function(d) { return d["Income source"]; })
    .rollup(function(d) {
        var items = [];

        d.forEach(function(e) {
            items.push({
                region: e["Geographic name"],
                sex: e.Sex,
                values: [
                    {year: 2005, value: e["Median amount (2015 constant dollars), 2005"]},
                    {year: 2015, value: e["Median amount (2015 constant dollars), 2015"]}
                ],
                change: e["Median amount (2015 constant dollars), % change"]
            });
        });
        return items;
    })
    .entries(rawData);

    var data = [];
    for (var i = 0; i < entries[0].value.length; i++) {
        if (entries[0].value[i].sex === "Males" || entries[0].value[i].sex === "Females") {
            var item = {
                region: entries[0].value[i].region,
                sex: entries[0].value[i].sex
            };

            for (var j = 0; j < entries.length; j++) {
                var key = function(d) {
                    if (entries[j].key === "Total income") {
                        return "totalIncome";
                    } else if (entries[j].key === "After-tax income") {
                        return "afterTaxIncome";
                    }
                    return "employmentIncome";
                }();
                item[key] = {};
                item[key].values = entries[j].value[i].values;
                item[key].change = entries[j].value[i].change;
            }

            data.push(item);
        }
    }

    x.domain([2005, 2015]);
    setYDomain(data, "totalIncome");
 
    svg.append("text")
        .attr("fill", "#000")
        .attr("x", -10)
        .attr("y", -30)
        .attr("text-anchor", "end")
        .text("2005");

    svg.append("text")
        .attr("fill", "#000")
        .attr("transform", "translate(" + width + ", 0)")
        .attr("x", 10)
        .attr("y", -30)
        .attr("text-anchor", "start")
        .text("2015");

    var slope = svg.append("g")
        .attr("class", "slopeGroup")
        .selectAll("path")
        .data(data)
        .enter()
      .append("g")
        .attr("class", function(d) {
            d.slope = this;
            return "slope";
        })
        .on("mouseover", function(d) {
            if (d.slope) {
                d.slope.parentNode.appendChild(d.slope);
            }
            d3.selectAll(".slope").classed("faded", true);
            d3.select(this).classed("faded", false);
        })
        .on("mouseout", function(d) {
            d3.selectAll(".slope").classed("faded", false);
        });

    var lines = slope.append("path")
        .attr("class", function(d) {
          if (d.sex === "Males") {
            return "line-male";
          } 
          if (d.sex === "Females") {
            return "line-female";
          }
          return "line-both";
        })
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", function(d) { return line(d.totalIncome.values); });

    var leftLabels = slope.append("g")
        .attr("class", function(d) {
            if (d.sex === "Males") {
                return "slopeLabel label-left label-male";
            } 
            if (d.sex === "Females") {
                return "slopeLabel label-left label-female";
            }
        })
        .attr("transform", function(d) {
            return "translate(" + x(2005) + "," + y(d.totalIncome.values[0].value) + ")";
        });

    var leftRegionLabels = leftLabels.append("text")
        .attr("text-anchor", "end")
        .attr("x", -55)
        .text(function(d) { return d.region; });

    var leftValueLabels = leftLabels.append("text")
        .attr("text-anchor", "end")
        .attr("x", -10)
        .text(function(d) { return format(d.totalIncome.values[0].value); });

    var rightLabels = slope.append("g")
        .attr("class", function(d) {
            if (d.sex === "Males") {
                return "slopeLabel label-right label-male";
            } 
            if (d.sex === "Females") {
                return "slopeLabel label-right label-female";
            }
        })
        .attr("transform", function(d) {
            return "translate(" + x(2015) + "," + y(d.totalIncome.values[1].value) + ")";
        });

      var rightRegionLabels = rightLabels.append("text")
          .attr("x", 55)
          .text(function(d) { return d.region; });

      var rightValueLabels = rightLabels.append("text")
          .attr("x", 10)
          .text(function(d) { return format(d.totalIncome.values[1].value); });

    var alpha = 0.5;
    var spacing = 12;

    function relax(label) { // Borrowed from: https://www.safaribooksonline.com/blog/2014/03/11/solving-d3-label-placement-constraint-relaxing/
        again = false;
        d3.selectAll("." + label).each(function (d, i) {
            var re = /,|\(|\)/;
            var a = this,
                da = d3.select(a),
                transforma = da.attr("transform"),
                xPos = +transforma.split(re)[1]
                y1 = +transforma.split(re)[2];

            d3.selectAll("." + label).each(function (d, j) {
                var b = this;
                // a & b are the same element and don't collide.
                if (a == b) return;
                var db = d3.select(b);
                // a & b are on opposite sides of the chart and
                // don't collide
                // if (da.attr("text-anchor") != db.attr("text-anchor")) return;
                // Now let's calculate the distance between
                // these elements. 

                transformb = db.attr("transform")
                y2 = +transformb.split(re)[2];
                var deltaY = y1 - y2;
                
                // If spacing is greater than our specified spacing,
                // they don't collide.
                if (Math.abs(deltaY) > spacing) return;
                
                // If the labels collide, we'll push each 
                // of the two labels up and down a little bit.
                again = true;
                var sign = deltaY > 0 ? 1 : -1;
                var adjust = sign * alpha;
                da.attr("transform", "translate(" + xPos + "," + (+y1 + adjust) + ")");
                db.attr("transform", "translate(" + xPos + "," + (+y2 - adjust) + ")");
            });
        });
        // Adjust our line leaders here
        // so that they follow the labels. 
        if(again) {
            relax(label);
        }
    }

    relax("label-left");
    relax("label-right");

    d3.select("#incomeType")
        .on("change", function(sel) {
            var incomeType = this.options[this.selectedIndex].value;

            setYDomain(data, incomeType);

            lines.attr("d", function(d) { return line(d[incomeType].values); });
            leftLabels.attr("transform", function(d) {
                return "translate(" + x(2005) + "," + y(d[incomeType].values[0].value) + ")";
            });
            leftValueLabels.text(function(d) { return format(d[incomeType].values[0].value); });
            rightLabels.attr("transform", function(d) {
                return "translate(" + x(2015) + "," + y(d[incomeType].values[1].value) + ")";
            });
            rightValueLabels.text(function(d) { return format(d[incomeType].values[1].value); });

            relax("label-left");
            relax("label-right");
        });
});
