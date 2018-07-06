'use strict';

export default function(Chart) {

	return Chart.elements.Arc.extend({

		draw: function() {
			var me = this;
			var ctx = me._chart.ctx;
			var vm = me._view;

			Chart.elements.Arc.prototype.draw.apply(me, arguments);

			ctx.save();

			ctx.shadowOffsetX = vm.shadowOffsetX;
			ctx.shadowOffsetY = vm.shadowOffsetY;
			ctx.shadowBlur = vm.shadowBlur;
			ctx.shadowColor = vm.shadowColor;

			// Shadow has to be drawn in background
			ctx.globalCompositeOperation = 'destination-over';

			ctx.fill();

			if (vm.borderWidth) {
				ctx.stroke();
			}

			ctx.restore();
		}
	});
}
