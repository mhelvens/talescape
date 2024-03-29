//errormessages for en are already included in webshims core, this is only for information (by default en is equal to jQuery.webshims.validityMessages[""]):

webshims.validityMessages.en = {
	"typeMismatch"   : {
		"defaultMessage": "Please enter a valid value.",
		"email"         : "Please enter an email address.",
		"url"           : "Please enter a URL."
	},
	"badInput"       : {
		"defaultMessage": "Please enter a valid value.",
		"number"        : "Please enter a number.",
		"date"          : "Please enter a date.",
		"time"          : "Please enter a time.",
		"range"         : "Invalid input.",
		"month"         : "Please enter a valid value.",
		"datetime-local": "Please enter a datetime."
	},
	"rangeUnderflow" : {
		"defaultMessage": "Value must be greater than or equal to {%min}.",
		"date"          : "Value must be at or after {%min}.",
		"time"          : "Value must be at or after {%min}.",
		"datetime-local": "Value must be at or after {%min}.",
		"month"         : "Value must be at or after {%min}."
	},
	"rangeOverflow"  : {
		"defaultMessage": "Value must be less than or equal to {%max}.",
		"date"          : "Value must be at or before {%max}.",
		"time"          : "Value must be at or before {%max}.",
		"datetime-local": "Value must be at or before {%max}.",
		"month"         : "Value must be at or before {%max}."
	},
	"stepMismatch"   : "Invalid input.",
	"tooLong"        : "Please enter at most {%maxlength} character(s). You entered {%valueLen}.",
	"tooShort"       : "Please enter at least {%minlength} character(s). You entered {%valueLen}.",
	"patternMismatch": "Invalid input. {%title}",
	"valueMissing"   : {
		"defaultMessage": "Please fill out this field.",
		"checkbox"      : "Please check this box if you want to proceed.",
		"select"        : "Please select an option.",
		"radio"         : "Please select an option."
	}
};
webshims.formcfg.en = {
	"numberFormat": {
		".": ".",
		",": ","
	},
	"numberSigns" : ".",
	"dateSigns"   : "/",
	"timeSigns"   : ":. ",
	"dFormat"     : "/",
	"patterns"    : {
		"d": "mm/dd/yy"
	},
	"meridian"    : [
		"AM",
		"PM"
	],
	"month"       : {
		"currentText": "This month"
	},
	"time"        : {
		"currentText": "Now"
	},
	"date"        : {
		"closeText"         : "Done",
		"clear"             : "Clear",
		"prevText"          : "Prev",
		"nextText"          : "Next",
		"currentText"       : "Today",
		"monthNames"        : [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		],
		"monthNamesShort"   : [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		],
		"dayNames"          : [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		],
		"dayNamesShort"     : [
			"Sun",
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat"
		],
		"dayNamesMin"       : [
			"Su",
			"Mo",
			"Tu",
			"We",
			"Th",
			"Fr",
			"Sa"
		],
		"weekHeader"        : "Wk",
		"firstDay"          : 0,
		"isRTL"             : false,
		"showMonthAfterYear": false,
		"yearSuffix"        : ""
	}
};
