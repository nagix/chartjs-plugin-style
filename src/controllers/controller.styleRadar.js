'use strict';

import Chart from 'chart.js';
import StyleLine from '../elements/element.styleLine';
import StylePoint from '../elements/element.stylePoint';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var extend = helpers.extend;

var RadarController = Chart.controllers.radar;

export default RadarController.extend({

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
				extend(model, value, styleHelpers.resolveLineStyle(chart, line, chart.options.elements.line));
			}
		});

		RadarController.prototype.update.apply(me, arguments);

		delete line._model;
		line._model = model;
	},

	updateElement: function(point, index) {
		var me = this;

		RadarController.prototype.updateElement.apply(me, arguments);

		extend(point._model, styleHelpers.resolvePointStyle(me.chart, point, index, me.chart.options.elements.point));
	},

	setHoverStyle: function(element) {
		// Point
		var me = this;
		var model = element._model;

		RadarController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		extend(model, styleHelpers.resolvePointStyle(me.chart, element, element._index, model, true));
	},

	removeHoverStyle: function(element) {
		var me = this;
		var chart = me.chart;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			extend(element._model, styleHelpers.resolvePointStyle(chart, element, element._index, chart.options.elements.point));
		}

		RadarController.prototype.removeHoverStyle.apply(me, arguments);
	}
});
