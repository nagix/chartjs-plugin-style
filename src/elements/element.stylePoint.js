'use strict';

export default function(Chart) {

	return Chart.elements.Point.extend({

		draw: function(chartArea) {
			var me = this;
			var vm = me._view;
			var model = me._model;
			var ctx = me._chart.ctx;
			var pointStyle = vm.pointStyle;
			var errMargin = 1.01; // 1.01 is margin for Accumulated error. (Especially Edge, IE.)

			Chart.elements.Point.prototype.draw.apply(me, arguments);

			if (vm.skip) {
				return;
			}

			// Clipping for Points.
			if (chartArea === undefined || (model.x >= chartArea.left && chartArea.right * errMargin >= model.x && model.y >= chartArea.top && chartArea.bottom * errMargin >= model.y)) {
				ctx.save();

				ctx.shadowOffsetX = vm.shadowOffsetX;
				ctx.shadowOffsetY = vm.shadowOffsetY;
				ctx.shadowBlur = vm.shadowBlur;
				ctx.shadowColor = vm.shadowColor;

				// Shadow has to be drawn in background
				ctx.globalCompositeOperation = 'destination-over';

				switch (pointStyle) {
				default:
					ctx.fill();
					break;
				case 'cross': case 'crossRot': case 'star': case 'line': case 'dash':
					break;
				}

				ctx.stroke();

				ctx.restore();
			}
		}
	});
}
