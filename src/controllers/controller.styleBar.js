'use strict';

import Chart from '../core/core.js';
import StyleRectangle from '../elements/element.styleRectangle';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;

var BarController = Chart.controllers.bar;

export default BarController.extend({

	dataElementType: StyleRectangle,

	// Ported from Chart.js 2.7.3. Modified for style bar.
	updateElement: function(rectangle, index, reset) {
		var me = this;
		var chart = me.chart;
		var meta = me.getMeta();
		var dataset = me.getDataset();
		var custom = rectangle.custom || {};
		var rectangleOptions = chart.options.elements.rectangle;

		rectangle._xScale = me.getScaleForId(meta.xAxisID);
		rectangle._yScale = me.getScaleForId(meta.yAxisID);
		rectangle._datasetIndex = me.index;
		rectangle._index = index;

		rectangle._model = {
			datasetLabel: dataset.label,
			label: chart.data.labels[index],
			borderSkipped: custom.borderSkipped ? custom.borderSkipped : rectangleOptions.borderSkipped,
			backgroundColor: custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(dataset.backgroundColor, index, rectangleOptions.backgroundColor),
			borderColor: custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(dataset.borderColor, index, rectangleOptions.borderColor),
			borderWidth: custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(dataset.borderWidth, index, rectangleOptions.borderWidth),

			shadowOffsetX: custom.shadowOffsetX ? custom.shadowOffsetX : valueAtIndexOrDefault(dataset.shadowOffsetX, index, rectangleOptions.shadowOffsetX),
			shadowOffsetY: custom.shadowOffsetY ? custom.shadowOffsetY : valueAtIndexOrDefault(dataset.shadowOffsetY, index, rectangleOptions.shadowOffsetY),
			shadowBlur: custom.shadowBlur ? custom.shadowBlur : valueAtIndexOrDefault(dataset.shadowBlur, index, rectangleOptions.shadowBlur),
			shadowColor: custom.shadowColor ? custom.shadowColor : valueAtIndexOrDefault(dataset.shadowColor, index, rectangleOptions.shadowColor),
			bevelWidth: custom.bevelWidth ? custom.bevelWidth : valueAtIndexOrDefault(dataset.bevelWidth, index, rectangleOptions.bevelWidth),
			bevelHighlightColor: custom.bevelHighlightColor ? custom.bevelHighlightColor : valueAtIndexOrDefault(dataset.bevelHighlightColor, index, rectangleOptions.bevelHighlightColor),
			bevelShadowColor: custom.bevelShadowColor ? custom.bevelShadowColor : valueAtIndexOrDefault(dataset.bevelShadowColor, index, rectangleOptions.bevelShadowColor),
			innerGlowWidth: custom.innerGlowWidth ? custom.innerGlowWidth : valueAtIndexOrDefault(dataset.innerGlowWidth, index, rectangleOptions.innerGlowWidth),
			innerGlowColor: custom.innerGlowColor ? custom.innerGlowColor : valueAtIndexOrDefault(dataset.innerGlowColor, index, rectangleOptions.innerGlowColor),
			outerGlowWidth: custom.outerGlowWidth ? custom.outerGlowWidth : valueAtIndexOrDefault(dataset.outerGlowWidth, index, rectangleOptions.outerGlowWidth),
			outerGlowColor: custom.outerGlowColor ? custom.outerGlowColor : valueAtIndexOrDefault(dataset.outerGlowColor, index, rectangleOptions.outerGlowColor)
		};

		me.updateElementGeometry(rectangle, index, reset);

		rectangle.pivot();
	},

	setHoverStyle: function(element) {
		BarController.prototype.setHoverStyle.apply(this, arguments);
		styleHelpers.setHoverStyle(this.chart, element);
	},

	removeHoverStyle: function(element) {
		styleHelpers.removeHoverStyle(this.chart, element, 'rectangle');
		BarController.prototype.removeHoverStyle.apply(this, arguments);
	}
});
