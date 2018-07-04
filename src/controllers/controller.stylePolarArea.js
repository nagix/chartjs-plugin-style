'use strict';

export default function(Chart) {

	var elements = Chart.elements;
	var helpers = Chart.helpers;

	// Ported from Chart.js 2.7.2. Modified for style tooltip.
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

		// Ported from Chart.js 2.7.2. Modified for style bar.
		updateElement: function(arc, index, reset) {
			var me = this;
			var chart = me.chart;
			var dataset = me.getDataset();
			var opts = chart.options;
			var animationOpts = opts.animation;
			var scale = chart.scale;
			var labels = chart.data.labels;

			// For Chart.js 2.7.2 backward compatibility
			var circumference = me.calculateCircumference(dataset.data[index]);

			var centerX = scale.xCenter;
			var centerY = scale.yCenter;

			// For Chart.js 2.7.2 backward compatibility
			// If there is NaN data before us, we need to calculate the starting angle correctly.
			// We could be way more efficient here, but its unlikely that the polar area chart will have a lot of data
			var visibleCount = 0;
			var meta = me.getMeta();
			for (var i = 0; i < index; ++i) {
				if (!isNaN(dataset.data[i]) && !meta.data[i].hidden) {
					++visibleCount;
				}
			}

			// var negHalfPI = -0.5 * Math.PI;
			var datasetStartAngle = opts.startAngle;
			var distance = arc.hidden ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);

			// For Chart.js 2.7.2 backward compatibility
			var startAngle = circumference ? datasetStartAngle + (circumference * visibleCount) : me._starts[index];
			var endAngle = startAngle + (arc.hidden ? 0 : (circumference || me._angles[index]));

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
			}

			model.shadowOffsetX = custom.hoverShadowOffsetX ? custom.hoverShadowOffsetX : valueOrDefault(dataset.hoverShadowOffsetX, index, model.shadowOffsetX);
			model.shadowOffsetY = custom.hoverShadowOffsetY ? custom.hoverShadowOffsetY : valueOrDefault(dataset.hoverShadowOffsetY, index, model.shadowOffsetY);
			model.shadowBlur = custom.hoverShadowBlur ? custom.hoverShadowBlur : valueOrDefault(dataset.hoverShadowBlur, index, model.shadowBlur);
			model.shadowColor = custom.hoverShadowColor ? custom.hoverShadowColor : valueOrDefault(dataset.hoverShadowColor, index, helpers.getHoverColor(model.shadowColor));
		},

		removeHoverStyle: function(element) {
			var dataset = this.chart.data.datasets[element._datasetIndex];
			var index = element._index;
			var custom = element.custom || {};
			var valueOrDefault = helpers.valueAtIndexOrDefault;
			var model = element._model;

			// For Chart.js 2.7.2 backward compatibility
			if (!element.$previousStyle) {
				model.shadowOffsetX = custom.shadowOffsetX ? custom.shadowOffsetX : valueOrDefault(dataset.shadowOffsetX, index, model.shadowOffsetX);
				model.shadowOffsetY = custom.shadowOffsetY ? custom.shadowOffsetY : valueOrDefault(dataset.shadowOffsetY, index, model.shadowOffsetY);
				model.shadowBlur = custom.shadowBlur ? custom.shadowBlur : valueOrDefault(dataset.shadowBlur, index, model.shadowBlur);
				model.shadowColor = custom.shadowColor ? custom.shadowColor : valueOrDefault(dataset.shadowColor, index, model.shadowColor);
			}

			PolarAreaController.prototype.removeHoverStyle.apply(this, arguments);
		}
	});
}
