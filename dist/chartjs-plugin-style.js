/*!
 * chartjs-plugin-style v0.5.0
 * https://nagix.github.io/chartjs-plugin-style
 * (c) 2019 Akihiko Kusanagi
 * Released under the MIT license
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('chart.js')) :
typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
(global = global || self, global.ChartStyle = factory(global.Chart));
}(this, function (Chart) { 'use strict';

Chart = Chart && Chart.hasOwnProperty('default') ? Chart['default'] : Chart;

var helpers = Chart.helpers;
var optionsHelpers = helpers.options || {};

var optionsHelpers$1 = helpers.extend(optionsHelpers, {

	// For Chart.js 2.6.0 backward compatibility
	resolve: optionsHelpers.resolve || function(inputs, context, index) {
		var i, ilen, value;

		for (i = 0, ilen = inputs.length; i < ilen; ++i) {
			value = inputs[i];
			if (value === undefined) {
				continue;
			}
			if (context !== undefined && typeof value === 'function') {
				value = value(context);
			}
			if (index !== undefined && helpers.isArray(value)) {
				value = value[index];
			}
			if (value !== undefined) {
				return value;
			}
		}
	}
});

var helpers$1 = Chart.helpers;

var resolve = optionsHelpers$1.resolve;

var OFFSET = 1000000;

function isColorOption(key) {
	return key.indexOf('Color') !== -1;
}

var styleHelpers = {

	styleKeys: [
		'shadowOffsetX',
		'shadowOffsetY',
		'shadowBlur',
		'shadowColor',
		'bevelWidth',
		'bevelHighlightColor',
		'bevelShadowColor',
		'innerGlowWidth',
		'innerGlowColor',
		'outerGlowWidth',
		'outerGlowColor',
		'backgroundOverlayColor',
		'backgroundOverlayMode'
	],

	lineStyleKeys: [
		'shadowOffsetX',
		'shadowOffsetY',
		'shadowBlur',
		'shadowColor',
		'outerGlowWidth',
		'outerGlowColor'
	],

	pointStyleKeys: [
		'pointShadowOffsetX',
		'pointShadowOffsetY',
		'pointShadowBlur',
		'pointShadowColor',
		'pointBevelWidth',
		'pointBevelHighlightColor',
		'pointBevelShadowColor',
		'pointInnerGlowWidth',
		'pointInnerGlowColor',
		'pointOuterGlowWidth',
		'pointOuterGlowColor',
		'pointBackgroundOverlayColor',
		'pointBackgroundOverlayMode'
	],

	hoverStyleKeys: [
		'hoverShadowOffsetX',
		'hoverShadowOffsetY',
		'hoverShadowBlur',
		'hoverShadowColor',
		'hoverBevelWidth',
		'hoverBevelHighlightColor',
		'hoverBevelShadowColor',
		'hoverInnerGlowWidth',
		'hoverInnerGlowColor',
		'hoverOuterGlowWidth',
		'hoverOuterGlowColor',
		'hoverBackgroundOverlayColor',
		'hoverBackgroundOverlayMode'
	],

	pointHoverStyleKeys: [
		'pointHoverShadowOffsetX',
		'pointHoverShadowOffsetY',
		'pointHoverShadowBlur',
		'pointHoverShadowColor',
		'pointHoverBevelWidth',
		'pointHoverBevelHighlightColor',
		'pointHoverBevelShadowColor',
		'pointHoverInnerGlowWidth',
		'pointHoverInnerGlowColor',
		'pointHoverOuterGlowWidth',
		'pointHoverOuterGlowColor',
		'pointHoverBackgroundOverlayColor',
		'pointHoverBackgroundOverlayMode'
	],

	drawBackground: function(view, drawCallback) {
		var borderWidth = view.borderWidth;

		view.borderWidth = 0;
		drawCallback();
		view.borderWidth = borderWidth;
	},

	drawBorder: function(view, drawCallback) {
		var backgroundColor = view.backgroundColor;

		if (view.borderWidth) {
			view.backgroundColor = 'rgba(0, 0, 0, 0)';
			drawCallback();
			view.backgroundColor = backgroundColor;
		}
	},

	drawShadow: function(chart, options, drawCallback, backmost) {
		var ctx = chart.ctx;
		var pixelRatio = chart.currentDevicePixelRatio;

		ctx.save();

		ctx.shadowOffsetX = (options.shadowOffsetX + OFFSET) * pixelRatio;
		ctx.shadowOffsetY = options.shadowOffsetY * pixelRatio;
		ctx.shadowBlur = options.shadowBlur * pixelRatio;
		ctx.shadowColor = options.shadowColor;
		if (backmost) {
			ctx.globalCompositeOperation = 'destination-over';
		}
		ctx.translate(-OFFSET, 0);

		drawCallback();

		ctx.restore();
	},

	setPath: function(ctx, drawCallback) {
		ctx.save();
		ctx.beginPath();
		ctx.clip();
		drawCallback();
		ctx.restore();
	},

	drawBevel: function(chart, options, drawCallback) {
		var ctx = chart.ctx;
		var pixelRatio = chart.currentDevicePixelRatio;
		var shadowWidthFactor = pixelRatio * 5 / 6;
		var width = options.bevelWidth * shadowWidthFactor;
		var borderWidth = options.borderWidth;
		var parsedBorderWidth = options.parsedBorderWidth;
		var shadowOffset, offset;

		if (!width) {
			return;
		}

		if (!this.opaque(options.borderColor)) {
			shadowOffset = {top: width, left: width, bottom: width, right: width};
		} else if (parsedBorderWidth) {
			shadowOffset = {
				top: width + parsedBorderWidth.top * pixelRatio,
				left: width + parsedBorderWidth.left * pixelRatio,
				bottom: width + parsedBorderWidth.bottom * pixelRatio,
				right: width + parsedBorderWidth.right * pixelRatio
			};
		} else {
			offset = width + (borderWidth > 0 ? borderWidth : 0) * pixelRatio / 2;
			shadowOffset = {top: offset, left: offset, bottom: offset, right: offset};
		}

		ctx.save();

		this.setPath(ctx, drawCallback);
		ctx.clip();

		// Make stencil
		ctx.translate(-OFFSET, 0);
		this.setPath(ctx, drawCallback);
		ctx.rect(0, 0, chart.width, chart.height);

		// Draw bevel shadow
		ctx.fillStyle = 'black';
		ctx.shadowOffsetX = OFFSET * pixelRatio - shadowOffset.right;
		ctx.shadowOffsetY = -shadowOffset.bottom;
		ctx.shadowBlur = width;
		ctx.shadowColor = options.bevelShadowColor;
		// Workaround for the issue on Windows version of FireFox
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1333090
		// If the destination has transparency, the result will be different
		if (!(navigator && navigator.userAgent.match('Windows.+Firefox'))) {
			ctx.globalCompositeOperation = 'source-atop';
		}
		ctx.fill('evenodd');

		// Draw Bevel highlight
		ctx.shadowOffsetX = OFFSET * pixelRatio + shadowOffset.left;
		ctx.shadowOffsetY = shadowOffset.top;
		ctx.shadowColor = options.bevelHighlightColor;
		ctx.fill('evenodd');

		ctx.restore();
	},

	drawGlow: function(chart, options, drawCallback, isOuter) {
		var ctx = chart.ctx;
		var width = isOuter ? options.outerGlowWidth : options.innerGlowWidth;
		var borderWidth = options.borderWidth;
		var pixelRatio = chart.currentDevicePixelRatio;

		if (!width) {
			return;
		}

		ctx.save();

		// Clip inner or outer area
		this.setPath(ctx, drawCallback);
		if (isOuter) {
			ctx.rect(0, 0, chart.width, chart.height);
		}
		ctx.clip('evenodd');

		// Set path
		ctx.translate(-OFFSET, 0);
		this.setPath(ctx, drawCallback);
		if (!isOuter) {
			ctx.rect(0, 0, chart.width, chart.height);
		}

		// Draw glow
		ctx.lineWidth = borderWidth;
		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'black';
		ctx.shadowOffsetX = OFFSET * pixelRatio;
		ctx.shadowBlur = width * pixelRatio;
		ctx.shadowColor = isOuter ? options.outerGlowColor : options.innerGlowColor;
		ctx.fill('evenodd');
		if (borderWidth) {
			ctx.stroke();
		}

		ctx.restore();
	},

	drawInnerGlow: function(chart, options, drawCallback) {
		this.drawGlow(chart, options, drawCallback);
	},

	drawOuterGlow: function(chart, options, drawCallback) {
		this.drawGlow(chart, options, drawCallback, true);
	},

	drawBackgroundOverlay: function(chart, options, drawCallback) {
		var ctx = chart.ctx;
		var color = options.backgroundOverlayColor;

		if (!color) {
			return;
		}

		ctx.save();
		this.setPath(ctx, drawCallback);
		ctx.fillStyle = color;
		ctx.globalCompositeOperation = options.backgroundOverlayMode;
		ctx.fill();
		ctx.restore();
	},

	opaque: function(color) {
		return helpers$1.color(color).alpha() > 0;
	},

	getHoverColor: function(color) {
		return color !== undefined ? helpers$1.getHoverColor(color) : color;
	},

	mergeStyle: function(target, source) {
		if (target === undefined || source === undefined) {
			return;
		}
		this.styleKeys.forEach(function(key) {
			target[key] = source[key];
		});
		return target;
	},

	setHoverStyle: function(target, source) {
		var keys = this.styleKeys;
		var hoverKeys = this.hoverStyleKeys;
		var i, ilen;

		if (target === undefined || source === undefined) {
			return;
		}
		for (i = 0, ilen = keys.length; i < ilen; ++i) {
			target[keys[i]] = source[hoverKeys[i]];
		}
		return target;
	},

	saveStyle: function(element) {
		var model = element._model;
		var previousStyle = element.$previousStyle;

		if (previousStyle) {
			this.mergeStyle(previousStyle, model);
		}
	},

	resolveStyle: function(controller, element, index, options) {
		var me = this;
		var chart = controller.chart;
		var dataset = chart.data.datasets[controller.index];
		var custom = element.custom || {};
		var keys = me.styleKeys;
		var hoverKeys = me.hoverStyleKeys;
		var values = {};
		var i, ilen, key, value;

		// Scriptable options
		var context = {
			chart: chart,
			dataIndex: index,
			dataset: dataset,
			datasetIndex: element._datasetIndex
		};

		for (i = 0, ilen = keys.length; i < ilen; ++i) {
			key = keys[i];
			values[key] = value = resolve([
				custom[key],
				dataset[key],
				options[key]
			], context, index);

			key = hoverKeys[i];
			values[key] = resolve([
				custom[key],
				dataset[key],
				options[key],
				isColorOption(key) ? me.getHoverColor(value) : value
			], context, index);
		}

		return values;
	},

	resolveLineStyle: function(controller, element, options) {
		var chart = controller.chart;
		var dataset = chart.data.datasets[controller.index];
		var custom = element.custom || {};
		var keys = this.lineStyleKeys;
		var values = {};
		var i, ilen, key;

		// Scriptable options
		var context = {
			chart: chart,
			dataset: dataset,
			datasetIndex: element._datasetIndex
		};

		for (i = 0, ilen = keys.length; i < ilen; ++i) {
			key = keys[i];
			values[key] = resolve([custom[key], dataset[key], options[key]], context);
		}

		return values;
	},

	resolvePointStyle: function(controller, element, index, options) {
		var me = this;
		var chart = controller.chart;
		var dataset = chart.data.datasets[controller.index];
		var custom = element.custom || {};
		var keys = me.styleKeys;
		var hoverKeys = me.hoverStyleKeys;
		var pointKeys = me.pointStyleKeys;
		var pointHoverKeys = me.pointHoverStyleKeys;
		var values = {};
		var i, ilen, key, value;

		// Scriptable options
		var context = {
			chart: chart,
			dataIndex: index,
			dataset: dataset,
			datasetIndex: element._datasetIndex
		};

		for (i = 0, ilen = keys.length; i < ilen; ++i) {
			key = keys[i];
			values[key] = value = resolve([
				custom[key],
				dataset[pointKeys[i]],
				dataset[key],
				options[key]
			], context, index);

			key = hoverKeys[i];
			values[key] = resolve([
				custom[key],
				dataset[pointHoverKeys[i]],
				options[key],
				isColorOption(key) ? me.getHoverColor(value) : value
			], context, index);
		}

		return values;
	}
};

var helpers$2 = Chart.helpers;

/**
 * Ported from Chart.js 2.7.3.
 *
 * Helper method to merge the opacity into a color
 * For Chart.js 2.7.3 backward compatibility
 */
function mergeOpacity(colorString, opacity) {
	// opacity is not used in Chart.js 2.8 or later
	if (opacity === undefined) {
		return colorString;
	}
	var color = helpers$2.color(colorString);
	return color.alpha(opacity * color.alpha()).rgbaString();
}

var Tooltip = Chart.Tooltip;

var StyleTooltip = Tooltip.extend({

	initialize: function() {
		var me = this;

		Tooltip.prototype.initialize.apply(me, arguments);

		styleHelpers.mergeStyle(me._model, me._options);
	},

	update: function() {
		var me = this;

		Tooltip.prototype.update.apply(me, arguments);

		styleHelpers.mergeStyle(me._model, me._options);

		return me;
	},

	drawBackground: function(pt, vm, ctx, tooltipSize, opacity) {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var options = helpers$2.extend({}, vm, {
			bevelHighlightColor: mergeOpacity(vm.bevelHighlightColor, opacity),
			bevelShadowColor: mergeOpacity(vm.bevelShadowColor, opacity),
			innerGlowColor: mergeOpacity(vm.innerGlowColor, opacity),
			outerGlowColor: mergeOpacity(vm.outerGlowColor, opacity)
		});

		var drawCallback = function() {
			Tooltip.prototype.drawBackground.apply(me, args);
		};

		styleHelpers.drawShadow(chart, vm, drawCallback);

		if (styleHelpers.opaque(vm.backgroundColor)) {
			styleHelpers.drawBackground(vm, drawCallback);
			styleHelpers.drawBevel(chart, options, drawCallback);
		}

		styleHelpers.drawInnerGlow(chart, options, drawCallback);
		styleHelpers.drawOuterGlow(chart, options, drawCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	}
});

var Rectangle = Chart.elements.Rectangle;

var StyleRectangle = Rectangle.extend({

	draw: function() {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var vm = me._view;

		var drawCallback = function() {
			Rectangle.prototype.draw.apply(me, args);
		};
		var setPathCallback = function() {
			me.setPath();
		};

		styleHelpers.drawShadow(chart, vm, drawCallback, true);

		if (styleHelpers.opaque(vm.backgroundColor)) {
			styleHelpers.drawBackground(vm, drawCallback);
			styleHelpers.drawBackgroundOverlay(chart, vm, setPathCallback);
			styleHelpers.drawBevel(chart, vm, setPathCallback);
		}

		styleHelpers.drawInnerGlow(chart, vm, setPathCallback);
		styleHelpers.drawOuterGlow(chart, vm, setPathCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	},

	setPath: function() {
		var me = this;
		var ctx = me._chart.ctx;
		var vm = me._view;
		var x, y, width, height;

		if (vm.width !== undefined) {
			x = vm.x - vm.width / 2;
			width = vm.width;
			y = Math.min(vm.y, vm.base);
			height = Math.abs(vm.y - vm.base);
		} else {
			x = Math.min(vm.x, vm.base);
			width = Math.abs(vm.x - vm.base);
			y = vm.y - vm.height / 2;
			height = vm.height;
		}

		ctx.rect(x, y, width, height);
	}
});

var helpers$3 = Chart.helpers;

var extend = helpers$3.extend;

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

var StyleBarController = BarController.extend({

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

var helpers$4 = Chart.helpers;

// For Chart.js 2.7.3 backward compatibility
var isPointInArea = helpers$4.canvas._isPointInArea || function(point, area) {
	var epsilon = 1e-6;

	return point.x > area.left - epsilon && point.x < area.right + epsilon &&
		point.y > area.top - epsilon && point.y < area.bottom + epsilon;
};

var Point = Chart.elements.Point;

var StylePoint = Point.extend({

	draw: function(chartArea) {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var vm = me._view;

		var drawCallback = function() {
			Point.prototype.draw.apply(me, args);
		};

		if (vm.skip || chartArea !== undefined && !isPointInArea(vm, chartArea)) {
			return;
		}

		styleHelpers.drawShadow(chart, vm, drawCallback, true);

		if (styleHelpers.opaque(vm.backgroundColor)) {
			styleHelpers.drawBackground(vm, drawCallback);
			styleHelpers.drawBackgroundOverlay(chart, vm, drawCallback);
			styleHelpers.drawBevel(chart, vm, drawCallback);
		}

		styleHelpers.drawInnerGlow(chart, vm, drawCallback);
		styleHelpers.drawOuterGlow(chart, vm, drawCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	}
});

var helpers$5 = Chart.helpers;

var extend$1 = helpers$5.extend;

var BubbleController = Chart.controllers.bubble;

var StyleBubbleController = BubbleController.extend({

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
				extend$1(model, value, options);
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

var helpers$6 = Chart.helpers;

var Arc = Chart.elements.Arc;

var StyleArc = Arc.extend({

	draw: function() {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var vm = me._view;

		var drawCallback = function() {
			Arc.prototype.draw.apply(me, args);
		};

		styleHelpers.drawShadow(chart, vm, drawCallback, true);

		if (styleHelpers.opaque(vm.backgroundColor)) {
			styleHelpers.drawBackground(vm, drawCallback);
			styleHelpers.drawBackgroundOverlay(chart, vm, drawCallback);
			styleHelpers.drawBevel(chart, vm.borderAlign === 'inner' ? helpers$6.extend({}, vm, {
				borderWidth: vm.borderWidth * 2
			}) : vm, drawCallback);
		}

		styleHelpers.drawInnerGlow(chart, vm, drawCallback);
		styleHelpers.drawOuterGlow(chart, vm, drawCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	}
});

var defaults = Chart.defaults;
var helpers$7 = Chart.helpers;

var extend$2 = helpers$7.extend;
var resolve$1 = optionsHelpers$1.resolve;

// Ported from Chart.js 2.8.0. Modified for style doughnut.
defaults.doughnut.legend.labels.generateLabels = defaults.pie.legend.labels.generateLabels = function(chart) {
	var data = chart.data;
	if (data.labels.length && data.datasets.length) {
		return data.labels.map(function(label, i) {
			var meta = chart.getDatasetMeta(0);
			var ds = data.datasets[0];
			var arc = meta.data[i] || {};
			var custom = arc.custom || {};
			var arcOpts = chart.options.elements.arc;
			var fill = resolve$1([custom.backgroundColor, ds.backgroundColor, arcOpts.backgroundColor], undefined, i);
			var stroke = resolve$1([custom.borderColor, ds.borderColor, arcOpts.borderColor], undefined, i);
			var bw = resolve$1([custom.borderWidth, ds.borderWidth, arcOpts.borderWidth], undefined, i);

			return extend$2({
				text: label,
				fillStyle: fill,
				strokeStyle: stroke,
				lineWidth: bw,
				hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

				// Extra data used for toggling the correct item
				index: i
			}, styleHelpers.resolveStyle(meta.controller, arc, i, arcOpts));
		});
	}
	return [];
};

var DoughnutController = Chart.controllers.doughnut;

var StyleDoughnutController = DoughnutController.extend({

	dataElementType: StyleArc,

	updateElement: function(arc, index) {
		var me = this;
		var options = styleHelpers.resolveStyle(me, arc, index, me.chart.options.elements.arc);
		var model = {};

		Object.defineProperty(arc, '_model', {
			configurable: true,
			get: function() {
				return model;
			},
			set: function(value) {
				extend$2(model, value, options);
			}
		});

		DoughnutController.prototype.updateElement.apply(me, arguments);

		delete arc._model;
		arc._model = model;
		arc._styleOptions = options;
	},

	setHoverStyle: function(element) {
		var me = this;

		DoughnutController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		styleHelpers.setHoverStyle(element._model, element._styleOptions);
	},

	removeHoverStyle: function(element) {
		var me = this;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			styleHelpers.mergeStyle(element._model, element._styleOptions);
		}

		DoughnutController.prototype.removeHoverStyle.apply(me, arguments);
	}
});

var StyleHorizontalBarController = StyleBarController.extend({
	/**
	 * @private
	 */
	_getValueScaleId: function() {
		return this.getMeta().xAxisID;
	},

	/**
	 * @private
	 */
	_getIndexScaleId: function() {
		return this.getMeta().yAxisID;
	},

	/**
	 * For Chart.js 2.7.2 backward compatibility
	 * @private
	 */
	getValueScaleId: function() {
		return this.getMeta().xAxisID;
	},

	/**
	 * For Chart.js 2.7.2 backward compatibility
	 * @private
	 */
	getIndexScaleId: function() {
		return this.getMeta().yAxisID;
	}
});

var Line = Chart.elements.Line;

var StyleLine = Line.extend({

	draw: function() {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var vm = me._view;

		var drawCallback = function() {
			Line.prototype.draw.apply(me, args);
		};

		styleHelpers.drawShadow(chart, vm, drawCallback);

		// For outer glow
		styleHelpers.drawShadow(chart, {
			shadowOffsetX: 0,
			shadowOffsetY: 0,
			shadowBlur: vm.outerGlowWidth,
			shadowColor: vm.outerGlowColor
		}, drawCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	}
});

var helpers$8 = Chart.helpers;

var extend$3 = helpers$8.extend;

var LineController = Chart.controllers.line;

var StyleLineController = LineController.extend({

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
				extend$3(model, value, options);
			}
		});

		LineController.prototype.update.apply(me, arguments);

		delete line._model;
		line._model = model;
		line._styleOptions = options;
	},

	updateElement: function(point, index) {
		var me = this;
		var options = styleHelpers.resolvePointStyle(me, point, index, me.chart.options.elements.point);

		LineController.prototype.updateElement.apply(me, arguments);

		extend$3(point._model, options);
		point._styleOptions = options;
	},

	setHoverStyle: function(element) {
		// Point
		var me = this;

		LineController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		styleHelpers.setHoverStyle(element._model, element._styleOptions);
	},

	removeHoverStyle: function(element) {
		var me = this;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			styleHelpers.mergeStyle(element._model, element._styleOptions);
		}

		LineController.prototype.removeHoverStyle.apply(me, arguments);
	}
});

var helpers$9 = Chart.helpers;

var extend$4 = helpers$9.extend;
var resolve$2 = optionsHelpers$1.resolve;

// Ported from Chart.js 2.8.0. Modified for style polarArea.
Chart.defaults.polarArea.legend.labels.generateLabels = function(chart) {
	var data = chart.data;
	if (data.labels.length && data.datasets.length) {
		return data.labels.map(function(label, i) {
			var meta = chart.getDatasetMeta(0);
			var ds = data.datasets[0];
			var arc = meta.data[i] || {};
			var custom = arc.custom || {};
			var arcOpts = chart.options.elements.arc;
			var fill = resolve$2([custom.backgroundColor, ds.backgroundColor, arcOpts.backgroundColor], undefined, i);
			var stroke = resolve$2([custom.borderColor, ds.borderColor, arcOpts.borderColor], undefined, i);
			var bw = resolve$2([custom.borderWidth, ds.borderWidth, arcOpts.borderWidth], undefined, i);

			return extend$4({
				text: label,
				fillStyle: fill,
				strokeStyle: stroke,
				lineWidth: bw,
				hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

				// Extra data used for toggling the correct item
				index: i
			}, styleHelpers.resolveStyle(meta.controller, arc, i, arcOpts));
		});
	}
	return [];
};

var PolarAreaController = Chart.controllers.polarArea;

var StylePolarAreaController = PolarAreaController.extend({

	dataElementType: StyleArc,

	updateElement: function(arc, index) {
		var me = this;
		var options = styleHelpers.resolveStyle(me, arc, index, me.chart.options.elements.arc);
		var model = {};

		Object.defineProperty(arc, '_model', {
			configurable: true,
			get: function() {
				return model;
			},
			set: function(value) {
				extend$4(model, value, options);
			}
		});

		PolarAreaController.prototype.updateElement.apply(me, arguments);

		delete arc._model;
		arc._model = model;
		arc._styleOptions = options;
	},

	setHoverStyle: function(element) {
		var me = this;

		PolarAreaController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		styleHelpers.setHoverStyle(element._model, element._styleOptions);
	},

	removeHoverStyle: function(element) {
		var me = this;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			styleHelpers.mergeStyle(element._model, element._styleOptions);
		}

		PolarAreaController.prototype.removeHoverStyle.apply(me, arguments);
	}
});

var helpers$a = Chart.helpers;

var extend$5 = helpers$a.extend;

var RadarController = Chart.controllers.radar;

var StyleRadarController = RadarController.extend({

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
				extend$5(model, value, options);
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

		extend$5(point._model, options);
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

var defaults$1 = Chart.defaults;
var helpers$b = Chart.helpers;

// For Chart.js 2.7.1 backward compatibility
var layouts = Chart.layouts || Chart.layoutService;

// For Chart.js 2.6.0 backward compatibility
var valueOrDefault = helpers$b.valueOrDefault || helpers$b.getValueOrDefault;

// For Chart.js 2.6.0 backward compatibility
var valueAtIndexOrDefault = helpers$b.valueAtIndexOrDefault || helpers$b.getValueAtIndexOrDefault;

// For Chart.js 2.6.0 backward compatibility
var mergeIf = helpers$b.mergeIf || function(target, source) {
	return helpers$b.configMerge.call(this, source, target);
};

var extend$6 = helpers$b.extend;

// Ported from Chart.js 2.8.0. Modified for style legend.
// Generates labels shown in the legend
defaults$1.global.legend.labels.generateLabels = function(chart) {
	var data = chart.data;
	var options = chart.options.legend || {};
	var usePointStyle = options.labels && options.labels.usePointStyle;

	return helpers$b.isArray(data.datasets) ? data.datasets.map(function(dataset, i) {
		var meta = chart.getDatasetMeta(i);
		var controller = meta.controller;
		var elementOpts = chart.options.elements;
		var element, styleOptions;

		if (usePointStyle) {
			element = meta.data[0] || {};
			styleOptions = styleHelpers.resolvePointStyle(controller, element, i, elementOpts.point);
		} else if (meta.dataset) {
			element = meta.dataset;
			styleOptions = styleHelpers.resolveLineStyle(controller, element, elementOpts.line);
		} else {
			element = meta.data[0] || {};
			styleOptions = styleHelpers.resolveStyle(controller, element, i, meta.bar ? elementOpts.rectangle : elementOpts.point);
		}

		return extend$6({
			text: dataset.label,
			fillStyle: valueAtIndexOrDefault(dataset.backgroundColor, 0),
			hidden: !chart.isDatasetVisible(i),
			lineCap: dataset.borderCapStyle,
			lineDash: dataset.borderDash,
			lineDashOffset: dataset.borderDashOffset,
			lineJoin: dataset.borderJoinStyle,
			lineWidth: dataset.borderWidth,
			strokeStyle: dataset.borderColor,
			pointStyle: dataset.pointStyle,

			// Below is extra data used for toggling the datasets
			datasetIndex: i
		}, styleOptions);
	}, this) : [];
};

function drawLegendBox(chart, options, drawCallback) {
	var ctx = chart.ctx;

	styleHelpers.drawShadow(chart, options, drawCallback, true);

	if (styleHelpers.opaque(ctx.fillStyle)) {
		ctx.save();

		ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
		drawCallback();

		styleHelpers.drawBackgroundOverlay(chart, options, drawCallback);
		styleHelpers.drawBevel(chart, options, drawCallback);

		ctx.restore();
	}

	styleHelpers.drawInnerGlow(chart, options, drawCallback);
	styleHelpers.drawOuterGlow(chart, options, drawCallback);

	ctx.fillStyle = 'rgba(0, 0, 0, 0)';
	drawCallback();

	ctx.restore();
}

var StyleLegend = Chart.Legend.extend({

	draw: function() {
		var me = this;
		var chart = me.chart;
		var globalDefaults = defaults$1.global;
		var each = helpers$b.each;
		var drawPoint = helpers$b.canvas.drawPoint;
		var ctx = me.ctx;
		var options;

		helpers$b.each = function(loopable, fn) {
			each(loopable, function(legendItem) {
				var keys = Object.keys(legendItem);
				var i, ilen;

				options = {};
				for (i = 0, ilen = keys.length; i < ilen; i++) {
					options[keys[i]] = legendItem[keys[i]];
				}
				options.borderColor = valueOrDefault(legendItem.strokeStyle, globalDefaults.defaultColor);
				options.borderWidth = valueOrDefault(legendItem.lineWidth, globalDefaults.elements.line.borderWidth);

				fn.apply(null, arguments);
			});
		};

		helpers$b.canvas.drawPoint = function() {
			var args = arguments;
			var drawCallback = function() {
				drawPoint.apply(null, args);
			};

			drawLegendBox(chart, options, drawCallback);
		};

		ctx.strokeRect = function() {
			// noop
		};

		ctx.fillRect = function(x, y, width, height) {
			var drawCallback = function() {
				ctx.beginPath();
				ctx.rect(x, y, width, height);
				ctx.fill();
				if (options.borderWidth !== 0) {
					ctx.stroke();
				}
			};

			drawLegendBox(chart, options, drawCallback);
		};

		Chart.Legend.prototype.draw.apply(me, arguments);

		helpers$b.each = each;
		helpers$b.canvas.drawPoint = drawPoint;
		delete ctx.fillRect;
		delete ctx.strokeRect;
	}
});

// Ported from Chart.js 2.8.0. Modified for style legend.
function createNewLegendAndAttach(chart, legendOpts) {
	var legend = new StyleLegend({
		ctx: chart.ctx,
		options: legendOpts,
		chart: chart
	});

	layouts.configure(chart, legend, legendOpts);
	layouts.addBox(chart, legend);
	chart.legend = legend;
}

var StyleLegendPlugin = {
	id: 'legend',

	_element: StyleLegend,

	// Ported from Chart.js 2.8.0.
	beforeInit: function(chart) {
		var legendOpts = chart.options.legend;

		if (legendOpts) {
			createNewLegendAndAttach(chart, legendOpts);
		}
	},

	// Ported from Chart.js 2.8.0.
	beforeUpdate: function(chart) {
		var legendOpts = chart.options.legend;
		var legend = chart.legend;

		if (legendOpts) {
			mergeIf(legendOpts, defaults$1.global.legend);

			if (legend) {
				layouts.configure(chart, legend, legendOpts);
				legend.options = legendOpts;
			} else {
				createNewLegendAndAttach(chart, legendOpts);
			}
		} else if (legend) {
			layouts.removeBox(chart, legend);
			delete chart.legend;
		}
	},

	// Ported from Chart.js 2.8.0.
	afterEvent: function(chart, e) {
		var legend = chart.legend;
		if (legend) {
			legend.handleEvent(e);
		}
	}
};

var helpers$c = Chart.helpers;

// For Chart.js 2.7.1 backward compatibility
var layouts$1 = Chart.layouts || Chart.layoutService;

var plugins = Chart.plugins;

var styleControllers = {
	bar: StyleBarController,
	bubble: StyleBubbleController,
	doughnut: StyleDoughnutController,
	horizontalBar: StyleHorizontalBarController,
	line: StyleLineController,
	polarArea: StylePolarAreaController,
	pie: StyleDoughnutController,
	radar: StyleRadarController,
	scatter: StyleLineController
};

// Ported from Chart.js 2.8.0. Modified for style controllers.
function buildOrUpdateControllers() {
	var me = this;
	var newControllers = [];

	helpers$c.each(me.data.datasets, function(dataset, datasetIndex) {
		var meta = me.getDatasetMeta(datasetIndex);
		var type = dataset.type || me.config.type;

		if (meta.type && meta.type !== type) {
			me.destroyDatasetMeta(datasetIndex);
			meta = me.getDatasetMeta(datasetIndex);
		}
		meta.type = type;

		if (meta.controller) {
			meta.controller.updateIndex(datasetIndex);
			meta.controller.linkScales();
		} else {
			var ControllerClass = styleControllers[meta.type];
			if (ControllerClass === undefined) {
				throw new Error('"' + meta.type + '" is not a chart type.');
			}

			meta.controller = new ControllerClass(me, datasetIndex);
			newControllers.push(meta.controller);
		}
	}, me);

	return newControllers;
}

// Ported from Chart.js 2.8.0. Modified for style tooltip.
function initToolTip() {
	var me = this;
	me.tooltip = new StyleTooltip({
		_chart: me,
		_chartInstance: me, // deprecated, backward compatibility
		_data: me.data,
		_options: me.options.tooltips
	}, me);
}

var descriptors = plugins.descriptors;

plugins.descriptors = function(chart) {
	var style = chart._style;

	// Replace legend plugin with style legend plugin
	if (style) {
		// chart._plugins for Chart.js 2.7.1 backward compatibility
		var cache = chart.$plugins || chart._plugins || (chart.$plugins = chart._plugins = {});
		if (cache.id === this._cacheId) {
			return cache.descriptors;
		}

		var p = this._plugins;
		var result;

		this._plugins = p.map(function(plugin) {
			if (plugin.id === 'legend') {
				return StyleLegendPlugin;
			}
			return plugin;
		});
	}

	result = descriptors.apply(this, arguments);

	if (style) {
		this._plugins = p;
	}

	return result;
};

var StylePlugin = {
	id: 'style',

	beforeInit: function(chart) {
		chart._style = {};

		chart.buildOrUpdateControllers = buildOrUpdateControllers;
		chart.initToolTip = initToolTip;

		// Remove the existing legend if exists
		if (chart.legend) {
			layouts$1.removeBox(chart, chart.legend);
			delete chart.legend;
		}

		// Invalidate plugin cache and create new one
		delete chart.$plugins;
		// For Chart.js 2.7.1 backward compatibility
		delete chart._plugins;
		plugins.descriptors(chart);
	}
};

Chart.plugins.register(StylePlugin);

return StylePlugin;

}));
