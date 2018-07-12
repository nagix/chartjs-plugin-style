'use strict';

export default function(Chart) {

	var helpers = Chart.helpers;
	var styleHelpers = helpers.style;

	return Chart.elements.Point.extend({

		draw: function() {
			var me = this;
			var args = arguments;
			var chart = me._chart;
			var vm = me._view;
			var borderAlpha = helpers.color(vm.borderColor).alpha();
			var backgroundAlpha = helpers.color(vm.backgroundColor).alpha();
			var bevelExtra = borderAlpha > 0 && vm.borderWidth > 0 ? vm.borderWidth / 2 : 0;

			var drawCallback = function() {
				Chart.elements.Point.prototype.draw.apply(me, args);
			};

			styleHelpers.drawShadow(chart, vm.shadowOffsetX, vm.shadowOffsetY,
				vm.shadowBlur, vm.shadowColor, drawCallback, true);

			if (backgroundAlpha > 0) {
				styleHelpers.drawBackground(vm, drawCallback);
				styleHelpers.drawBevel(chart, vm.bevelWidth + bevelExtra,
					vm.bevelHighlightColor, vm.bevelShadowColor, drawCallback);
			}

			styleHelpers.drawInnerGlow(chart, vm.innerGlowWidth, vm.innerGlowColor,
				vm.borderWidth, drawCallback);
			styleHelpers.drawOuterGlow(chart, vm.outerGlowWidth, vm.outerGlowColor,
				vm.borderWidth, drawCallback);

			styleHelpers.drawBorder(vm, drawCallback);
		}
	});
}
