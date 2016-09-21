/** 
 * TRENDCT.stateface
 * tool for replacing state postal abbreviations
 * jake kara, jake@jakekara.com
 * September 2016
 * -----------------
 * with stateface codes:
 * https://propublica.github.io/stateface/
 */

// TrendCT namespace
var TRENDCT = TRENDCT || {};

// Constructor
TRENDCT.stateface = function(selector){
    this.selector = selector || "body";
    // Register event listener on page load

};

// Retrieve the stateface code of a state.
TRENDCT.stateface.prototype.code = function(abbr){
    var abbr_upper = abbr.toUpperCase();
    var stateface_codes = {
	"AL": "B",
	"AK": "A",
	"AZ": "D",
	"AR": "C",
	"CA": "E",
	"CO": "F",
	"CT": "G",
	"DE": "H",
	"DC": "y",
	"FL": "I",
	"GA": "J",
	"HI": "K",
	"ID": "M",
	"IL": "N",
	"IN": "O",
	"IA": "L",
	"KS": "P",
	"KY": "Q",
	"LA": "R",
	"ME": "U",
	"MD": "T",
	"MA": "S",
	"MI": "V",
	"MN": "W",
	"MS": "Y",
	"MO": "X",
	"MT": "Z",
	"NE": "c",
	"NV": "g",
	"NH": "d",
	"NJ": "e",
	"NM": "f",
	"NY": "h",
	"NC": "a",
	"ND": "b",
	"OH": "i",
	"OK": "j",
	"OR": "k",
	"PA": "l",
	"RI": "m",
	"SC": "n",
	"SD": "o",
	"TN": "p",
	"TX": "q",
	"UT": "r",
	"VT": "t",
	"VA": "s",
	"WA": "u",
	"WV": "w",
	"WI": "v",
	"WY": "x",
	"US": "z"
    };

    if (!stateface_codes.hasOwnProperty(abbr_upper)){
	throw "TRENDCT.Stateface: State not found " + abbr_upper + ".";
    }
    return stateface_codes[abbr.toUpperCase()];
}

// Replace all .stateface-replace elements with data-state-abbr set
TRENDCT.stateface.prototype.update = function (){
    var that = this;
    d3.select(this.selector)
	.selectAll(".stateface-replace[data-state-abbr]")
	.each(function(){
	    var st_abbr = d3.select(this).attr("data-state-abbr");
	    var st_code = that.code(st_abbr);
	    d3.select(this)
		.text(st_code)
    });
}



d3.select(this).on("load.trendct_stateface", function(){
    (new TRENDCT.stateface()).update();
});

