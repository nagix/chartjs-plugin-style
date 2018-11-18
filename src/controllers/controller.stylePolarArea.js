'use strict';

export default function(Chart) {

	var elements = Chart.elements;
	var helpers = Chart.helpers;

	// Ported from Chart.js 2.7.3. Modified for style polarArea.
	Chart.defaults.doughnut.legend.labels.generateLabels = function(chart) {
		var data = chart.data;
		if (data.labels.length && data.datasets.length) {
			return data.labels.map(function(label, i) {
				var meta = chart.getDatasetMeta(0);
				var ds = data.datasets[0];
				var arc = meta.data[i];
				var custom = arc.custom || {};
				var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;
				var arcOpts = chart.options.elements.arc;
				var fill = custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
				var stroke = custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
				var bw = custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

				return {
					text: label,
					fillStyle: fill,
					strokeStyle: stroke,
					lineWidth: bw,
					hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

					shadowOffsetX: custom.shadowOffsetX ? custom.shadowOffsetX : valueAtIndexOrDefault(ds.shadowOffsetX, i, arcOpts.shadowOffsetX),
					shadowOffsetY: custom.shadowOffsetY ? custom.shadowOffsetY : valueAtIndexOrDefault(ds.shadowOffsetY, i, arcOpts.shadowOffsetY),
					shadowBlur: custom.shadowBlur ? custom.shadowBlur : valueAtIndexOrDefault(ds.shadowBlur, i, arcOpts.shadowBlur),
					shadowColor: custom.shadowColor ? custom.shadowColor : valueAtIndexOrDefault(ds.shadowColor, i, arcOpts.shadowColor),
					bevelWidth: custom.bevelWidth ? custom.bevelWidth : valueAtIndexOrDefault(ds.bevelWidth, i, arcOpts.bevelWidth),
					bevelHighlightColor: custom.bevelHighlightColor ? custom.bevelHighlightColor : valueAtIndexOrDefault(ds.bevelHighlightColor, i, arcOpts.bevelHighlightColor),
					bevelShadowColor: custom.bevelShadowColor ? custom.bevelShadowColor : valueAtIndexOrDefault(ds.bevelShadowColor, i, arcOpts.bevelShadowColor),
					innerGlowWidth: custom.innerGlowWidth ? custom.innerGlowWidth : valueAtIndexOrDefault(ds.innerGlowWidth, i, arcOpts.innerGlowWidth),
					innerGlowColor: custom.innerGlowColor ? custom.innerGlowColor : valueAtIndexOrDefault(ds.innerGlowColor, i, arcOpts.innerGlowColor),
					outerGlowWidth: custom.outerGlowWidth ? custom.outerGlowWidth : valueAtIndexOrDefault(ds.outerGlowWidth, i, arcOpts.outerGlowWidth),
					outerGlowColor: custom.outerGlowColor ? custom.outerGlowColor : valueAtIndexOrDefault(ds.outerGlowColor, i, arcOpts.outerGlowColor),

					// Extra data used for toggling the correct item
					index: i
				};
			});
		}
		return [];
	};

	var PolarAreaController = Chart.controllers.polarArea;

	return Chart.controllers.polarArea.extend({

		dataElementType: elements.StyleArc,

		// Ported from Chart.js 2.7.3. Modified for style polarArea.
		updateElement: function(arc, index, reset) {
			var me = this;
			var chart = me.chart;
			var dataset = me.getDataset();
			var opts = chart.options;
			var animationOpts = opts.animation;
			var scale = chart.scale;
			var labels = chart.data.labels;

			var centerX = scale.xCenter;
			var centerY = scale.yCenter;

			// var negHalfPI = -0.5 * Math.PI;
			var datasetStartAngle = opts.startAngle;
			var distance = arc.hidden ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);

			// For Chart.js 2.7.2 backward compatibility
			var startAngle, endAngle;
			if (me.calculateCircumference) {
				var circumference = me.calculateCircumference(dataset.data[index]);

				// If there is NaN data before us, we need to calculate the starting angle correctly.
				// We could be way more efficient here, but its unlikely that the polar area chart will have a lot of data
				var visibleCount = 0;
				var meta = me.getMeta();
				for (var i = 0; i < index; ++i) {
					if (!isNaN(dataset.data[i]) && !meta.data[i].hidden) {
						++visibleCount;
					}
				}

				startAngle = datasetStartAngle + (circumference * visibleCount);
				endAngle = startAngle + (arc.hidden ? 0 : circumference);
			} else {
				startAngle = me._starts[index];
				endAngle = startAngle + (arc.hidden ? 0 : me._angles[index]);
			}

			var resetRadius = animationOpts.animateScale ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);

			helpers.extend(arc, {
				// Utility
				_datasetIndex: me.index,
				_index: index,
				_scale: scale,

				// Desired view properties
				_model: {
					x: centerX,
					y: centerY,
					innerRadius: 0,
					outerRadius: reset ? resetRadius : distance,
					startAngle: reset && animationOpts.animateRotate ? datasetStartAngle : startAngle,
					endAngle: reset && animationOpts.animateRotate ? datasetStartAngle : endAngle,
					label: helpers.valueAtIndexOrDefault(labels, index, labels[index])
				}
			});

			// Apply border and fill style
			var elementOpts = this.chart.options.elements.arc;
			var custom = arc.custom || {};
			var valueOrDefault = helpers.valueAtIndexOrDefault;
			var model = arc._model;

			model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueOrDefault(dataset.backgroundColor, index, elementOpts.backgroundColor);
			model.borderColor = custom.borderColor ? custom.borderColor : valueOrDefault(dataset.borderColor, index, elementOpts.borderColor);
			model.borderWidth = custom.borderWidth ? custom.borderWidth : valueOrDefault(dataset.borderWidth, index, elementOpts.borderWidth);

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

			arc.pivot();
		},

		setHoverStyle: function(element) {
			PolarAreaController.prototype.setHoverStyle.apply(this, arguments);

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
			var elementOpts = this.chart.options.elements.arc;

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

			PolarAreaController.prototype.removeHoverStyle.apply(this, arguments);
		}
	});
}
