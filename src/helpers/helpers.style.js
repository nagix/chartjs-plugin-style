'use strict';

import Chart from 'chart.js';

var helpers = Chart.helpers;

var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;
var getHoverColor = helpers.getHoverColor;

var OFFSET = 1000000;

export default {

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

	drawShadow: function(chart, offsetX, offsetY, blur, color, drawCallback, backmost) {
		var ctx = chart.ctx;
		var pixelRatio = chart.currentDevicePixelRatio;

		ctx.save();

		ctx.shadowOffsetX = (offsetX + OFFSET) * pixelRatio;
		ctx.shadowOffsetY = offsetY * pixelRatio;
		ctx.shadowBlur = blur * pixelRatio;
		ctx.shadowColor = color;
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

	drawBevel: function(chart, width, highlightColor, shadowColor, drawCallback) {
		var ctx = chart.ctx;
		var pixelRatio = chart.currentDevicePixelRatio;
		var shadowOffset = (width * pixelRatio) / 2;

		if (!width) {
			return;
		}

		ctx.save();
		ctx.clip();

		// Make stencil
		ctx.translate(-OFFSET, 0);
		this.setPath(ctx, drawCallback);
		ctx.rect(0, 0, chart.width, chart.height);

		// Draw bevel shadow
		ctx.fillStyle = 'black';
		ctx.shadowOffsetX = OFFSET * pixelRatio - shadowOffset;
		ctx.shadowOffsetY = -shadowOffset;
		ctx.shadowBlur = shadowOffset;
		ctx.shadowColor = shadowColor;
		// Workaround for the issue on Windows version of FireFox
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1333090
		// If the destination has transparency, the result will be different
		if (!(navigator && navigator.userAgent.match('Windows.+Firefox'))) {
			ctx.globalCompositeOperation = 'source-atop';
		}
		ctx.fill('evenodd');

		// Draw Bevel highlight
		ctx.shadowOffsetX = OFFSET * pixelRatio + shadowOffset;
		ctx.shadowOffsetY = shadowOffset;
		ctx.shadowColor = highlightColor;
		ctx.fill('evenodd');

		ctx.restore();
	},

	drawGlow: function(chart, width, color, borderWidth, drawCallback, isOuter) {
		var ctx = chart.ctx;
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
		ctx.shadowColor = color;
		ctx.fill('evenodd');
		if (borderWidth) {
			ctx.stroke();
		}

		ctx.restore();
	},

	drawInnerGlow: function(chart, width, color, borderWidth, drawCallback) {
		this.drawGlow(chart, width, color, borderWidth, drawCallback);
	},

	drawOuterGlow: function(chart, width, color, borderWidth, drawCallback) {
		this.drawGlow(chart, width, color, borderWidth, drawCallback, true);
	},

	opaque: function(color) {
		return Chart.helpers.color(color).alpha() > 0;
	},

	saveStyle: function(element, model) {
		var previousStyle = element.$previousStyle;

		if (previousStyle) {
			previousStyle.shadowOffsetX = model.shadowOffsetX;
			previousStyle.shadowOffsetY = model.shadowOffsetY;
			previousStyle.shadowBlur = model.shadowBlur;
			previousStyle.shadowColor = model.shadowColor;
			previousStyle.bevelWidth = model.bevelWidth;
			previousStyle.bevelHighlightColor = model.bevelHighlightColor;
			previousStyle.bevelShadowColor = model.bevelShadowColor;
			previousStyle.innerGlowWidth = model.innerGlowWidth;
			previousStyle.innerGlowColor = model.innerGlowColor;
			previousStyle.outerGlowWidth = model.outerGlowWidth;
			previousStyle.outerGlowColor = model.outerGlowColor;
		}
	},

	setHoverStyle: function(chart, element) {
		var dataset = chart.data.datasets[element._datasetIndex];
		var index = element._index;
		var custom = element.custom || {};
		var model = element._model;

		this.saveStyle(element, model);

		model.shadowOffsetX = custom.hoverShadowOffsetX ? custom.hoverShadowOffsetX : valueAtIndexOrDefault(dataset.hoverShadowOffsetX, index, model.shadowOffsetX);
		model.shadowOffsetY = custom.hoverShadowOffsetY ? custom.hoverShadowOffsetY : valueAtIndexOrDefault(dataset.hoverShadowOffsetY, index, model.shadowOffsetY);
		model.shadowBlur = custom.hoverShadowBlur ? custom.hoverShadowBlur : valueAtIndexOrDefault(dataset.hoverShadowBlur, index, model.shadowBlur);
		model.shadowColor = custom.hoverShadowColor ? custom.hoverShadowColor : valueAtIndexOrDefault(dataset.hoverShadowColor, index, getHoverColor(model.shadowColor));
		model.bevelWidth = custom.hoverBevelWidth ? custom.hoverBevelWidth : valueAtIndexOrDefault(dataset.hoverBevelWidth, index, model.bevelWidth);
		model.bevelHighlightColor = custom.hoverBevelHighlightColor ? custom.hoverBevelHighlightColor : valueAtIndexOrDefault(dataset.hoverBevelHighlightColor, index, getHoverColor(model.bevelHighlightColor));
		model.bevelShadowColor = custom.hoverBevelShadowColor ? custom.hoverBevelShadowColor : valueAtIndexOrDefault(dataset.hoverBevelShadowColor, index, getHoverColor(model.bevelShadowColor));
		model.innerGlowWidth = custom.hoverInnerGlowWidth ? custom.hoverInnerGlowWidth : valueAtIndexOrDefault(dataset.hoverInnerGlowWidth, index, model.innerGlowWidth);
		model.innerGlowColor = custom.hoverInnerGlowColor ? custom.hoverInnerGlowColor : valueAtIndexOrDefault(dataset.hoverInnerGlowColor, index, getHoverColor(model.innerGlowColor));
		model.outerGlowWidth = custom.hoverOuterGlowWidth ? custom.hoverOuterGlowWidth : valueAtIndexOrDefault(dataset.hoverOuterGlowWidth, index, model.outerGlowWidth);
		model.outerGlowColor = custom.hoverOuterGlowColor ? custom.hoverOuterGlowColor : valueAtIndexOrDefault(dataset.hoverOuterGlowColor, index, getHoverColor(model.outerGlowColor));
	},

	removeHoverStyle: function(chart, element, type) {
		var dataset = chart.data.datasets[element._datasetIndex];
		var index = element._index;
		var custom = element.custom || {};
		var model = element._model;
		var elementOpts = chart.options.elements[type];

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			model.shadowOffsetX = custom.shadowOffsetX ? custom.shadowOffsetX : valueAtIndexOrDefault(dataset.shadowOffsetX, index, elementOpts.shadowOffsetX);
			model.shadowOffsetY = custom.shadowOffsetY ? custom.shadowOffsetY : valueAtIndexOrDefault(dataset.shadowOffsetY, index, elementOpts.shadowOffsetY);
			model.shadowBlur = custom.shadowBlur ? custom.shadowBlur : valueAtIndexOrDefault(dataset.shadowBlur, index, elementOpts.shadowBlur);
			model.shadowColor = custom.shadowColor ? custom.shadowColor : valueAtIndexOrDefault(dataset.shadowColor, index, elementOpts.shadowColor);
			model.bevelWidth = custom.bevelWidth ? custom.bevelWidth : valueAtIndexOrDefault(dataset.bevelWidth, index, elementOpts.bevelWidth);
			model.bevelHighlightColor = custom.bevelHighlightColor ? custom.bevelHighlightColor : valueAtIndexOrDefault(dataset.bevelHighlightColor, index, elementOpts.bevelHighlightColor);
			model.bevelShadowColor = custom.bevelShadowColor ? custom.bevelShadowColor : valueAtIndexOrDefault(dataset.bevelShadowColor, index, elementOpts.bevelShadowColor);
			model.innerGlowWidth = custom.innerGlowWidth ? custom.innerGlowWidth : valueAtIndexOrDefault(dataset.innerGlowWidth, index, elementOpts.innerGlowWidth);
			model.innerGlowColor = custom.innerGlowColor ? custom.innerGlowColor : valueAtIndexOrDefault(dataset.innerGlowColor, index, elementOpts.innerGlowColor);
			model.outerGlowWidth = custom.outerGlowWidth ? custom.outerGlowWidth : valueAtIndexOrDefault(dataset.outerGlowWidth, index, elementOpts.outerGlowWidth);
			model.outerGlowColor = custom.outerGlowColor ? custom.outerGlowColor : valueAtIndexOrDefault(dataset.outerGlowColor, index, elementOpts.outerGlowColor);
		}
	}
};
