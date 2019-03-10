'use strict';

import Chart from '../core/core.js';
import StylePoint from '../elements/element.stylePoint';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var valueOrDefault = helpers.valueOrDefault;
var getHoverColor = styleHelpers.getHoverColor;

var BubbleController = Chart.controllers.bubble;

export default BubbleController.extend({

	dataElementType: StylePoint,

	updateElement: function(point) {
		var me = this;
		var model = {};

		Object.defineProperty(point, '_model', {
			configurable: true,
			get: function() {
				return model;
			},
			set: function(value) {
				helpers.merge(model, value);
				styleHelpers.mergeStyle(model, point._options);
			}
		});

		BubbleController.prototype.updateElement.apply(me, arguments);

		delete point._model;
		point._model = model;
	},

	/**
	 * @protected
	 */
	setHoverStyle: function(element) {
		var model = element._model;
		var options = element._options;

		BubbleController.prototype.setHoverStyle.apply(this, arguments);

		styleHelpers.saveStyle(element);

		model.shadowOffsetX = valueOrDefault(options.hoverShadowOffsetX, options.shadowOffsetX);
		model.shadowOffsetY = valueOrDefault(options.hoverShadowOffsetY, options.shadowOffsetY);
		model.shadowBlur = valueOrDefault(options.hoverShadowBlur, options.shadowBlur);
		model.shadowColor = valueOrDefault(options.hoverShadowColor, getHoverColor(options.shadowColor));
		model.bevelWidth = valueOrDefault(options.hoverBevelWidth, options.bevelWidth);
		model.bevelHighlightColor = valueOrDefault(options.hoverBevelHighlightColor, getHoverColor(options.bevelHighlightColor));
		model.bevelShadowColor = valueOrDefault(options.hoverBevelShadowColor, getHoverColor(options.bevelShadowColor));
		model.innerGlowWidth = valueOrDefault(options.hoverInnerGlowWidth, options.innerGlowWidth);
		model.innerGlowColor = valueOrDefault(options.hoverInnerGlowColor, getHoverColor(options.innerGlowColor));
		model.outerGlowWidth = valueOrDefault(options.hoverOuterGlowWidth, options.outerGlowWidth);
		model.outerGlowColor = valueOrDefault(options.hoverOuterGlowColor, getHoverColor(options.outerGlowColor));
		model.backgroundOverlayColor = valueOrDefault(options.hoverBackgroundOverlayColor, getHoverColor(options.backgroundOverlayColor));
		model.backgroundOverlayMode = valueOrDefault(options.hoverBackgroundOverlayMode, options.backgroundOverlayMode);
	},

	/**
	 * @protected
	 */
	removeHoverStyle: function(element) {
		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			styleHelpers.mergeStyle(element._model, element._options);
		}

		BubbleController.prototype.removeHoverStyle.apply(this, arguments);
	},

	/**
	 * @private
	 */
	_resolveElementOptions: function(point, index) {
		var me = this;
		var chart = me.chart;
		var datasets = chart.data.datasets;
		var dataset = datasets[me.index];
		var custom = point.custom || {};
		var options = chart.options.elements.point;
		var values = BubbleController.prototype._resolveElementOptions.apply(this, arguments);
		var i, ilen, key;

		// Scriptable options
		var context = {
			chart: chart,
			dataIndex: index,
			dataset: dataset,
			datasetIndex: me.index
		};

		var keys = [
			'shadowOffsetX',
			'shadowOffsetY',
			'shadowBlur',
			'shadowColor',
			'hoverShadowOffsetX',
			'hoverShadowOffsetY',
			'hoverShadowBlur',
			'hoverShadowColor',
			'bevelWidth',
			'bevelHighlightColor',
			'bevelShadowColor',
			'hoverBevelWidth',
			'hoverBevelHighlightColor',
			'hoverBevelShadowColor',
			'innerGlowWidth',
			'innerGlowColor',
			'outerGlowWidth',
			'outerGlowColor',
			'hoverInnerGlowWidth',
			'hoverInnerGlowColor',
			'hoverOuterGlowWidth',
			'hoverOuterGlowColor',
			'backgroundOverlayColor',
			'backgroundOverlayMode',
			'hoverBackgroundOverlayColor',
			'hoverBackgroundOverlayMode'
		];

		for (i = 0, ilen = keys.length; i < ilen; ++i) {
			key = keys[i];
			values[key] = helpers.options.resolve([
				custom[key],
				dataset[key],
				options[key]
			], context, index);
		}

		return values;
	}
});
