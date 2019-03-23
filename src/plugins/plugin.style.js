'use strict';

import Chart from 'chart.js';
import StyleTooltip from '../core/core.styleTooltip';
import StyleBarController from '../controllers/controller.styleBar';
import StyleBubbleController from '../controllers/controller.styleBubble';
import StyleDoughnutController from '../controllers/controller.styleDoughnut';
import StyleHorizontalBarController from '../controllers/controller.styleHorizontalBar';
import StyleLineController from '../controllers/controller.styleLine';
import StylePolarAreaController from '../controllers/controller.stylePolarArea';
import StyleRadarController from '../controllers/controller.styleRadar';
import StyleLegendPlugin from './plugin.styleLegend';

var helpers = Chart.helpers;

// For Chart.js 2.7.1 backward compatibility
var layouts = Chart.layouts || Chart.layoutService;

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

	helpers.each(me.data.datasets, function(dataset, datasetIndex) {
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

export default {
	id: 'style',

	beforeInit: function(chart) {
		chart._style = {};

		chart.buildOrUpdateControllers = buildOrUpdateControllers;
		chart.initToolTip = initToolTip;

		// Remove the existing legend if exists
		if (chart.legend) {
			layouts.removeBox(chart, chart.legend);
			delete chart.legend;
		}

		// Invalidate plugin cache and create new one
		delete chart.$plugins;
		// For Chart.js 2.7.1 backward compatibility
		delete chart._plugins;
		plugins.descriptors(chart);
	}
};
