'use strict';

import Chart from 'chart.js';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var Arc = Chart.elements.Arc;

export default Arc.extend({

	draw: function() {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var vm = me._view;

		var drawCallback = function() {
			Arc.prototype.draw.apply(me, args);
		};

		styleHelpers.drawShadow(chart, vm, drawCallback, true);

		if (styleHelpers.opaque(vm.backgroundColor)) {
			styleHelpers.drawBackground(vm, drawCallback);
			styleHelpers.drawBackgroundOverlay(chart, vm, drawCallback);
			styleHelpers.drawBevel(chart, vm.borderAlign === 'inner' ? helpers.extend({}, vm, {
				borderWidth: vm.borderWidth * 2
			}) : vm, drawCallback);
		}

		styleHelpers.drawInnerGlow(chart, vm, drawCallback);
		styleHelpers.drawOuterGlow(chart, vm, drawCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	}
});
