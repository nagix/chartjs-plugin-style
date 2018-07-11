'use strict';

export default function(Chart) {

	var elements = Chart.elements;
	var helpers = Chart.helpers;

	var LineController = Chart.controllers.line;

	// Ported from Chart.js 2.7.2.
	function lineEnabled(dataset, options) {
		return helpers.valueOrDefault(dataset.showLine, options.showLines);
	}

	return Chart.controllers.line.extend({

		datasetElementType: elements.StyleLine,

		dataElementType: elements.StylePoint,

		// Ported from Chart.js 2.7.2. Modified for style line.
		update: function(reset) {
			var me = this;
			var meta = me.getMeta();
			var line = meta.dataset;
			var points = meta.data || [];
			var options = me.chart.options;
			var lineElementOptions = options.elements.line;
			var scale = me.getScaleForId(meta.yAxisID);
			var i, ilen, custom;
			var dataset = me.getDataset();
			var showLine = lineEnabled(dataset, options);

			// Update Line
			if (showLine) {
				custom = line.custom || {};

				// Compatibility: If the properties are defined with only the old name, use those values
				if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) {
					dataset.lineTension = dataset.tension;
				}

				// Utility
				line._scale = scale;
				line._datasetIndex = me.index;
				// Data
				line._children = points;
				// Model
				line._model = {
					// Appearance
					// The default behavior of lines is to break at null values, according
					// to https://github.com/chartjs/Chart.js/issues/2435#issuecomment-216718158
					// This option gives lines the ability to span gaps
					spanGaps: dataset.spanGaps ? dataset.spanGaps : options.spanGaps,
					tension: custom.tension ? custom.tension : helpers.valueOrDefault(dataset.lineTension, lineElementOptions.tension),
					backgroundColor: custom.backgroundColor ? custom.backgroundColor : (dataset.backgroundColor || lineElementOptions.backgroundColor),
					borderWidth: custom.borderWidth ? custom.borderWidth : (dataset.borderWidth || lineElementOptions.borderWidth),
					borderColor: custom.borderColor ? custom.borderColor : (dataset.borderColor || lineElementOptions.borderColor),
					borderCapStyle: custom.borderCapStyle ? custom.borderCapStyle : (dataset.borderCapStyle || lineElementOptions.borderCapStyle),
					borderDash: custom.borderDash ? custom.borderDash : (dataset.borderDash || lineElementOptions.borderDash),
					borderDashOffset: custom.borderDashOffset ? custom.borderDashOffset : (dataset.borderDashOffset || lineElementOptions.borderDashOffset),
					borderJoinStyle: custom.borderJoinStyle ? custom.borderJoinStyle : (dataset.borderJoinStyle || lineElementOptions.borderJoinStyle),
					fill: custom.fill ? custom.fill : (dataset.fill !== undefined ? dataset.fill : lineElementOptions.fill),
					steppedLine: custom.steppedLine ? custom.steppedLine : helpers.valueOrDefault(dataset.steppedLine, lineElementOptions.stepped),
					cubicInterpolationMode: custom.cubicInterpolationMode ? custom.cubicInterpolationMode : helpers.valueOrDefault(dataset.cubicInterpolationMode, lineElementOptions.cubicInterpolationMode),

					shadowOffsetX: custom.shadowOffsetX ? custom.shadowOffsetX : (dataset.shadowOffsetX || lineElementOptions.shadowOffsetX),
					shadowOffsetY: custom.shadowOffsetY ? custom.shadowOffsetY : (dataset.shadowOffsetY || lineElementOptions.shadowOffsetY),
					shadowBlur: custom.shadowBlur ? custom.shadowBlur : (dataset.shadowBlur || lineElementOptions.shadowBlur),
					shadowColor: custom.shadowColor ? custom.shadowColor : (dataset.shadowColor || lineElementOptions.shadowColor)
				};

				line.pivot();
			}

			// Update Points
			for (i = 0, ilen = points.length; i < ilen; ++i) {
				me.updateElement(points[i], i, reset);
			}

			if (showLine && line._model.tension !== 0) {
				me.updateBezierControlPoints();
			}

			// Now pivot the point for animation
			for (i = 0, ilen = points.length; i < ilen; ++i) {
				points[i].pivot();
			}
		},

		getPointShadowOffsetX: function(point, index) {
			var shadowOffsetX = this.chart.options.elements.point.shadowOffsetX;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.shadowOffsetX) {
				shadowOffsetX = custom.shadowOffsetX;
			} else if (dataset.pointShadowOffsetX) {
				shadowOffsetX = helpers.valueAtIndexOrDefault(dataset.pointShadowOffsetX, index, shadowOffsetX);
			} else if (dataset.shadowOffsetX) {
				shadowOffsetX = dataset.shadowOffsetX;
			}

			return shadowOffsetX;
		},

		getPointShadowOffsetY: function(point, index) {
			var shadowOffsetY = this.chart.options.elements.point.shadowOffsetY;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.shadowOffsetY) {
				shadowOffsetY = custom.shadowOffsetY;
			} else if (dataset.pointShadowOffsetY) {
				shadowOffsetY = helpers.valueAtIndexOrDefault(dataset.pointShadowOffsetY, index, shadowOffsetY);
			} else if (dataset.shadowOffsetY) {
				shadowOffsetY = dataset.shadowOffsetY;
			}

			return shadowOffsetY;
		},

		getPointShadowBlur: function(point, index) {
			var shadowBlur = this.chart.options.elements.point.shadowBlur;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.shadowBlur) {
				shadowBlur = custom.shadowBlur;
			} else if (dataset.pointShadowBlur) {
				shadowBlur = helpers.valueAtIndexOrDefault(dataset.pointShadowBlur, index, shadowBlur);
			} else if (dataset.shadowBlur) {
				shadowBlur = dataset.shadowBlur;
			}

			return shadowBlur;
		},

		getPointShadowColor: function(point, index) {
			var shadowColor = this.chart.options.elements.point.shadowColor;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.shadowColor) {
				shadowColor = custom.shadowColor;
			} else if (dataset.pointShadowColor) {
				shadowColor = helpers.valueAtIndexOrDefault(dataset.pointShadowColor, index, shadowColor);
			} else if (dataset.shadowColor) {
				shadowColor = dataset.shadowColor;
			}

			return shadowColor;
		},

		getPointBevelWidth: function(point, index) {
			var bevelWidth = this.chart.options.elements.point.bevelWidth;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.bevelWidth) {
				bevelWidth = custom.bevelWidth;
			} else if (dataset.pointBevelWidth) {
				bevelWidth = helpers.valueAtIndexOrDefault(dataset.pointBevelWidth, index, bevelWidth);
			} else if (dataset.bevelWidth) {
				bevelWidth = dataset.bevelWidth;
			}

			return bevelWidth;
		},

		getPointBevelHighlightColor: function(point, index) {
			var bevelHighlightColor = this.chart.options.elements.point.bevelHighlightColor;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.bevelHighlightColor) {
				bevelHighlightColor = custom.bevelHighlightColor;
			} else if (dataset.pointBevelHighlightColor) {
				bevelHighlightColor = helpers.valueAtIndexOrDefault(dataset.pointBevelHighlightColor, index, bevelHighlightColor);
			} else if (dataset.bevelHighlightColor) {
				bevelHighlightColor = dataset.bevelHighlightColor;
			}

			return bevelHighlightColor;
		},

		getPointBevelShadowColor: function(point, index) {
			var bevelShadowColor = this.chart.options.elements.point.bevelShadowColor;
			var dataset = this.getDataset();
			var custom = point.custom || {};

			if (custom.bevelShadowColor) {
				bevelShadowColor = custom.bevelShadowColor;
			} else if (dataset.pointBevelShadowColor) {
				bevelShadowColor = helpers.valueAtIndexOrDefault(dataset.pointBevelShadowColor, index, bevelShadowColor);
			} else if (dataset.bevelShadowColor) {
				bevelShadowColor = dataset.bevelShadowColor;
			}

			return bevelShadowColor;
		},

		updateElement: function(point, index) {
			LineController.prototype.updateElement.apply(this, arguments);

			var me = this;

			point._model.shadowOffsetX = me.getPointShadowOffsetX(point, index);
			point._model.shadowOffsetY = me.getPointShadowOffsetY(point, index);
			point._model.shadowBlur = me.getPointShadowBlur(point, index);
			point._model.shadowColor = me.getPointShadowColor(point, index);
			point._model.bevelWidth = me.getPointBevelWidth(point, index);
			point._model.bevelHighlightColor = me.getPointBevelHighlightColor(point, index);
			point._model.bevelShadowColor = me.getPointBevelShadowColor(point, index);
		},

		setHoverStyle: function(element) {
			LineController.prototype.setHoverStyle.apply(this, arguments);

			// Point
			var dataset = this.chart.data.datasets[element._datasetIndex];
			var index = element._index;
			var custom = element.custom || {};
			var valueOrDefault = helpers.valueAtIndexOrDefault;
			var model = element._model;

			if (element.$previousStyle) {
				element.$previousStyle.shadowOffsetX = model.shadowOffsetX;
				element.$previousStyle.shadowOffsetY = model.shadowOffsetY;
				element.$previousStyle.shadowBlur = model.shadowBlur;
				element.$previousStyle.shadowColor = model.shadowColor;
				element.$previousStyle.bevelWidth = model.bevelWidth;
				element.$previousStyle.bevelHighlightColor = model.bevelHighlightColor;
				element.$previousStyle.bevelShadowColor = model.bevelShadowColor;
			}

			model.shadowOffsetX = custom.hoverShadowOffsetX || valueOrDefault(dataset.pointHoverShadowOffsetX, index, model.shadowOffsetX);
			model.shadowOffsetY = custom.hoverShadowOffsetY || valueOrDefault(dataset.pointHoverShadowOffsetY, index, model.shadowOffsetY);
			model.shadowBlur = custom.hoverShadowBlur || valueOrDefault(dataset.pointHoverShadowBlur, index, model.shadowBlur);
			model.shadowColor = custom.hoverShadowColor || valueOrDefault(dataset.pointHoverShadowColor, index, helpers.getHoverColor(model.shadowColor));
			model.bevelWidth = custom.hoverBevelWidth || valueOrDefault(dataset.pointHoverBevelWidth, index, model.bevelWidth);
			model.bevelHighlightColor = custom.hoverBevelHighlightColor || valueOrDefault(dataset.pointHoverBevelHighlightColor, index, helpers.getHoverColor(model.bevelHighlightColor));
			model.bevelShadowColor = custom.hoverBevelShadowColor || valueOrDefault(dataset.pointHoverBevelShadowColor, index, helpers.getHoverColor(model.bevelShadowColor));
		},

		removeHoverStyle: function(element) {
			var me = this;
			var index = element._index;
			var model = element._model;

			// For Chart.js 2.7.2 backward compatibility
			if (!element.$previousStyle) {
				model.shadowOffsetX = me.getPointShadowOffsetX(element, index);
				model.shadowOffsetY = me.getPointShadowOffsetY(element, index);
				model.shadowBlur = me.getPointShadowBlur(element, index);
				model.shadowColor = me.getPointShadowColor(element, index);
				model.bevelWidth = me.getPointBevelWidth(element, index);
				model.bevelHighlightColor = me.getPointBevelHighlightColor(element, index);
				model.bevelShadowColor = me.getPointBevelShadowColor(element, index);
			}

			LineController.prototype.removeHoverStyle.apply(this, arguments);
		}
	});
}
