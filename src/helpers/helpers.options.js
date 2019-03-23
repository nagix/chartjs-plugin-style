'use strict';

import Chart from 'chart.js';

var helpers = Chart.helpers;
var optionsHelpers = helpers.options || {};

export default helpers.extend(optionsHelpers, {

	// For Chart.js 2.6.0 backward compatibility
	resolve: optionsHelpers.resolve || function(inputs, context, index) {
		var i, ilen, value;

		for (i = 0, ilen = inputs.length; i < ilen; ++i) {
			value = inputs[i];
			if (value === undefined) {
				continue;
			}
			if (context !== undefined && typeof value === 'function') {
				value = value(context);
			}
			if (index !== undefined && helpers.isArray(value)) {
				value = value[index];
			}
			if (value !== undefined) {
				return value;
			}
		}
	}
});
