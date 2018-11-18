'use strict';

export default function(Chart) {

	var elements = Chart.elements;
	var helpers = Chart.helpers;

	var BarController = Chart.controllers.bar;

	return Chart.controllers.bar.extend({

		dataElementType: elements.StyleRectangle,

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
				backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.valueAtIndexOrDefault(dataset.backgroundColor, index, rectangleOptions.backgroundColor),
				borderColor: custom.borderColor ? custom.borderColor : helpers.valueAtIndexOrDefault(dataset.borderColor, index, rectangleOptions.borderColor),
				borderWidth: custom.borderWidth ? custom.borderWidth : helpers.valueAtIndexOrDefault(dataset.borderWidth, index, rectangleOptions.borderWidth),

				shadowOffsetX: custom.shadowOffsetX ? custom.shadowOffsetX : helpers.valueAtIndexOrDefault(dataset.shadowOffsetX, index, rectangleOptions.shadowOffsetX),
				shadowOffsetY: custom.shadowOffsetY ? custom.shadowOffsetY : helpers.valueAtIndexOrDefault(dataset.shadowOffsetY, index, rectangleOptions.shadowOffsetY),
				shadowBlur: custom.shadowBlur ? custom.shadowBlur : helpers.valueAtIndexOrDefault(dataset.shadowBlur, index, rectangleOptions.shadowBlur),
				shadowColor: custom.shadowColor ? custom.shadowColor : helpers.valueAtIndexOrDefault(dataset.shadowColor, index, rectangleOptions.shadowColor),
				bevelWidth: custom.bevelWidth ? custom.bevelWidth : helpers.valueAtIndexOrDefault(dataset.bevelWidth, index, rectangleOptions.bevelWidth),
				bevelHighlightColor: custom.bevelHighlightColor ? custom.bevelHighlightColor : helpers.valueAtIndexOrDefault(dataset.bevelHighlightColor, index, rectangleOptions.bevelHighlightColor),
				bevelShadowColor: custom.bevelShadowColor ? custom.bevelShadowColor : helpers.valueAtIndexOrDefault(dataset.bevelShadowColor, index, rectangleOptions.bevelShadowColor),
				innerGlowWidth: custom.innerGlowWidth ? custom.innerGlowWidth : helpers.valueAtIndexOrDefault(dataset.innerGlowWidth, index, rectangleOptions.innerGlowWidth),
				innerGlowColor: custom.innerGlowColor ? custom.innerGlowColor : helpers.valueAtIndexOrDefault(dataset.innerGlowColor, index, rectangleOptions.innerGlowColor),
				outerGlowWidth: custom.outerGlowWidth ? custom.outerGlowWidth : helpers.valueAtIndexOrDefault(dataset.outerGlowWidth, index, rectangleOptions.outerGlowWidth),
				outerGlowColor: custom.outerGlowColor ? custom.outerGlowColor : helpers.valueAtIndexOrDefault(dataset.outerGlowColor, index, rectangleOptions.outerGlowColor)
			};

			me.updateElementGeometry(rectangle, index, reset);

			rectangle.pivot();
		},

		setHoverStyle: function(element) {
			BarController.prototype.setHoverStyle.apply(this, arguments);

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
				element.$previousStyle.innerGlowWidth = model.innerGlowWidth;
				element.$previousStyle.innerGlowColor = model.innerGlowColor;
				element.$previousStyle.outerGlowWidth = model.outerGlowWidth;
				element.$previousStyle.outerGlowColor = model.outerGlowColor;
			}

			model.shadowOffsetX = custom.hoverShadowOffsetX ? custom.hoverShadowOffsetX : valueOrDefault(dataset.hoverShadowOffsetX, index, model.shadowOffsetX);
			model.shadowOffsetY = custom.hoverShadowOffsetY ? custom.hoverShadowOffsetY : valueOrDefault(dataset.hoverShadowOffsetY, index, model.shadowOffsetY);
			model.shadowBlur = custom.hoverShadowBlur ? custom.hoverShadowBlur : valueOrDefault(dataset.hoverShadowBlur, index, model.shadowBlur);
			model.shadowColor = custom.hoverShadowColor ? custom.hoverShadowColor : valueOrDefault(dataset.hoverShadowColor, index, helpers.getHoverColor(model.shadowColor));
			model.bevelWidth = custom.hoverBevelWidth ? custom.hoverBevelWidth : valueOrDefault(dataset.hoverBevelWidth, index, model.bevelWidth);
			model.bevelHighlightColor = custom.hoverBevelHighlightColor ? custom.hoverBevelHighlightColor : valueOrDefault(dataset.hoverBevelHighlightColor, index, helpers.getHoverColor(model.bevelHighlightColor));
			model.bevelShadowColor = custom.hoverBevelShadowColor ? custom.hoverBevelShadowColor : valueOrDefault(dataset.hoverBevelShadowColor, index, helpers.getHoverColor(model.bevelShadowColor));
			model.innerGlowWidth = custom.hoverInnerGlowWidth ? custom.hoverInnerGlowWidth : valueOrDefault(dataset.hoverInnerGlowWidth, index, model.innerGlowWidth);
			model.innerGlowColor = custom.hoverInnerGlowColor ? custom.hoverInnerGlowColor : valueOrDefault(dataset.hoverInnerGlowColor, index, helpers.getHoverColor(model.innerGlowColor));
			model.outerGlowWidth = custom.hoverOuterGlowWidth ? custom.hoverOuterGlowWidth : valueOrDefault(dataset.hoverOuterGlowWidth, index, model.outerGlowWidth);
			model.outerGlowColor = custom.hoverOuterGlowColor ? custom.hoverOuterGlowColor : valueOrDefault(dataset.hoverOuterGlowColor, index, helpers.getHoverColor(model.outerGlowColor));
		},

		removeHoverStyle: function(element) {
			var dataset = this.chart.data.datasets[element._datasetIndex];
			var index = element._index;
			var custom = element.custom || {};
			var valueOrDefault = helpers.valueAtIndexOrDefault;
			var model = element._model;
			var elementOpts = this.chart.options.elements.rectangle;

			// For Chart.js 2.7.2 backward compatibility
			if (!element.$previousStyle) {
				model.shadowOffsetX = custom.shadowOffsetX ? custom.shadowOffsetX : valueOrDefault(dataset.shadowOffsetX, index, elementOpts.shadowOffsetX);
				model.shadowOffsetY = custom.shadowOffsetY ? custom.shadowOffsetY : valueOrDefault(dataset.shadowOffsetY, index, elementOpts.shadowOffsetY);
				model.shadowBlur = custom.shadowBlur ? custom.shadowBlur : valueOrDefault(dataset.shadowBlur, index, elementOpts.shadowBlur);
				model.shadowColor = custom.shadowColor ? custom.shadowColor : valueOrDefault(dataset.shadowColor, index, elementOpts.shadowColor);
				model.bevelWidth = custom.bevelWidth ? custom.bevelWidth : valueOrDefault(dataset.bevelWidth, index, elementOpts.bevelWidth);
				model.bevelHighlightColor = custom.bevelHighlightColor ? custom.bevelHighlightColor : valueOrDefault(dataset.bevelHighlightColor, index, elementOpts.bevelHighlightColor);
				model.bevelShadowColor = custom.bevelShadowColor ? custom.bevelShadowColor : valueOrDefault(dataset.bevelShadowColor, index, elementOpts.bevelShadowColor);
				model.innerGlowWidth = custom.innerGlowWidth ? custom.innerGlowWidth : valueOrDefault(dataset.innerGlowWidth, index, elementOpts.innerGlowWidth);
				model.innerGlowColor = custom.innerGlowColor ? custom.innerGlowColor : valueOrDefault(dataset.innerGlowColor, index, elementOpts.innerGlowColor);
				model.outerGlowWidth = custom.outerGlowWidth ? custom.outerGlowWidth : valueOrDefault(dataset.outerGlowWidth, index, elementOpts.outerGlowWidth);
				model.outerGlowColor = custom.outerGlowColor ? custom.outerGlowColor : valueOrDefault(dataset.outerGlowColor, index, elementOpts.outerGlowColor);
			}

			BarController.prototype.removeHoverStyle.apply(this, arguments);
		}
	});
}
