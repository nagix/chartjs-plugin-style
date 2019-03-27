'use strict';

import Chart from 'chart.js';
import StyleRectangle from '../elements/element.styleRectangle';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var extend = helpers.extend;

// Ported from Chart.js 2.8.0
function swap(orig, v1, v2) {
	return orig === v1 ? v2 : orig === v2 ? v1 : orig;
}

// Ported from Chart.js 2.8.0
function parseBorderSkipped(vm) {
	var edge = vm.borderSkipped;
	var res = {};

	if (!edge) {
		return res;
	}

	if (vm.horizontal) {
		if (vm.base > vm.x) {
			edge = swap(edge, 'left', 'right');
		}
	} else if (vm.base < vm.y) {
		edge = swap(edge, 'bottom', 'top');
	}

	res[edge] = true;
	return res;
}

// Ported from Chart.js 2.8.0. Modified for style bar.
function parseBorderWidth(vm) {
	var value = vm.borderWidth;
	var skip = parseBorderSkipped(vm);
	var maxW, maxH, t, r, b, l;

	if (vm.width !== undefined) {
		maxW = vm.width / 2;
		maxH = Math.abs(vm.y - vm.base) / 2;
	} else {
		maxW = Math.abs(vm.x - vm.base) / 2;
		maxH = vm.height / 2;
	}

	if (value !== null && Object.prototype.toString.call(value) === '[object Object]') {
		t = +value.top || 0;
		r = +value.right || 0;
		b = +value.bottom || 0;
		l = +value.left || 0;
	} else {
		t = r = b = l = +value || 0;
	}

	return {
		top: skip.top || (t < 0) ? 0 : t > maxH ? maxH : t,
		right: skip.right || (r < 0) ? 0 : r > maxW ? maxW : r,
		bottom: skip.bottom || (b < 0) ? 0 : b > maxH ? maxH : b,
		left: skip.left || (l < 0) ? 0 : l > maxW ? maxW : l
	};
}

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
		rectangle._model = extend(model, {
			parsedBorderWidth: parseBorderWidth(model)
		});
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
