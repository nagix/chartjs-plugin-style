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
		};

		helpers.merge(rectangle._model, styleHelpers.resolveStyle(chart, rectangle, index, rectangleOptions));

		me.updateElementGeometry(rectangle, index, reset);

		rectangle.pivot();
	},

	setHoverStyle: function(element) {
		var me = this;
		var model = element._model;

		BarController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		helpers.merge(model, styleHelpers.resolveStyle(me.chart, element, element._index, model, true));
	},

	removeHoverStyle: function(element) {
		var me = this;

		if (!element.$previousStyle) {
			helpers.merge(element._model, styleHelpers.resolveStyle(me.chart, element, element._index, me.chart.options.elements.rectangle));
		}

		BarController.prototype.removeHoverStyle.apply(me, arguments);
	}
});
