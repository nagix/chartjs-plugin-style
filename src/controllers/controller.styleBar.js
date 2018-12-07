'use strict';

import Chart from '../core/core.js';
import StyleRectangle from '../elements/element.styleRectangle';

var helpers = Chart.helpers;

var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;
var getHoverColor = helpers.getHoverColor;

var BarController = Chart.controllers.bar;

export default BarController.extend({

	dataElementType: StyleRectangle,

	// Ported from Chart.js 2.7.3. Modified for style bar.
	updateElement: function(rectangle, index, reset) {
		var me = this;
		var chart = me.chart;
		var meta = me.getMeta();
		var dataset = me.getDataset();
		var custom = rectangle.custom || {};
		var rectangleOptions = chart.options.elements.rectangle;

		rectangle._xScale = me.getScaleForId(meta.xAxisID);
		rectangle._yScale = me.getScaleForId(meta.yAxisID);
		rectangle._datasetIndex = me.index;
		rectangle._index = index;

		rectangle._model = {
			datasetLabel: dataset.label,
			label: chart.data.labels[index],
			borderSkipped: custom.borderSkipped ? custom.borderSkipped : rectangleOptions.borderSkipped,
			backgroundColor: custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(dataset.backgroundColor, index, rectangleOptions.backgroundColor),
			borderColor: custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(dataset.borderColor, index, rectangleOptions.borderColor),
			borderWidth: custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(dataset.borderWidth, index, rectangleOptions.borderWidth),

			shadowOffsetX: custom.shadowOffsetX ? custom.shadowOffsetX : valueAtIndexOrDefault(dataset.shadowOffsetX, index, rectangleOptions.shadowOffsetX),
			shadowOffsetY: custom.shadowOffsetY ? custom.shadowOffsetY : valueAtIndexOrDefault(dataset.shadowOffsetY, index, rectangleOptions.shadowOffsetY),
			shadowBlur: custom.shadowBlur ? custom.shadowBlur : valueAtIndexOrDefault(dataset.shadowBlur, index, rectangleOptions.shadowBlur),
			shadowColor: custom.shadowColor ? custom.shadowColor : valueAtIndexOrDefault(dataset.shadowColor, index, rectangleOptions.shadowColor),
			bevelWidth: custom.bevelWidth ? custom.bevelWidth : valueAtIndexOrDefault(dataset.bevelWidth, index, rectangleOptions.bevelWidth),
			bevelHighlightColor: custom.bevelHighlightColor ? custom.bevelHighlightColor : valueAtIndexOrDefault(dataset.bevelHighlightColor, index, rectangleOptions.bevelHighlightColor),
			bevelShadowColor: custom.bevelShadowColor ? custom.bevelShadowColor : valueAtIndexOrDefault(dataset.bevelShadowColor, index, rectangleOptions.bevelShadowColor),
			innerGlowWidth: custom.innerGlowWidth ? custom.innerGlowWidth : valueAtIndexOrDefault(dataset.innerGlowWidth, index, rectangleOptions.innerGlowWidth),
			innerGlowColor: custom.innerGlowColor ? custom.innerGlowColor : valueAtIndexOrDefault(dataset.innerGlowColor, index, rectangleOptions.innerGlowColor),
			outerGlowWidth: custom.outerGlowWidth ? custom.outerGlowWidth : valueAtIndexOrDefault(dataset.outerGlowWidth, index, rectangleOptions.outerGlowWidth),
			outerGlowColor: custom.outerGlowColor ? custom.outerGlowColor : valueAtIndexOrDefault(dataset.outerGlowColor, index, rectangleOptions.outerGlowColor)
		};

		me.updateElementGeometry(rectangle, index, reset);

		rectangle.pivot();
	},

	setHoverStyle: function(element) {
		BarController.prototype.setHoverStyle.apply(this, arguments);

		var dataset = this.chart.data.datasets[element._datasetIndex];
		var index = element._index;
		var custom = element.custom || {};
		var model = element._model;

		if (element.$previousStyle) {
			element.$previousStyle.shadowOffsetX = model.shadowOffsetX;
			element.$previousStyle.shadowOffsetY = model.shadowOffsetY;
			element.$previousStyle.shadowBlur = model.shadowBlur;
			element.$previousStyle.shadowColor = model.shadowColor;
			element.$previousStyle.bevelWidth = model.bevelWidth;
			element.$previousStyle.bevelHighlightColor = model.bevelHighlightColor;
			element.$previousStyle.bevelShadowColor = model.bevelShadowColor;
			element.$previousStyle.innerGlowWidth = model.innerGlowWidth;
			element.$previousStyle.innerGlowColor = model.innerGlowColor;
			element.$previousStyle.outerGlowWidth = model.outerGlowWidth;
			element.$previousStyle.outerGlowColor = model.outerGlowColor;
		}

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

	removeHoverStyle: function(element) {
		var dataset = this.chart.data.datasets[element._datasetIndex];
		var index = element._index;
		var custom = element.custom || {};
		var model = element._model;
		var elementOpts = this.chart.options.elements.rectangle;

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

		BarController.prototype.removeHoverStyle.apply(this, arguments);
	}
});
