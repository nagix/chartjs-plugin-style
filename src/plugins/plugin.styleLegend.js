'use strict';

import Chart from 'chart.js';
import styleHelpers from '../helpers/helpers.style';

var defaults = Chart.defaults;
var helpers = Chart.helpers;

// For Chart.js 2.7.1 backward compatibility
var layouts = Chart.layouts || Chart.layoutService;

// For Chart.js 2.6.0 backward compatibility
var valueOrDefault = helpers.valueOrDefault || helpers.getValueOrDefault;

// For Chart.js 2.6.0 backward compatibility
var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault || helpers.getValueAtIndexOrDefault;

// For Chart.js 2.6.0 backward compatibility
var mergeIf = helpers.mergeIf || function(target, source) {
	return helpers.configMerge.call(this, source, target);
};

var extend = helpers.extend;

// Ported from Chart.js 2.8.0. Modified for style legend.
// Generates labels shown in the legend
defaults.global.legend.labels.generateLabels = function(chart) {
	var data = chart.data;
	var options = chart.options.legend || {};
	var usePointStyle = options.labels && options.labels.usePointStyle;

	return helpers.isArray(data.datasets) ? data.datasets.map(function(dataset, i) {
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

		return extend({
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
		var globalDefaults = defaults.global;
		var each = helpers.each;
		var drawPoint = helpers.canvas.drawPoint;
		var ctx = me.ctx;
		var options;

		helpers.each = function(loopable, fn) {
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

		helpers.canvas.drawPoint = function() {
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

		helpers.each = each;
		helpers.canvas.drawPoint = drawPoint;
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

export default {
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
			mergeIf(legendOpts, defaults.global.legend);

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
