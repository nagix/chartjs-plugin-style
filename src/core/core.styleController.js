'use strict';

export default function(Chart) {

	var helpers = Chart.helpers;

	helpers.extend(Chart.prototype, {

		// Ported from Chart.js 2.7.3. Modified for style tooltip.
		initToolTip: function() {
			var me = this;
			me.tooltip = new Chart.StyleTooltip({
				_chart: me,
				_chartInstance: me, // deprecated, backward compatibility
				_data: me.data,
				_options: me.options.tooltips
			}, me);
		}
	});
}
