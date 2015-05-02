var csv = require('ya-csv');

var zips = {};
var full_keys = [
  'zip',
  '1br_rent',
  '2br_rent',
  '3br_rent',
  'studio_rent',
  'all_rent',
  '1br_availability',
  '2br_availability',
  '3br_availability',
  'studio_availability',
  'population',
  'population_density',
  'median_household_income',
  'mean_household_income',
  'land_area',
  'water_area',
  'white',
  'black',
  'asian',
  'hispanic',
  'male_population',
  'median_age'
]
var writer = csv.createCsvFileWriter('./data/rent_data_with_census.csv', 'w');
writer.writeRecord(full_keys);

var reader_rent_data = csv.createCsvFileReader('./data/rent_data.csv', { columnsFromHeader: true });
reader_rent_data.on('data', function(data) {
  var zip = data.zipcode;
  delete data.zipcode;
  
  zips[zip] = data;
});

reader_rent_data.on('end', function(){
  var reader_census = csv.createCsvFileReader('./data/census.csv', { columnsFromHeader: true });
  reader_census.on('data', function(census_row) {

    var full_zip_data = zips[census_row.zip];
    if (full_zip_data !== "undefined") {
      
      for (var attrname in census_row) { full_zip_data[attrname] = census_row[attrname] }
      
      var output_row = [];
      for (var key of full_keys) {
        output_row.push(full_zip_data[key]);
      }
      writer.writeRecord(output_row);
      
    } else {
      console.log(census_row.zip + " is undefined in rent_data.csv but present in census.csv");
    }
  });
});
