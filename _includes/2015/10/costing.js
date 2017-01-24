costingChart();

function costingChart() {

var width = 740,
    height = 800,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category20c();
		
var numFormat = d3.format(",.1f");

var selYear = "2016-17";

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return 1; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y / 2); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

drawCosting("liberal");

function drawCosting(kind) {
	var svg = d3.select("#costingChart").append("svg")
		.attr("class", "costingSvg")
	    .attr("width", width)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

	d3.json("{{ site.baseurl }}/data/2015/10/20/" + kind.toLowerCase() + "_costing.json", function(error, root) {
	  if (error) throw error;
	
		var value = function(d) { return d[selYear]; };
		var highlight = -1;

	  var path = svg.datum(root).selectAll("path")
	      .data(partition.value(value).nodes)
	    .enter().append("path")
	      //.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
	      .attr("d", arc)
	      .style("stroke", "#fff")
	      .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
	      .style("fill-rule", "evenodd")
	      .each(stash)
			.on("mouseover", function(d) {
				showTooltip(d, this);
			})
			.on("mousedown", function(d) {
				showTooltip(d, this);
			});
		
		function showTooltip(d, obj) {
			highlight = d;
			d3.selectAll("#costingChart .sel").classed("sel", false);
			d3.select(obj).classed("sel", true);
		  d3.select("#costingTip").select("#tipBudget")
		    .text(d.name);
		  d3.select("#costingTip").select("#tipVal")
		    .text(numFormat(d.value) + " million dollars");
		}

	  d3.selectAll("input").on("change", function change() {
			selYear = this.value;
	    var value = function(d) { return d[selYear]; };

		  path
			    .data(partition.value(value).nodes)
			  .transition()
			    .duration(1500)
			    .attrTween("d", arcTween);
				
			if (highlight !== -1) {
			  d3.select("#costingTip").select("#tipVal")
			    .text(numFormat(highlight[selYear]) + " million dollars");
			}
	  });
	});

	function stash(d) {
	  d.x0 = d.x;
	  d.dx0 = d.dx;
	}

	function arcTween(a) {
	  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
	  return function(t) {
	    var b = i(t);
	    a.x0 = b.x;
	    a.dx0 = b.dx;
	    return arc(b);
	  };
	}

	d3.select(self.frameElement).style("height", height + "px");

	d3.select("#selectCosting")
	  .on("change", selected);

	function selected() {
	  d3.selectAll(".costingSvg")
	    .remove();
	  d3.select("#costingTip").select("#tipBudget")
	    .text("");
	  d3.select("#costingTip").select("#tipVal")
	    .text("");
	  drawCosting(this.options[this.selectedIndex].value);
	}
}

}