let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then(function (data) {
    console.log(data)
    createFeatures(data.features);
    var max_depth = data.features;
    let arr = [];
    for (var i=0; i<max_depth.length; i++) {
        
        var maxes = max_depth[i].geometry;
        var depth = (maxes.coordinates[2]);
        arr.push(depth);


    }
    var max = arr.reduce(function(a, b) {
        return Math.max(a, b);
    }, 0);
    console.log(`Max depth is: ${max}`)
    var min = arr.reduce(function(a, b) {
        return Math.min(a, b);
    }, 0);
    console.log(`Max depth is: ${min}`)
});

function createFeatures(earthquakeData) {

    function style(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: color(feature.geometry.coordinates[2]),
          color: "#000000",
          radius: radius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }
        function color(depth) {
        
        if (depth > 600) return "#FF6734";
          
        else if (depth > 300) return "#FF7734";
          
        else if (depth > 100) return "#FFA634";
          
        else if (depth > 10) return "#FFB634";
          
        else if (depth > -5) return "#FFD634";
          
        else return "#FFF534";
          
      }
        function radius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
    
        return magnitude * 3;
      }

    
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}km</p>`);
    }
  
    
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
       },
       style: style,
      onEachFeature: onEachFeature
    });
  
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    var myMap = L.map("map", {
      center: [
        31.508, 17,4
      ],
      zoom: 2,
      layers: [street, earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  function color(depth) {
        
        if (depth > 600) return "#FF6734";
          
        else if (depth > 300) return "#FF7734";
          
        else if (depth > 100) return "#FFA634";
          
        else if (depth > 10) return "#FFB634";
          
        else if (depth > 0) return "#FFD634";
          
        else return "#FFF534";
          
      }

  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
      limits = [-10, 0, 10, 100, 300, 600];
      var labels = [];
      var legendInfo = "<h2>Earhquake Depth (km)</h2>";

      div.innerHTML = legendInfo;

      // go through each magnitude item to label and color the legend
      // push to labels array as list item
      for (var i = 0; i < limits.length; i++) {
          labels.push('<li style="background-color:' + color(limits[i] + 1) + '"> <span>' + limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '' : '+') + '</span></li>');
      }

      // add each label list item to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";

      return div;
  };
  legend.addTo(myMap);

    
      
  
  };


  


