(function() {

  var height = 800;
  var width = 800;
  var projection = d3.geo.mercator();
  window.bay_area = void 0;
  var map = void 0;
  
  var l = function(msg) { console.log(msg); }
  var geoID = function(d) { return "c" + d.properties.ZIP; }
  var zoomed = function () {
    // d3.event.translate: This defines the position of the map in relation to the mouse in terms of an SVG translate
    // d3.event.scale: This defines how much the user has zoomed in terms of an SVG scale
    map.attr("transform", "translate("+ d3.event.translate + ") scale(" + d3.event.scale + ")");
  };
  var zoom = d3.behavior.zoom()
     .scaleExtent([1, 8])
     .on("zoom", zoomed)
     .size([width, height]);

  // d3 helper that converts geo coordinates to paths based on a projection
  var path = d3.geo.path().projection(projection);
  
  var svg = d3.select("#map")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
   
  d3.json('data/bayarea_zips_augmented.json', function(zip_areas) {
    window.zip_areas = zip_areas;
    l(zip_areas);
        
    // Setup the scale and translate
    projection.scale(1).translate([0, 0]);
    
    var b = path.bounds(zip_areas); // [[left, bottom], [right, top]]
    var left = b[0][0];
    var right = b[1][0];
    var top = b[1][1];
    var bottom = b[0][1];
    
    var scale_width = (right - left) / width
    var scale_height = (top - bottom) / height
    var s = .95 / Math.max(scale_width, scale_height); // leave 5% space around edges
    projection.scale(s)
    
    // translate to center the areas, since the earlier scale() scales even the x/y attributes
    var trans_x = (width - s * (right + left)) / 2;
    var trans_y = (height - s * (top + bottom)) / 2;
    projection.translate([trans_x, trans_y]);

    map = svg.append('g').attr('class', 'zip_bounds');
    window.bay_area = map.selectAll('path').data(zip_areas.features);

    //Enter
    window.bay_area.enter()
       .append('path')
       .attr('d', path)
       .attr('id', geoID)
       .on('click', function(d){
         d3.select('#' + geoID(d)).attr('stroke', 'blue');
       })
    


    //Exit
    window.bay_area.exit().remove();
    
    svg.append("rect")
       .attr("class", "overlay")
       .attr("width", width)
       .attr("height", height)
       .call(zoom);
  });

})();