'use strict';

import Chart from 'chart.js';
import StyleRectangle from '../elements/element.styleRectangle';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var BarController = Chart.controllers.bar;

export default BarController.extend({

	dataElementType: StyleRectangle,

	updateElement: function(rectangle, index) {
		var me = this;
		var chart = me.chart;
		var model = {};

		Object.defineProperty(rectangle, '_model', {
			configurable: true,
			get: function() {
				return model;
			},
			set: function(value) {
				helpers.merge(model, [value, styleHelpers.resolveStyle(chart, rectangle, index, chart.options.elements.rectangle)]);
			}
		});

		BarController.prototype.updateElement.apply(me, arguments);

		delete rectangle._model;
		rectangle._model = model;
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
		var chart = me.chart;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			helpers.merge(element._model, styleHelpers.resolveStyle(chart, element, element._index, chart.options.elements.rectangle));
		}

		BarController.prototype.removeHoverStyle.apply(me, arguments);
	}
});
