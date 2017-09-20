var margin = {top: 30, right: 180, bottom: 30, left: 180},
    width = 740 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scaleOrdinal()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

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
  d["Median 2005 Total Income"] = +d["Median 2005 Total Income"];
  d["Median 2016 Total Income"] = +d["Median 2016 Total Income"];
  d["Median 2005 After-tax Income"] = +d["Median 2005 After-tax Income"];
  d["Median 2016 After-tax Income"] = +d["Median 2016 After-tax Income"];
  d["Median 2005 Employment Income"] = +d["Median 2005 Employment Income"];
  d["Median 2016 Employment Income"] = +d["Median 2016 Employment Income"];
  
  d.totalIncome = [
    {year: 2005, value: d["Median 2005 Total Income"]}, 
    {year: 2016, value: d["Median 2016 Total Income"]}
  ];
  d.afterTaxIncome = [
    {year: 2005, value: d["Median 2005 After-tax Income"]}, 
    {year: 2016, value: d["Median 2016 After-tax Income"]}
  ];
  d.employmentIncome = [
    {year: 2005, value: d["Median 2005 Employment Income"]}, 
    {year: 2016, value: d["Median 2016 Employment Income"]}
  ];

  return d;
}

var setYDomain = function(data, income) {
  y.domain([d3.min(data, function(c) { return d3.min(c[income], function(d) { return d.value; }); }),
            d3.max(data, function(c) { return d3.max(c[income], function(d) { return d.value; }); })]);
}

d3.csv("{{ site.baseurl }}/data/2017/09/gender_income.csv", type, function(error, data) {

  x.domain([2005, 2016]);
  setYDomain(data, "totalIncome");
 
  svg.append("text")
      .attr("fill", "#000")
      .attr("y", -15)
      .attr("text-anchor", "end")
      .text("2005");

  svg.append("text")
      .attr("fill", "#000")
      .attr("transform", "translate(" + width + ", 0)")
      .attr("x", 5)
      .attr("y", -15)
      .attr("text-anchor", "start")
      .text("2016");

      console.log(data);

    var slope = svg.append("g")
        .selectAll("path")
        .data(data)
        .enter()
      .append("g")
        .attr("class", "slope");

    var lines = slope.append("path")
        .attr("class", function(d) {
          if (d.Gender === "Male") {
            return "line-male";
          } 
          if (d.Gender === "Female") {
            return "line-female";
          }
        })
        .attr("fill", "none")
        .attr("stroke", function(d) {
          if (d.Gender === "Male") {
            return "#0095FF";
          } 
          if (d.Gender === "Female") {
            return "#FF1D19";
          }
        })
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("blah", function(d) {
          return d["Median 2016 Total Income"];
        })
        .attr("d", function(d) {
          return line(d.totalIncome);
        });

    var leftLabels = slope.append("text")
      .attr("class", function(d) {
        if (d.Gender === "Male") {
          return "slopeLabel label-male";
        } 
        if (d.Gender === "Female") {
          return "slopeLabel label-female";
        }
      })
      .attr("x", x(2005))
      .attr("y", function(d) {
        return y(d["Median 2005 Total Income"]);
      })
      .attr("text-anchor", "end")
      .text(function(d) {
        return d["Region"] + " " + d["Median 2005 Total Income"];
      });

    var rightLabels = slope.append("text")
      .attr("class", function(d) {
        if (d.Gender === "Male") {
          return "slopeLabel label-male";
        } 
        if (d.Gender === "Female") {
          return "slopeLabel label-female";
        }
      })
      .attr("x", x(2016))
      .attr("y", function(d) {
        return y(d["Median 2016 Total Income"]);
      })
      .text(function(d) {
        return d["Region"] + " " + d["Median 2016 Total Income"];
      });



    var alpha = 0.5;
    var spacing = 12;

    function relax() { // Borrowed from: https://www.safaribooksonline.com/blog/2014/03/11/solving-d3-label-placement-constraint-relaxing/
        again = false;
        d3.selectAll(".slopeLabel").each(function (d, i) {
            var a = this,
                da = d3.select(a),
                y1 = da.attr("y");
            d3.selectAll(".slopeLabel").each(function (d, j) {
                var b = this;
                // a & b are the same element and don't collide.
                if (a == b) return;
                var db = d3.select(b);
                // a & b are on opposite sides of the chart and
                // don't collide
                if (da.attr("text-anchor") != db.attr("text-anchor")) return;
                // Now let's calculate the distance between
                // these elements. 
                var y2 = db.attr("y");
                var deltaY = y1 - y2;
                
                // If spacing is greater than our specified spacing,
                // they don't collide.
                if (Math.abs(deltaY) > spacing) return;
                
                // If the labels collide, we'll push each 
                // of the two labels up and down a little bit.
                again = true;
                var sign = deltaY > 0 ? 1 : -1;
                var adjust = sign * alpha;
                da.attr("y",+y1 + adjust);
                db.attr("y",+y2 - adjust);
            });
        });
        // Adjust our line leaders here
        // so that they follow the labels. 
        if(again) {
            relax();
        }
    }

    relax();

    d3.select("#incomeType")
        .on("change", function(sel) {
              var incomeType = this.options[this.selectedIndex].value;
            
              if (incomeType === "total_income") {
                  setYDomain(data, "totalIncome");
                  lines.attr("d", function(d) { return line(d.totalIncome); });
                  leftLabels.attr("y", function(d) { return y(d["Median 2005 Total Income"]); })
                      .text(function(d) { return d["Region"] + " " + d["Median 2005 Total Income"]; });
                  rightLabels.attr("y", function(d) { return y(d["Median 2016 Total Income"]); })
                      .text(function(d) { return d["Region"] + " " + d["Median 2016 Total Income"]; });

              } else if (incomeType === "after_tax_income") {
                  setYDomain(data, "afterTaxIncome");
                  lines.attr("d", function(d) { return line(d.afterTaxIncome); });
                  leftLabels.attr("y", function(d) { return y(d["Median 2005 After-tax Income"]); })
                      .text(function(d) { return d["Region"] + " " + d["Median 2005 After-tax Income"]; });
                  rightLabels.attr("y", function(d) { return y(d["Median 2016 After-tax Income"]); })
                      .text(function(d) { return d["Region"] + " " + d["Median 2016 After-tax Income"]; });

              } else {
                  setYDomain(data, "employmentIncome");
                  lines.attr("d", function(d) { return line(d.employmentIncome); });
                  leftLabels.attr("y", function(d) { return y(d["Median 2005 Employment Income"]); })
                      .text(function(d) { return d["Region"] + " " + d["Median 2005 Employment Income"]; });
                  rightLabels.attr("y", function(d) { return y(d["Median 2016 Employment Income"]); })
                      .text(function(d) { return d["Region"] + " " + d["Median 2016 Employment Income"]; });
              }

              relax();
        });
});
