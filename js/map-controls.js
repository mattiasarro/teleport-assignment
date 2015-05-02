angular.module('teleport', ['ui.bootstrap']);

angular.module('teleport').controller('MapControls', function ($scope) {
  
  $scope.flatOptions = [
    {id: "studio", name: "studio flats"},
    {id: "1br", name: "1 bedroom flats"},
    {id: "2br", name: "2 bedroom flats"},
    {id: "3br", name: "3 bedroom flats"},
    {id: "all", name: "all flats"}
  ];
  
  $scope.setFlatOption = function(id) {
    alert(id);
  }
  
  $scope.availabilityRent = 'rent';
  
});