'use strict';

import Chart from '../core/core.js';
import StyleArc from '../elements/element.styleArc';
import styleHelpers from '../helpers/helpers.style';

var defaults = Chart.defaults;
var helpers = Chart.helpers;

var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;

// Ported from Chart.js 2.7.3. Modified for style doughnut.
defaults.doughnut.legend.labels.generateLabels = defaults.pie.legend.labels.generateLabels = function(chart) {
	var data = chart.data;
	if (data.labels.length && data.datasets.length) {
		return data.labels.map(function(label, i) {
			var meta = chart.getDatasetMeta(0);
			var ds = data.datasets[0];
			var arc = meta.data[i];
			var custom = arc && arc.custom || {};
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

var DoughnutController = Chart.controllers.doughnut;

export default DoughnutController.extend({

	dataElementType: StyleArc,

	// Ported from Chart.js 2.7.3. Modified for style doughnut.
	updateElement: function(arc, index, reset) {
		var me = this;
		var chart = me.chart;
		var chartArea = chart.chartArea;
		var opts = chart.options;
		var animationOpts = opts.animation;
		var centerX = (chartArea.left + chartArea.right) / 2;
		var centerY = (chartArea.top + chartArea.bottom) / 2;
		var startAngle = opts.rotation; // non reset case handled later
		var endAngle = opts.rotation; // non reset case handled later
		var dataset = me.getDataset();
		var circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : me.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI));
		var innerRadius = reset && animationOpts.animateScale ? 0 : me.innerRadius;
		var outerRadius = reset && animationOpts.animateScale ? 0 : me.outerRadius;

		helpers.extend(arc, {
			// Utility
			_datasetIndex: me.index,
			_index: index,

			// Desired view properties
			_model: {
				x: centerX + chart.offsetX,
				y: centerY + chart.offsetY,
				startAngle: startAngle,
				endAngle: endAngle,
				circumference: circumference,
				outerRadius: outerRadius,
				innerRadius: innerRadius,
				label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
			}
		});

		var model = arc._model;

		// Resets the visual styles
		var custom = arc.custom || {};
		var elementOpts = this.chart.options.elements.arc;
		model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(dataset.backgroundColor, index, elementOpts.backgroundColor);
		model.borderColor = custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(dataset.borderColor, index, elementOpts.borderColor);
		model.borderWidth = custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(dataset.borderWidth, index, elementOpts.borderWidth);

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

		// Set correct angles if not resetting
		if (!reset || !animationOpts.animateRotate) {
			if (index === 0) {
				model.startAngle = opts.rotation;
			} else {
				model.startAngle = me.getMeta().data[index - 1]._model.endAngle;
			}

			model.endAngle = model.startAngle + model.circumference;
		}

		arc.pivot();
	},

	setHoverStyle: function(element) {
		DoughnutController.prototype.setHoverStyle.apply(this, arguments);
		styleHelpers.setHoverStyle(this.chart, element);
	},

	removeHoverStyle: function(element) {
		styleHelpers.removeHoverStyle(this.chart, element, 'arc');
		DoughnutController.prototype.removeHoverStyle.apply(this, arguments);
	}
});
