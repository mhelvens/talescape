'use strict';

define(['jquery'], function ($) {
	console.log("Removing global jQuery variables...");
	return $.noConflict(true);
});
