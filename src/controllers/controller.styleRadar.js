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
		var line = me.getMeta().dataset;
		var options = styleHelpers.resolveLineStyle(me, line, me.chart.options.elements.line);
		var model = {};

		Object.defineProperty(line, '_model', {
			configurable: true,
			get: function() {
				return model;
			},
			set: function(value) {
				extend(model, value, options);
			}
		});

		RadarController.prototype.update.apply(me, arguments);

		delete line._model;
		line._model = model;
		line._styleOptions = options;
	},

	updateElement: function(point, index) {
		var me = this;
		var options = styleHelpers.resolvePointStyle(me, point, index, me.chart.options.elements.point);

		RadarController.prototype.updateElement.apply(me, arguments);

		extend(point._model, options);
		point._styleOptions = options;
	},

	setHoverStyle: function(element) {
		// Point
		var me = this;

		RadarController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		styleHelpers.setHoverStyle(element._model, element._styleOptions);
	},

	removeHoverStyle: function(element) {
		var me = this;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			styleHelpers.mergeStyle(element._model, element._styleOptions);
		}

		RadarController.prototype.removeHoverStyle.apply(me, arguments);
	}
});
