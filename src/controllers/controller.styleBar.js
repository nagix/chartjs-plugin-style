'use strict';

import Chart from 'chart.js';
import StyleRectangle from '../elements/element.styleRectangle';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var extend = helpers.extend;

var BarController = Chart.controllers.bar;

export default BarController.extend({

	dataElementType: StyleRectangle,

	updateElement: function(rectangle, index) {
		var me = this;
		var options = styleHelpers.resolveStyle(me, rectangle, index, me.chart.options.elements.rectangle);
		var model = {};

		Object.defineProperty(rectangle, '_model', {
			configurable: true,
			get: function() {
				return model;
			},
			set: function(value) {
				extend(model, value, options);
			}
		});

		BarController.prototype.updateElement.apply(me, arguments);

		delete rectangle._model;
		rectangle._model = model;
		rectangle._styleOptions = options;
	},

	setHoverStyle: function(element) {
		var me = this;

		BarController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		styleHelpers.setHoverStyle(element._model, element._styleOptions);
	},

	removeHoverStyle: function(element) {
		var me = this;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			styleHelpers.mergeStyle(element._model, element._styleOptions);
		}

		BarController.prototype.removeHoverStyle.apply(me, arguments);
	}
});
