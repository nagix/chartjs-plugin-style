'use strict';

import Chart from '../core/core.js';
import StyleLine from '../elements/element.styleLine';
import StylePoint from '../elements/element.stylePoint';

var helpers = Chart.helpers;

var valueOrDefault = helpers.valueOrDefault;
var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;
var getHoverColor = helpers.getHoverColor;

var RadarController = Chart.controllers.radar;

export default RadarController.extend({

	datasetElementType: StyleLine,

	dataElementType: StylePoint,

	// Ported from Chart.js 2.7.3. Modified for style radar.
	update: function(reset) {
		var me = this;
		var meta = me.getMeta();
		var line = meta.dataset;
		var points = meta.data;
		var custom = line.custom || {};
		var dataset = me.getDataset();
		var lineElementOptions = me.chart.options.elements.line;
		var scale = me.chart.scale;

		// Compatibility: If the properties are defined with only the old name, use those values
		if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) {
			dataset.lineTension = dataset.tension;
		}

		helpers.extend(meta.dataset, {
			// Utility
			_datasetIndex: me.index,
			_scale: scale,
			// Data
			_children: points,
			_loop: true,
			// Model
			_model: {
				// Appearance
				tension: custom.tension ? custom.tension : valueOrDefault(dataset.lineTension, lineElementOptions.tension),
				backgroundColor: custom.backgroundColor ? custom.backgroundColor : (dataset.backgroundColor || lineElementOptions.backgroundColor),
				borderWidth: custom.borderWidth ? custom.borderWidth : (dataset.borderWidth || lineElementOptions.borderWidth),
				borderColor: custom.borderColor ? custom.borderColor : (dataset.borderColor || lineElementOptions.borderColor),
				fill: custom.fill ? custom.fill : (dataset.fill !== undefined ? dataset.fill : lineElementOptions.fill),
				borderCapStyle: custom.borderCapStyle ? custom.borderCapStyle : (dataset.borderCapStyle || lineElementOptions.borderCapStyle),
				borderDash: custom.borderDash ? custom.borderDash : (dataset.borderDash || lineElementOptions.borderDash),
				borderDashOffset: custom.borderDashOffset ? custom.borderDashOffset : (dataset.borderDashOffset || lineElementOptions.borderDashOffset),
				borderJoinStyle: custom.borderJoinStyle ? custom.borderJoinStyle : (dataset.borderJoinStyle || lineElementOptions.borderJoinStyle),

				shadowOffsetX: custom.shadowOffsetX ? custom.shadowOffsetX : (dataset.shadowOffsetX || lineElementOptions.shadowOffsetX),
				shadowOffsetY: custom.shadowOffsetY ? custom.shadowOffsetY : (dataset.shadowOffsetY || lineElementOptions.shadowOffsetY),
				shadowBlur: custom.shadowBlur ? custom.shadowBlur : (dataset.shadowBlur || lineElementOptions.shadowBlur),
				shadowColor: custom.shadowColor ? custom.shadowColor : (dataset.shadowColor || lineElementOptions.shadowColor),
				outerGlowWidth: custom.outerGlowWidth ? custom.outerGlowWidth : (dataset.outerGlowWidth || lineElementOptions.outerGlowWidth),
				outerGlowColor: custom.outerGlowColor ? custom.outerGlowColor : (dataset.outerGlowColor || lineElementOptions.outerGlowColor)
			}
		});

		meta.dataset.pivot();

		// Update Points
		helpers.each(points, function(point, index) {
			me.updateElement(point, index, reset);
		}, me);

		// Update bezier control points
		me.updateBezierControlPoints();
	},

	updateElement: function(point, index) {
		RadarController.prototype.updateElement.apply(this, arguments);

		var me = this;
		var custom = point.custom || {};
		var dataset = me.getDataset();
		var pointElementOptions = me.chart.options.elements.point;

		point._model.shadowOffsetX = !isNaN(custom.shadowOffsetX) ? custom.shadowOffsetX : valueAtIndexOrDefault(dataset.pointShadowOffsetX, index, !isNaN(dataset.shadowOffsetX) ? dataset.shadowOffsetX : pointElementOptions.shadowOffsetX);
		point._model.shadowOffsetY = !isNaN(custom.shadowOffsetY) ? custom.shadowOffsetY : valueAtIndexOrDefault(dataset.pointShadowOffsetY, index, !isNaN(dataset.shadowOffsetY) ? dataset.shadowOffsetY : pointElementOptions.shadowOffsetY);
		point._model.shadowBlur = !isNaN(custom.shadowBlur) ? custom.shadowBlur : valueAtIndexOrDefault(dataset.pointShadowBlur, index, !isNaN(dataset.shadowBlur) ? dataset.shadowBlur : pointElementOptions.shadowBlur);
		point._model.shadowColor = custom.shadowColor ? custom.shadowColor : valueAtIndexOrDefault(dataset.pointShadowColor, index, dataset.shadowColor ? dataset.shadowColor : pointElementOptions.shadowColor);
		point._model.bevelWidth = !isNaN(custom.bevelWidth) ? custom.bevelWidth : valueAtIndexOrDefault(dataset.pointBevelWidth, index, !isNaN(dataset.bevelWidth) ? dataset.bevelWidth : pointElementOptions.bevelWidth);
		point._model.bevelHighlightColor = custom.bevelHighlightColor ? custom.bevelHighlightColor : valueAtIndexOrDefault(dataset.pointBevelHighlightColor, index, dataset.bevelHighlightColor ? dataset.bevelHighlightColor : pointElementOptions.bevelHighlightColor);
		point._model.bevelShadowColor = custom.bevelShadowColor ? custom.bevelShadowColor : valueAtIndexOrDefault(dataset.pointBevelShadowColor, index, dataset.bevelShadowColor ? dataset.bevelShadowColor : pointElementOptions.bevelShadowColor);
		point._model.innerGlowWidth = !isNaN(custom.innerGlowWidth) ? custom.innerGlowWidth : valueAtIndexOrDefault(dataset.pointInnerGlowWidth, index, !isNaN(dataset.innerGlowWidth) ? dataset.innerGlowWidth : pointElementOptions.innerGlowWidth);
		point._model.innerGlowColor = custom.innerGlowColor ? custom.innerGlowColor : valueAtIndexOrDefault(dataset.pointInnerGlowColor, index, dataset.innerGlowColor ? dataset.innerGlowColor : pointElementOptions.innerGlowColor);
		point._model.outerGlowWidth = !isNaN(custom.outerGlowWidth) ? custom.outerGlowWidth : valueAtIndexOrDefault(dataset.pointOuterGlowWidth, index, !isNaN(dataset.outerGlowWidth) ? dataset.outerGlowWidth : pointElementOptions.outerGlowWidth);
		point._model.outerGlowColor = custom.outerGlowColor ? custom.outerGlowColor : valueAtIndexOrDefault(dataset.pointOuterGlowColor, index, dataset.outerGlowColor ? dataset.outerGlowColor : pointElementOptions.outerGlowColor);
	},

	setHoverStyle: function(element) {
		RadarController.prototype.setHoverStyle.apply(this, arguments);

		// Point
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

		model.shadowOffsetX = custom.hoverShadowOffsetX ? custom.hoverShadowOffsetX : valueAtIndexOrDefault(dataset.pointHoverShadowOffsetX, index, model.shadowOffsetX);
		model.shadowOffsetY = custom.hoverShadowOffsetY ? custom.hoverShadowOffsetY : valueAtIndexOrDefault(dataset.pointHoverShadowOffsetY, index, model.shadowOffsetY);
		model.shadowBlur = custom.hoverShadowBlur ? custom.hoverShadowBlur : valueAtIndexOrDefault(dataset.pointHoverShadowBlur, index, model.shadowBlur);
		model.shadowColor = custom.hoverShadowColor ? custom.hoverShadowColor : valueAtIndexOrDefault(dataset.pointHoverShadowColor, index, getHoverColor(model.shadowColor));
		model.bevelWidth = custom.hoverBevelWidth ? custom.hoverBevelWidth : valueAtIndexOrDefault(dataset.pointHoverBevelWidth, index, model.bevelWidth);
		model.bevelHighlightColor = custom.hoverBevelHighlightColor ? custom.hoverBevelHighlightColor : valueAtIndexOrDefault(dataset.pointHoverBevelHighlightColor, index, getHoverColor(model.bevelHighlightColor));
		model.bevelShadowColor = custom.hoverBevelShadowColor ? custom.hoverBevelShadowColor : valueAtIndexOrDefault(dataset.pointHoverBevelShadowColor, index, getHoverColor(model.bevelShadowColor));
		model.innerGlowWidth = custom.hoverInnerGlowWidth ? custom.hoverInnerGlowWidth : valueAtIndexOrDefault(dataset.pointHoverInnerGlowWidth, index, model.innerGlowWidth);
		model.innerGlowColor = custom.hoverInnerGlowColor ? custom.hoverInnerGlowColor : valueAtIndexOrDefault(dataset.pointHoverInnerGlowColor, index, getHoverColor(model.innerGlowColor));
		model.outerGlowWidth = custom.hoverOuterGlowWidth ? custom.hoverOuterGlowWidth : valueAtIndexOrDefault(dataset.pointHoverOuterGlowWidth, index, model.outerGlowWidth);
		model.outerGlowColor = custom.hoverOuterGlowColor ? custom.hoverOuterGlowColor : valueAtIndexOrDefault(dataset.pointHoverOuterGlowColor, index, getHoverColor(model.outerGlowColor));
	},

	removeHoverStyle: function(element) {
		var dataset = this.chart.data.datasets[element._datasetIndex];
		var index = element._index;
		var custom = element.custom || {};
		var model = element._model;
		var elementOpts = this.chart.options.elements.point;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			model.shadowOffsetX = !isNaN(custom.shadowOffsetX) ? custom.shadowOffsetX : valueAtIndexOrDefault(dataset.pointShadowOffsetX, index, !isNaN(dataset.shadowOffsetX) ? dataset.shadowOffsetX : elementOpts.shadowOffsetX);
			model.shadowOffsetY = !isNaN(custom.shadowOffsetY) ? custom.shadowOffsetY : valueAtIndexOrDefault(dataset.pointShadowOffsetY, index, !isNaN(dataset.shadowOffsetY) ? dataset.shadowOffsetY : elementOpts.shadowOffsetY);
			model.shadowBlur = !isNaN(custom.shadowBlur) ? custom.shadowBlur : valueAtIndexOrDefault(dataset.pointShadowBlur, index, !isNaN(dataset.shadowBlur) ? dataset.shadowBlur : elementOpts.shadowBlur);
			model.shadowColor = custom.shadowColor ? custom.shadowColor : valueAtIndexOrDefault(dataset.pointShadowColor, index, dataset.shadowColor ? dataset.shadowColor : elementOpts.shadowColor);
			model.bevelWidth = !isNaN(custom.bevelWidth) ? custom.bevelWidth : valueAtIndexOrDefault(dataset.pointBevelWidth, index, !isNaN(dataset.bevelWidth) ? dataset.bevelWidth : elementOpts.bevelWidth);
			model.bevelHighlightColor = custom.bevelHighlightColor ? custom.bevelHighlightColor : valueAtIndexOrDefault(dataset.pointBevelHighlightColor, index, dataset.bevelHighlightColor ? dataset.bevelHighlightColor : elementOpts.bevelHighlightColor);
			model.bevelShadowColor = custom.bevelShadowColor ? custom.bevelShadowColor : valueAtIndexOrDefault(dataset.pointBevelShadowColor, index, dataset.bevelShadowColor ? dataset.bevelShadowColor : elementOpts.bevelShadowColor);
			model.innerGlowWidth = !isNaN(custom.innerGlowWidth) ? custom.innerGlowWidth : valueAtIndexOrDefault(dataset.pointInnerGlowWidth, index, !isNaN(dataset.innerGlowWidth) ? dataset.innerGlowWidth : elementOpts.innerGlowWidth);
			model.innerGlowColor = custom.innerGlowColor ? custom.innerGlowColor : valueAtIndexOrDefault(dataset.pointInnerGlowColor, index, dataset.innerGlowColor ? dataset.innerGlowColor : elementOpts.innerGlowColor);
			model.outerGlowWidth = !isNaN(custom.outerGlowWidth) ? custom.outerGlowWidth : valueAtIndexOrDefault(dataset.pointOuterGlowWidth, index, !isNaN(dataset.outerGlowWidth) ? dataset.outerGlowWidth : elementOpts.outerGlowWidth);
			model.outerGlowColor = custom.outerGlowColor ? custom.outerGlowColor : valueAtIndexOrDefault(dataset.pointOuterGlowColor, index, dataset.outerGlowColor ? dataset.outerGlowColor : elementOpts.outerGlowColor);
		}

		RadarController.prototype.removeHoverStyle.apply(this, arguments);
	}
});
