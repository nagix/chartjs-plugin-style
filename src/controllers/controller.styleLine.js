'use strict';

import Chart from '../core/core.js';
import StyleLine from '../elements/element.styleLine';
import StylePoint from '../elements/element.stylePoint';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var LineController = Chart.controllers.line;

export default LineController.extend({

	datasetElementType: StyleLine,

	dataElementType: StylePoint,

	update: function() {
		var me = this;
		var chart = me.chart;
		var line = me.getMeta().dataset;
		var model = {};

		Object.defineProperty(line, '_model', {
			configurable: true,
			get: function() {
				return model;
			},
			set: function(value) {
				helpers.merge(model, [value, styleHelpers.resolveLineStyle(chart, line, chart.options.elements.line)]);
			}
		});

		LineController.prototype.update.apply(me, arguments);

		delete line._model;
		line._model = model;
	},

	updateElement: function(point, index) {
		var me = this;

		LineController.prototype.updateElement.apply(me, arguments);

		helpers.merge(point._model, styleHelpers.resolvePointStyle(me.chart, point, index, me.chart.options.elements.point));
	},

	setHoverStyle: function(element) {
		// Point
		var me = this;
		var model = element._model;

		LineController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		helpers.merge(model, styleHelpers.resolvePointStyle(me.chart, element, element._index, model, true));
	},

	removeHoverStyle: function(element) {
		var me = this;
		var chart = me.chart;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			helpers.merge(element._model, styleHelpers.resolvePointStyle(chart, element, element._index, chart.options.elements.point));
		}

		LineController.prototype.removeHoverStyle.apply(me, arguments);
	}
});
