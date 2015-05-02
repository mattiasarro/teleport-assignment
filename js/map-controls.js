angular.module('teleport', ['ui.bootstrap']);

angular.module('teleport').controller('MapControls', function ($scope) {
  
  $scope.flatOption = {id: "", name: "choose flat type"};
  $scope.flatOptions = [
    {id: "studio", name: "studio flats"},
    {id: "X1br", name: "1 bedroom flats"},
    {id: "X2br", name: "2 bedroom flats"},
    {id: "X3br", name: "3 bedroom flats"},
    {id: "all", name: "all flats"}
  ];
  
  $scope.availabilityRent = 'rent';
    
  function l(o) {console.log(o); }
  
  $scope.setFlatOption = function(flatOption) {
    $scope.flatOption = flatOption;
    setChoro();
  }

  $scope.setAvailabilityRent = function(availabilityRent) {
    $scope.availabilityRent = availabilityRent;
    setChoro();
  }
  
  function setChoro() {
    var choropleth_property = $scope.flatOption.id + "_" + $scope.availabilityRent;
    var color = $scope.availabilityRent == "rent" ? "red" : "green";
    l(choropleth_property);
    var color = d3.scale.linear().domain([0,maxValue(choropleth_property)]).range(['white',color]);
    window.bay_area.attr('fill', function(d,i) {
      var prop = d.properties[choropleth_property];
      if (prop != undefined) {
        return(color(prop.value));
      }
    });
  }
  
  function maxValue() {
    var arr = [];
    for (var i=0; i < window.zip_areas.features.length; i++) {
      var feature = window.zip_areas.features[i];
      var pushPropertyValue = function(key) {
        var prop = feature.properties[key];
        if (prop != undefined) {
          arr.push(parseInt(prop.value));
        }
      }
      if ($scope.availabilityRent == "rent") {
        pushPropertyValue("studio_rent");
        pushPropertyValue("X1br_rent");
        pushPropertyValue("X2br_rent");
        pushPropertyValue("X3br_rent");
        pushPropertyValue("all_rent");
      } else {
        pushPropertyValue("studio_availability");
        pushPropertyValue("X1br_availability");
        pushPropertyValue("X2br_availability");
        pushPropertyValue("X3br_availability");        
      }
    }
    return(d3.max(arr));
  }
    
});