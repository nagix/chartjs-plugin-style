'use strict';

import Chart from 'chart.js';
import StylePoint from '../elements/element.stylePoint';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var extend = helpers.extend;

var BubbleController = Chart.controllers.bubble;

export default BubbleController.extend({

	dataElementType: StylePoint,

	updateElement: function(point, index) {
		var me = this;
		var options = styleHelpers.resolveStyle(me, point, index, me.chart.options.elements.point);
		var model = {};

		Object.defineProperty(point, '_model', {
			configurable: true,
			get: function() {
				return model;
			},
			set: function(value) {
				extend(model, value, options);
			}
		});

		BubbleController.prototype.updateElement.apply(me, arguments);

		delete point._model;
		point._model = model;
		point._styleOptions = options;
	},

	/**
	 * @protected
	 */
	setHoverStyle: function(element) {
		var me = this;

		BubbleController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		styleHelpers.setHoverStyle(element._model, element._styleOptions);
	},

	/**
	 * @protected
	 */
	removeHoverStyle: function(element) {
		var me = this;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			styleHelpers.mergeStyle(element._model, element._styleOptions);
		}

		BubbleController.prototype.removeHoverStyle.apply(me, arguments);
	}
});
