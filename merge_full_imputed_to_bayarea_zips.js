var fs = require('fs');
var csv = require('ya-csv');
var zips = require("./data/bayarea_zips.json");

var zip_properties = {};
for (var feature of zips.features) {
  zip_properties[feature.properties.ZIP] = feature.properties;
}

var reader = csv.createCsvFileReader('./data/rent_data_imputed.csv', { columnsFromHeader: true });
reader.on('data', function(data) {
  
  for (var attrname in data) {
    if (attrname.substring(0,8) == 'missing_' || attrname == '' || attrname == 'zip') { continue; }
    
    var missing_attrname = 'missing_' + attrname;
    var imputed = (data[missing_attrname] != undefined && data[missing_attrname] == "TRUE") ? true : false;

    zip_properties[data.zip][attrname] = { value: data[attrname], imputed: imputed };
  }
});

reader.on('end', function(){
  var json_str = JSON.stringify(zips);
  var fn = "./data/bayarea_zips_augmented.json";
  
  fs.writeFile(fn, json_str, function(err) {
    console.log(err ? err : "Created " + fn);
  }); 
});