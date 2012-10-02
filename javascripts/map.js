var width = 580,
    height = 500,
    centered, last_d;

var projection = d3.geo.mercator()
    .translate([0, 0]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map_container").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", click);

var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  .append("g")
    .attr("id", "countries");

d3.json("data/countries.geo.json", function(json) {
  g.selectAll("path")
      .data(json.features)
    .enter().append("path")
      .attr("d", path)
      .on("click", click);
});

$.getJSON('json/countries/reference.json', function(json) {
  REFERENCE_JSON = json;
  doGlobal();
  $("body").show();
});

function click(d) {
  var x = 0,
      y = 0,
      k = 1;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = -centroid[0];
    y = -centroid[1];
    k = 4;
    centered = d;
  } else {
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(1000)
      .attr("transform", "scale(" + k + ")translate(" + x + "," + y + ")")
      .style("stroke-width", 1.5 / k + "px");

  var iso2 = ISO_MAP[d.id];

  if (d == last_d) {
    last_d = null;
    doGlobal();
  } else {
    last_d = d;

    var name = null;
    for (var i=0; i<REFERENCE_JSON.length; i++) {
      var item = REFERENCE_JSON[i];
      var full_name = item["name"];
      if (full_name.substring(0, 2) == iso2) {
        name = full_name;
        break;
      }
    }

    if (name == null) {
      console.log("Country " + iso2 + " not found in reference json");
      return;
    }

    $("#map_label").text(d.id + ":" + iso2 + ":" + name);
    $.getJSON('json/countries/' + full_name.replace(" ", "_") + '/activities.json', redrawActivity);
    $.getJSON('json/countries/' + full_name.replace(" ", "_") + '/ips.json', redrawIps);
  }
}

function doGlobal() {
    $("#map_label").text("Overall");
    $.get('csv/top_activity.csv', function(csv) {
      dataArray = $.csv2Array(csv);

      var data = [];
      for (var i=0; i<dataArray.length; i++) {
        var line = dataArray[i];
        if (line.length == 3) {
          data.push({name: line[1], number: line[2]});
        }
      }
      redrawActivity(data);
    });

    $.get('csv/mostwanted_ip.csv', function(csv) {
      dataArray = $.csv2Array(csv);

      var data = [];
      for (var i=0; i<dataArray.length; i++) {
        var line = dataArray[i];
        if (line.length == 3) {
          data.push({ip: line[1], malicious_activities: line[2]});
        }
      }
      redrawIps(data);
    });
}

function redrawActivity(data) {
  var labels = d3.select("ul#activities").selectAll("li")
  .data(data)
  .text(function(d) { return d.name + ": " + d.number; });
  labels.enter().append("li").text(function(d) { return d.name + ": " + d.number; });
  labels.exit().remove();
}

function redrawIps(data) {
  var labels = d3.select("ul#ips").selectAll("li")
  .data(data)
  .text(function(d) { return d.ip + ": " + d.malicious_activities; });
  labels.enter().append("li").text(function(d) { return d.ip + ": " + d.malicious_activities; });
  labels.exit().remove();
}

var ISO_MAP = {
  "ATA": "QO",
  "AFG": "AF",
  "ALA": "AX",
  "ALB": "AL",
  "DZA": "DZ",
  "ASM": "AS",
  "AND": "AD",
  "AGO": "AO",
  "AIA": "AI",
  "ATG": "AG",
  "ARG": "AR",
  "ARM": "AM",
  "ABW": "AW",
  "AUS": "AU",
  "AUT": "AT",
  "AZE": "AZ",
  "BHS": "BS",
  "BHR": "BH",
  "BGD": "BD",
  "BRB": "BB",
  "BLR": "BY",
  "BEL": "BE",
  "BLZ": "BZ",
  "BEN": "BJ",
  "BMU": "BM",
  "BTN": "BT",
  "BOL": "BO",
  "BES": "BQ",
  "BIH": "BA",
  "BWA": "BW",
  "BRA": "BR",
  "IOT": "IO",
  "VGB": "VG",
  "BRN": "BN",
  "BGR": "BG",
  "BFA": "BF",
  "BDI": "BI",
  "KHM": "KH",
  "CMR": "CM",
  "CAN": "CA",
  "CPV": "CV",
  "CYM": "KY",
  "CAF": "CF",
  "TCD": "TD",
  "CHL": "CL",
  "CHN": "CN",
  "CXR": "CX",
  "CCK": "CC",
  "COL": "CO",
  "COM": "KM",
  "COG": "CG",
  "ZAR": "CD",
  "COK": "CK",
  "CRI": "CR",
  "HRV": "HR",
  "CUB": "CU",
  "CUW": "CW",
  "CYP": "CY",
  "CZE": "CZ",
  "DNK": "DK",
  "DJI": "DJ",
  "DMA": "DM",
  "DOM": "DO",
  "TLS": "TL",
  "ECU": "EC",
  "EGY": "EG",
  "SLV": "SV",
  "GNQ": "GQ",
  "ERI": "ER",
  "EST": "EE",
  "ETH": "ET",
  "FRO": "FO",
  "FLK": "FK",
  "FJI": "FJ",
  "FIN": "FI",
  "FRA": "FR",
  "GUF": "GF",
  "PYF": "PF",
  "ATF": "TF",
  "GAB": "GA",
  "GMB": "GM",
  "GEO": "GE",
  "DEU": "DE",
  "GHA": "GH",
  "GIB": "GI",
  "GRC": "GR",
  "GRL": "GL",
  "GRD": "GD",
  "GLP": "GP",
  "GUM": "GU",
  "GTM": "GT",
  "GGY": "GG",
  "GIN": "GN",
  "GNB": "GW",
  "GUY": "GY",
  "HTI": "HT",
  "VAT": "VA",
  "HND": "HN",
  "HKG": "HK",
  "HUN": "HU",
  "ISL": "IS",
  "IND": "IN",
  "IDN": "ID",
  "IRN": "IR",
  "IRQ": "IQ",
  "IRL": "IE",
  "IMN": "IM",
  "ISR": "IL",
  "ITA": "IT",
  "CIV": "CI",
  "JAM": "JM",
  "JPN": "JP",
  "JEY": "JE",
  "JOR": "JO",
  "KAZ": "KZ",
  "KEN": "KE",
  "KIR": "KI",
  "KWT": "KW",
  "KGZ": "KG",
  "LAO": "LA",
  "LVA": "LV",
  "LBN": "LB",
  "LSO": "LS",
  "LBR": "LR",
  "LBY": "LY",
  "LIE": "LI",
  "LTU": "LT",
  "LUX": "LU",
  "MAC": "MO",
  "MKD": "MK",
  "MDG": "MG",
  "MWI": "MW",
  "MYS": "MY",
  "MDV": "MV",
  "MLI": "ML",
  "MLT": "MT",
  "MHL": "MH",
  "MTQ": "MQ",
  "MRT": "MR",
  "MUS": "MU",
  "MYT": "YT",
  "MEX": "MX",
  "FSM": "FM",
  "MDA": "MD",
  "MCO": "MC",
  "MNG": "MN",
  "MNE": "ME",
  "MSR": "MS",
  "MAR": "MA",
  "MOZ": "MZ",
  "MMR": "MM",
  "NAM": "NA",
  "NRU": "NR",
  "NPL": "NP",
  "ANT": "AN",
  "NLD": "NL",
  "NCL": "NC",
  "NZL": "NZ",
  "NIC": "NI",
  "NER": "NE",
  "NGA": "NG",
  "NIU": "NU",
  "NFK": "NF",
  "PRK": "KP",
  "MNP": "MP",
  "NOR": "NO",
  "OMN": "OM",
  "PAK": "PK",
  "PLW": "PW",
  "PSE": "PS",
  "PAN": "PA",
  "PNG": "PG",
  "PRY": "PY",
  "PER": "PE",
  "PHL": "PH",
  "PCN": "PN",
  "POL": "PL",
  "PRT": "PT",
  "PRI": "PR",
  "QAT": "QA",
  "ROU": "RO",
  "RUS": "RU",
  "RWA": "RW",
  "REU": "RE",
  "BES": "BQ",
  "BLM": "BL",
  "KNA": "KN",
  "SHN": "SH",
  "LCA": "LC",
  "MAF": "MF",
  "SPM": "PM",
  "VCT": "VC",
  "WSM": "WS",
  "SMR": "SM",
  "STP": "ST",
  "SAU": "SA",
  "SEN": "SN",
  "SRB": "RS",
  "SYC": "SC",
  "SLE": "SL",
  "SGP": "SG",
  "BES": "BQ",
  "SXM": "SX",
  "SVK": "SK",
  "SVN": "SI",
  "SLB": "SB",
  "SOM": "SO",
  "SOM": "SO",
  "ZAF": "ZA",
  "SGS": "GS",
  "KOR": "KR",
  "SSD": "SS",
  "ESP": "ES",
  "LKA": "LK",
  "SDN": "SD",
  "SUR": "SR",
  "SWZ": "SZ",
  "SWE": "SE",
  "CHE": "CH",
  "SYR": "SY",
  "TWN": "TW",
  "TJK": "TJ",
  "TZA": "TZ",
  "THA": "TH",
  "TGO": "TG",
  "TKL": "TK",
  "TON": "TO",
  "TTO": "TT",
  "TUN": "TN",
  "TUR": "TR",
  "TKM": "TM",
  "TCA": "TC",
  "TUV": "TV",
  "UGA": "UG",
  "UKR": "UA",
  "ARE": "AE",
  "GBR": "GB",
  "USA": "US",
  "VIR": "VI",
  "URY": "UY",
  "UZB": "UZ",
  "VUT": "VU",
  "VEN": "VE",
  "VNM": "VN",
  "WLF": "WF",
  "ESH": "EH",
  "YEM": "YE",
  "ZMB": "ZM",
  "ZWE": "ZW"
};

