var TRENDACT = TRENDCT || {};

TRENDCT.helpers = {};

TRENDCT.common = {};
TRENDCT.common.states = {};
TRENDCT.common.states.fips = {
    "AK": "02",
    "AL": "01",
    "AR": "05",
    "AS": "60",
    "AZ": "04",
    "CA": "06",
    "CO": "08",
    "CT": "09",
    "DC": "11",
    "DE": "10",
    "FL": "12",
    "GA": "13",
    "GU": "66",
    "HI": "15",
    "IA": "19",
    "ID": "16",
    "IL": "17",
    "IN": "18",
    "KS": "20",
    "KY": "21",
    "LA": "22",
    "MA": "25",
    "MD": "24",
    "ME": "23",
    "MI": "26",
    "MN": "27",
    "MO": "29",
    "MS": "28",
    "MT": "30",
    "NC": "37",
    "ND": "38",
    "NE": "31",
    "NH": "33",
    "NJ": "34",
    "NM": "35",
    "NV": "32",
    "NY": "36",
    "OH": "39",
    "OK": "40",
    "OR": "41",
    "PA": "42",
    "PR": "72",
    "RI": "44",
    "SC": "45",
    "SD": "46",
    "TN": "47",
    "TX": "48",
    "UT": "49",
    "VA": "51",
    "VI": "78",
    "VT": "50",
    "WA": "53",
    "WI": "55",
    "WV": "54",
    "WY": "56"
};

TRENDCT.common.states.names = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
};

TRENDCT.helpers.property = function(default_val){
    this.__val = default_val;
    return this.__val;
}

TRENDCT.helpers.property.prototype.access = function (val){
    if (typeof(val) == "undefined"){
	return this.__val;
    }
    this.__val = val;
    return this;
}

TRENDCT.helpers.property.prototype.get = function(){
    return this.access();
}

TRENDCT.helpers.property.prototype.set = function(val){
    return this.access(val);
}


TRENDCT.drawable = function(){
    // Initiate some accessible properties.
    // Each has a get and set method

    this.draw_method = new TRENDCT.helpers.property();
    this.__responsive = new TRENDCT.helpers.property();

    this.draw_method.set(function(){
	throw "TRENDCT.drawable Use .draw_method.set(function(){...}) "
	    + "to set up a draw callback.";
    });
    
    // Draw
    this.draw();    
}

TRENDCT.drawable.prototype.responsive = function(val, r_id){
    // Unbind draw from resize
    d3.select(window).on("resize.drawable_" + r_id, null);
    if (val === false){
	return this;
    }
    // Bind draw to resize event
    else if (val === true){
	var that = this;
	this.redraw_event = d3.select(window).on("resize.drawable_" + r_id, function(){
	    that.draw();
	});
    }
    return this;
}

TRENDCT.drawable.prototype.draw = function(){
    try {
	var draw = this.draw_method.get();
	draw();
    }
    catch (e) {
	console.error(e);
    }
}

// -----------------------------------------------
// trend-cards
// -----------------------------------------------

TRENDCT.cards = function(){
    this.drawable = new TRENDCT.drawable();
    this.drawable.draw_method.get(this.draw);

    // Accessors
    this.data = new TRENDCT.helpers.property();
    this.selector = new TRENDCT.helpers.property();
    this.config = new TRENDCT.helpers.property();

    // This is not a responsive design
    // this.drawable.responsive(true);
}

TRENDCT.cards.prototype.draw = function(){

    var sorted = this.data.get().sort(function(a, b){
	if (b["2016"] == a["2016"]){
	    return a.index - b.index;
	} 
	return b["2016"] - a["2016"];
    });
    // Make cards
    var cards = d3.select(this.selector.get())
	.selectAll("div.trend-card")
	.data(sorted)
	.enter()
	.append("div")
	.classed("trend-card", true);
    // Add text
    var headings = cards.append("h3")
	.classed("mw-heading", true)

    var ranks = headings.append("span")
	.classed("mw-rank", true)

    ranks.append("small")
	.text(function(d, i){
	    return i + 1;
	});
    
    headings.append("span")
	.classed("mw-state-icon", true)
	.classed("stateface-replace", true)
	.attr("data-state-abbr", function(d, i){
	    var rank = i + 1;
	    var st_abbr = d.index;
	    if (st_abbr.toUpperCase() == "FEDERAL"){
		st_abbr = "US";
	    }
	    return st_abbr;
	    // return rank + ":" + st_abbr;
	});

    var sf = new TRENDCT.stateface(this.selector.get());
    sf.update();
    headings.append("span")
	.classed("mw-2016", true)
	.text(function(d, i){
	    return TRENDCT.common.states.names[d.index] || d.index;
	});
    headings.append("span")
	.text(function(d){
	    return "$" + Number(d["2016"]).toFixed(2);
	});

    // Add text description
    var that = this;
    var descriptions = cards.append("div")
	.classed("mw-explainer", true)
	.attr("data-str", function(d){ return d.index })
	.html(function(d){
	});
    
    // Add charts

    var charts = cards.append("div")
	.classed("mw-timeline", true)

    cards.on("click", function(d){

	d3.selectAll(".trend-card.expanded")
	    .classed("expanded", false);

	d3.select(this).
	    classed("expanded", true);
	
	d3.selectAll("picture")
	    .style("display","none");

	d3.select("picture[data-st='" + d.index + "']")
	    .style("display","block");
    });
    
    var pictures = cards.append("picture")
	.style("display", "none")
	.attr("data-st", function(d){
	    return d.index;
	});

    var xlg_pics = pictures
	.append("source")
	.attr("media","(min-width: 1000px)")
	.attr("srcset", function(d){
	    return "img/" + d.index + "-1200x300" + ".png";
	});
    
    var lg_pics = pictures
	.append("source")
	.attr("media","(min-width: 800px)")
	.attr("srcset", function(d){
	    return "img/" + d.index + "-800x300" + ".png";
	});

    var md_pics = pictures
	.append("source")
	.attr("media","(min-width: 600px)")
	.attr("srcset", function(d){
	    return "img/" + d.index + "-600x300" + ".png";
	});

    var sm_pics = pictures
	.append("source")
	.attr("media","(min-width: 300px)")
	.attr("srcset", function(d){
	    return "img/" + d.index + "-300x300" + ".png";
	});

    var fallback_pics = pictures
	.append("img")
	.attr("src", function(d){
	    return "img/" + d.index + "-300x300" + ".png";
	});

}

TRENDCT.cards.prototype.load_csv = function(csv){
    var that = this;
    d3.csv(csv, function(data){
	that.data.set(data);
	console.log("Loaded data", that.data.get());
	that.draw();
    });
    
}
    
cards = new TRENDCT.cards
cards.selector.set("#trend-graphic-container");
cards.load_csv("data/for_chart.csv");
