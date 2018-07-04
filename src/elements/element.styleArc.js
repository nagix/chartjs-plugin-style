'use strict';

export default function(Chart) {

	return Chart.elements.Arc.extend({

		draw: function() {
			var me = this;
			var vm = me._view;
			var ctx = me._chart.ctx;

			ctx.save();

			ctx.shadowOffsetX = vm.shadowOffsetX;
			ctx.shadowOffsetY = vm.shadowOffsetY;
			ctx.shadowBlur = vm.shadowBlur;
			ctx.shadowColor = vm.shadowColor;

			Chart.elements.Arc.prototype.draw.apply(me, arguments);

			ctx.restore();
		}
	});
}
