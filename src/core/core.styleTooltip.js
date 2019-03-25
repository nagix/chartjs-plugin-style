'use strict';

import Chart from 'chart.js';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

/**
 * Ported from Chart.js 2.7.3.
 *
 * Helper method to merge the opacity into a color
 * For Chart.js 2.7.3 backward compatibility
 */
function mergeOpacity(colorString, opacity) {
	// opacity is not used in Chart.js 2.8 or later
	if (opacity === undefined) {
		return colorString;
	}
	var color = helpers.color(colorString);
	return color.alpha(opacity * color.alpha()).rgbaString();
}

var Tooltip = Chart.Tooltip;

export default Tooltip.extend({

	initialize: function() {
		var me = this;

		Tooltip.prototype.initialize.apply(me, arguments);

		styleHelpers.mergeStyle(me._model, me._options);
	},

	update: function() {
		var me = this;

		Tooltip.prototype.update.apply(me, arguments);

		styleHelpers.mergeStyle(me._model, me._options);

		return me;
	},

	drawBackground: function(pt, vm, ctx, tooltipSize, opacity) {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var options = helpers.extend({}, vm, {
			bevelHighlightColor: mergeOpacity(vm.bevelHighlightColor, opacity),
			bevelShadowColor: mergeOpacity(vm.bevelShadowColor, opacity),
			innerGlowColor: mergeOpacity(vm.innerGlowColor, opacity),
			outerGlowColor: mergeOpacity(vm.outerGlowColor, opacity)
		});

		var drawCallback = function() {
			Tooltip.prototype.drawBackground.apply(me, args);
		};

		styleHelpers.drawShadow(chart, vm, drawCallback);

		if (styleHelpers.opaque(vm.backgroundColor)) {
			styleHelpers.drawBackground(vm, drawCallback);
			styleHelpers.drawBevel(chart, options, drawCallback);
		}

		styleHelpers.drawInnerGlow(chart, options, drawCallback);
		styleHelpers.drawOuterGlow(chart, options, drawCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	}
});
