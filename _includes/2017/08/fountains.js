L.Mapzen.apiKey = 'mapzen-8obQaFK';

var iconColour = d3.scaleOrdinal()
  .domain(["Standard", "Combo", "Dog", "Decomissioned", "Tap"])
  .range(["#590CE8", "#C500DB", "#E80C35", "#754c24", "#078e6c"]);

var iconSize = d3.scaleOrdinal()
  .domain([14, 15, 16, 17, 18, 19, 20])
  .range([12, 16, 22, 30, 40, 40, 40]);

var detectMob = function() { 
 if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
  ){
    return true;
  } else {
    return false;
  }
}

var corner1 = L.latLng(49.254074, -123.003616),
  corner2 = L.latLng(49.162721, -122.857018),
bounds = L.latLngBounds(corner1, corner2);

var map = L.Mapzen.map('map', {
    renderer: L.svg(),
    maxBounds: bounds,
    minZoom: 14,
    maxZoom: 20,
    tangramOptions: {
      scene: L.Mapzen.BasemapStyles.Refill
    }
  })
  .setView([49.205718, -122.910956], 13);

var svgLayer = L.svg();
svgLayer.addTo(map);

var mapObj = document.getElementById("map");

var svg = d3.select("#map")
  .select("svg");

var g = d3.select("#map").select("svg").select('g');
g.attr("class", "leaflet-zoom-hide");

var viewMapInfo = function(d) {
    d3.select("#infoBox")
        .style("left", function(temp) {
            var shift = (d3.event.pageX + 8) + "px";
            if (d3.event.pageX > 500) {
                shift = (d3.event.pageX - 310) + "px";
            }
            return shift;
        })
        .style("top", function(temp) {
            console.log(mapObj.getBoundingClientRect().top + " " + d3.event.pageY);
            var svgDist = d3.event.pageY - window.pageYOffset;
            var shift = (d3.event.pageY - 6) + "px";
            if (svgDist > 350) {
                shift = (d3.event.pageY - 360) + "px";
            }
            return shift;
        })
        .style("background", function(e) {
            return iconColour(d.Type);
        });

    d3.select("#area").text(d.Area);
    d3.select("#type").text(d.Type);
    d3.select("#neighbourhood").text(d.Neighbourhood);

    d3.select("#infoImg").attr("src", "{{ site.baseurl }}/img/2017/08/" + d.OBJECTID + ".jpg");

    d3.select("#infoBox").classed("hidden", false);
};

d3.csv("{{ site.baseurl }}/data/2017/08/fountains.csv", function(error, fountains) {
    if (error) throw error;

    fountains.forEach(function(d) {
      d.LatLng = new L.LatLng(d.Y, d.X);
    });

    var fountainCircles = g.selectAll(".fountain")
        .data(fountains)
        .enter()
        .append("image")
        .attr("class", "fountain")
        .attr("xlink:href", function(d) {
          switch (d.Type) {
            case "Combo":
              return "{{ site.baseurl }}/img/2017/08/combo_fountain.png";
              break;
            case "Dog":
              return "{{ site.baseurl }}/img/2017/08/dog_fountain.png";
              break;
            case "Tap":
              return "{{ site.baseurl }}/img/2017/08/tap_fountain.png";
              break;
            case "Decomissioned":
              return "{{ site.baseurl }}/img/2017/08/decomissioned_fountain.png";
              break;
            default:
              return "{{ site.baseurl }}/img/2017/08/standard_fountain.png";
          }
        })
        .on("mouseover", viewMapInfo)
        .on("mouseout", function(d) {
            d3.select("#infoBox").classed("hidden", true);
        });

    map.on("zoomend", update);
    update();

    function update() {
      fountainCircles.attr("transform", function(d) { 
        var halfSize = iconSize(map.getZoom()) / 2;
        return "translate(" +
          (map.latLngToLayerPoint(d.LatLng).x - halfSize) + "," +
          (map.latLngToLayerPoint(d.LatLng).y - halfSize) + ")";
      })
      .attr("width", function(d) { return iconSize(map.getZoom()); })
      .attr("height", function(d) { return iconSize(map.getZoom()); });
    }

    var legend = L.control({position: 'topleft'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML = "<div class='legTitle'>Legend</div><div class='legItem'><img src='{{ site.baseurl }}/img/2017/08/standard_fountain.png'> Standard drinking fountain</div><div class='legItem'><img src='{{ site.baseurl }}/img/2017/08/dog_fountain.png'> Dog tap</div><div class='legItem'><img src='{{ site.baseurl }}/img/2017/08/combo_fountain.png'> Combo standard/dog fountain</div><div class='legItem'><img src='{{ site.baseurl }}/img/2017/08/tap_fountain.png'> Drinking tap</div><div class='legItem'><img src='{{ site.baseurl }}/img/2017/08/decomissioned_fountain.png'> Decomissioned fountain</div>";
        return div;
    };

    legend.addTo(map);
});