var iconColour = d3.scaleOrdinal()
  .domain(["Standard", "Combo", "Dog", "Decomissioned", "Tap"])
  .range(["#590CE8", "#C500DB", "#E80C35", "#754c24", "#078e6c"]);

var iconSize = d3.scaleOrdinal()
  .domain([14, 15, 16, 17, 18, 19, 20])
  .range([12, 16, 22, 30, 40, 40, 40]);

L.Mapzen.apiKey = 'mapzen-8obQaFK';

var corner1 = L.latLng(49.266613, -123.003359),
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

var fountainIcon = L.Icon.extend({
    options: {
        iconSize:     [20, 20],
        iconAnchor:   [10, 10],
        popupAnchor:  [0, -10]
    }
});

var stdIcon = new fountainIcon({iconUrl: "{{ site.baseurl }}/img/2017/08/standard_fountain.png"}),
    comboIcon = new fountainIcon({iconUrl: "{{ site.baseurl }}/img/2017/08/combo_fountain.png"}),
    dogIcon = new fountainIcon({iconUrl: "{{ site.baseurl }}/img/2017/08/dog_fountain.png"}),
    decomIcon = new fountainIcon({iconUrl: "{{ site.baseurl }}/img/2017/08/decomissioned_fountain.png"}),
    tapIcon = new fountainIcon({iconUrl: "{{ site.baseurl }}/img/2017/08/tap_fountain.png"});

d3.csv("{{ site.baseurl }}/data/2017/08/fountains.csv", function(error, fountains) {
    if (error) throw error;

    fountains.forEach(function(d) {
        var fountainImage = "{{ site.baseurl }}/img/2017/08/" + d.OBJECTID + ".jpg";
        var popupHtml = "<p class='infoTitle'>" + d.Type + " Fountain</p><p class='info'><span class='infoLabel'>Location</span>: " + d.Area + "</p><p class='info'><span class='infoLabel'>Neighbourhood</span>: " + d.Neighbourhood + "</p><img id='infoImg' src=" + fountainImage + "/>"

        switch (d.Type) {
          case "Combo":
            return L.marker([d.Latitude, d.Longitude], {icon: comboIcon})
                    .addTo(map)
                    .bindPopup(popupHtml);
            break;
          case "Dog":
            return L.marker([d.Latitude, d.Longitude], {icon: dogIcon})
                    .addTo(map)
                    .bindPopup(popupHtml);
            break;
          case "Tap":
            return L.marker([d.Latitude, d.Longitude], {icon: tapIcon})
                    .addTo(map)
                    .bindPopup(popupHtml);
            break;
          case "Decomissioned":
            return L.marker([d.Latitude, d.Longitude], {icon: decomIcon})
                    .addTo(map)
                    .bindPopup(popupHtml);
            break;
          default:
            return L.marker([d.Latitude, d.Longitude], {icon: stdIcon})
                    .addTo(map)
                    .bindPopup(popupHtml);
        }
    });

    var legend = L.control({position: 'topleft'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML = "<div class='legTitle'>Legend</div><div class='legItem'><img src='{{ site.baseurl }}/img/2017/08/standard_fountain.png'> Standard drinking fountain</div><div class='legItem'><img src='{{ site.baseurl }}/img/2017/08/dog_fountain.png'> Dog tap</div><div class='legItem'><img src='{{ site.baseurl }}/img/2017/08/combo_fountain.png'> Combo standard/dog fountain</div><div class='legItem'><img src='{{ site.baseurl }}/img/2017/08/tap_fountain.png'> Drinking tap</div><div class='legItem'><img src='{{ site.baseurl }}/img/2017/08/decomissioned_fountain.png'> Decomissioned fountain</div>";
        return div;
    };

    legend.addTo(map);
});