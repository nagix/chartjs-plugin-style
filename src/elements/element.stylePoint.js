'use strict';

import Chart from 'chart.js';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

// For Chart.js 2.7.3 backward compatibility
var isPointInArea = helpers.canvas._isPointInArea || function(point, area) {
	var epsilon = 1e-6;

	return point.x > area.left - epsilon && point.x < area.right + epsilon &&
		point.y > area.top - epsilon && point.y < area.bottom + epsilon;
};

var Point = Chart.elements.Point;

export default Point.extend({

	draw: function(chartArea) {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var vm = me._view;

		var drawCallback = function() {
			Point.prototype.draw.apply(me, args);
		};

		if (vm.skip || chartArea !== undefined && !isPointInArea(vm, chartArea)) {
			return;
		}

		styleHelpers.drawShadow(chart, vm, drawCallback, true);

		if (styleHelpers.opaque(vm.backgroundColor)) {
			styleHelpers.drawBackground(vm, drawCallback);
			styleHelpers.drawBackgroundOverlay(chart, vm, drawCallback);
			styleHelpers.drawBevel(chart, vm, drawCallback);
		}

		styleHelpers.drawInnerGlow(chart, vm, drawCallback);
		styleHelpers.drawOuterGlow(chart, vm, drawCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	}
});
