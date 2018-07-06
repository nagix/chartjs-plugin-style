'use strict';

export default function(Chart) {

	var helpers = Chart.helpers;

	var Tooltip = Chart.Tooltip;

	/**
	 * Ported from Chart.js 2.7.2.
	 *
	 * Helper method to merge the opacity into a color
	 */
	function mergeOpacity(colorString, opacity) {
		var color = helpers.color(colorString);
		return color.alpha(opacity * color.alpha()).rgbaString();
	}

	return Chart.Tooltip.extend({

		initialize: function() {
			Tooltip.prototype.initialize.apply(this, arguments);

			var model = this._model;
			var tooltipOpts = this._options;

			model.shadowOffsetX = tooltipOpts.shadowOffsetX;
			model.shadowOffsetY = tooltipOpts.shadowOffsetY;
			model.shadowBlur = tooltipOpts.shadowBlur;
			model.shadowColor = tooltipOpts.shadowColor;
		},

		update: function() {
			Tooltip.prototype.update.apply(this, arguments);

			var me = this;
			var model = me._model;
			var opts = me._options;

			model.shadowOffsetX = opts.shadowOffsetX;
			model.shadowOffsetY = opts.shadowOffsetY;
			model.shadowBlur = opts.shadowBlur;
			model.shadowColor = opts.shadowColor;

			return me;
		},

		drawBackground: function(pt, vm, ctx, tooltipSize, opacity) {
			ctx.save();

			ctx.shadowOffsetX = vm.shadowOffsetX;
			ctx.shadowOffsetY = vm.shadowOffsetY;
			ctx.shadowBlur = vm.shadowBlur;
			ctx.shadowColor = mergeOpacity(vm.shadowColor, opacity);

			Tooltip.prototype.drawBackground.apply(this, arguments);

			ctx.restore();
		}
	});
}
