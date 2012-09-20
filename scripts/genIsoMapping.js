
var csv = require('ya-csv');

var reader = csv.createCsvFileReader("./data/countrycodes.csv", { columnsFromHeader: true });
reader.addListener('data', function(data) {
  console.log(data.iso3 + ": " + data.iso2);
});

