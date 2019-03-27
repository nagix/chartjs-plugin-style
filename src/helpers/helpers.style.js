'use strict';

import Chart from 'chart.js';
import optionsHelpers from './helpers.options';

var helpers = Chart.helpers;

var resolve = optionsHelpers.resolve;

var OFFSET = 1000000;

function isColorOption(key) {
	return key.indexOf('Color') !== -1;
}

export default {

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
		return helpers.color(color).alpha() > 0;
	},

	getHoverColor: function(color) {
		return color !== undefined ? helpers.getHoverColor(color) : color;
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
