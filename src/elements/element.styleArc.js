'use strict';

export default function(Chart) {

	return Chart.elements.Arc.extend({

		// Ported from Chart.js 2.7.2. Modified for style tooltip.
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;
			var sA = vm.startAngle;
			var eA = vm.endAngle;

			ctx.beginPath();

			ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
			ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);

			ctx.closePath();
			ctx.strokeStyle = vm.borderColor;
			ctx.lineWidth = vm.borderWidth;

			ctx.fillStyle = vm.backgroundColor;

			ctx.save();

			ctx.shadowOffsetX = vm.shadowOffsetX;
			ctx.shadowOffsetY = vm.shadowOffsetY;
			ctx.shadowBlur = vm.shadowBlur;
			ctx.shadowColor = vm.shadowColor;

			ctx.fill();

			ctx.restore();

			ctx.lineJoin = 'bevel';

			if (vm.borderWidth) {
				ctx.stroke();
			}
		}

	});
}
