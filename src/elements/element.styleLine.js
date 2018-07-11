'use strict';

export default function(Chart) {

	var styleHelpers = Chart.helpers.style;

	return Chart.elements.Line.extend({

		draw: function() {
			var me = this;
			var args = arguments;
			var vm = me._view;

			styleHelpers.drawShadow(me._chart, vm.shadowOffsetX, vm.shadowOffsetY,
				vm.shadowBlur, vm.shadowColor, function() {
					Chart.elements.Line.prototype.draw.apply(me, args);
				});
		}
	});
}
