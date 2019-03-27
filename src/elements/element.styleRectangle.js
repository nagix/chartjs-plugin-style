'use strict';

import Chart from 'chart.js';
import styleHelpers from '../helpers/helpers.style';

var Rectangle = Chart.elements.Rectangle;

export default Rectangle.extend({

	draw: function() {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var vm = me._view;

		var drawCallback = function() {
			Rectangle.prototype.draw.apply(me, args);
		};
		var setPathCallback = function() {
			me.setPath();
		};

		styleHelpers.drawShadow(chart, vm, drawCallback, true);

		if (styleHelpers.opaque(vm.backgroundColor)) {
			styleHelpers.drawBackground(vm, drawCallback);
			styleHelpers.drawBackgroundOverlay(chart, vm, setPathCallback);
			styleHelpers.drawBevel(chart, vm, setPathCallback);
		}

		styleHelpers.drawInnerGlow(chart, vm, setPathCallback);
		styleHelpers.drawOuterGlow(chart, vm, setPathCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	},

	setPath: function() {
		var me = this;
		var ctx = me._chart.ctx;
		var vm = me._view;
		var x, y, width, height;

		if (vm.width !== undefined) {
			x = vm.x - vm.width / 2;
			width = vm.width;
			y = Math.min(vm.y, vm.base);
			height = Math.abs(vm.y - vm.base);
		} else {
			x = Math.min(vm.x, vm.base);
			width = Math.abs(vm.x - vm.base);
			y = vm.y - vm.height / 2;
			height = vm.height;
		}

		ctx.rect(x, y, width, height);
	}
});
