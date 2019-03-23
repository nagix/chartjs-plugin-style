'use strict';

import Chart from 'chart.js';
import StyleArc from '../elements/element.styleArc';
import optionsHelpers from '../helpers/helpers.options';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var resolve = optionsHelpers.resolve;

// Ported from Chart.js 2.7.3. Modified for style polarArea.
Chart.defaults.polarArea.legend.labels.generateLabels = function(chart) {
	var data = chart.data;
	if (data.labels.length && data.datasets.length) {
		return data.labels.map(function(label, i) {
			var meta = chart.getDatasetMeta(0);
			var ds = data.datasets[0];
			var arc = meta.data[i];
			var custom = arc.custom || {};
			var arcOpts = chart.options.elements.arc;
			var fill = resolve([custom.backgroundColor, ds.backgroundColor, arcOpts.backgroundColor], undefined, i);
			var stroke = resolve([custom.borderColor, ds.borderColor, arcOpts.borderColor], undefined, i);
			var bw = resolve([custom.borderWidth, ds.borderWidth, arcOpts.borderWidth], undefined, i);

			return helpers.merge({
				text: label,
				fillStyle: fill,
				strokeStyle: stroke,
				lineWidth: bw,
				hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

				// Extra data used for toggling the correct item
				index: i
			}, styleHelpers.resolveStyle(chart, arc, i, arcOpts));
		});
	}
	return [];
};

var PolarAreaController = Chart.controllers.polarArea;

export default PolarAreaController.extend({

	dataElementType: StyleArc,

	updateElement: function(arc, index) {
		var me = this;
		var chart = me.chart;
		var model = {};

		Object.defineProperty(arc, '_model', {
			configurable: true,
			get: function() {
				return model;
			},
			set: function(value) {
				helpers.merge(model, [value, styleHelpers.resolveStyle(chart, arc, index, chart.options.elements.arc)]);
			}
		});

		PolarAreaController.prototype.updateElement.apply(me, arguments);

		delete arc._model;
		arc._model = model;
	},

	setHoverStyle: function(element) {
		var me = this;
		var model = element._model;

		PolarAreaController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		helpers.merge(model, styleHelpers.resolveStyle(me.chart, element, element._index, model, true));
	},

	removeHoverStyle: function(element) {
		var me = this;
		var chart = me.chart;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			helpers.merge(element._model, styleHelpers.resolveStyle(chart, element, element._index, chart.options.elements.arc));
		}

		PolarAreaController.prototype.removeHoverStyle.apply(me, arguments);
	}
});
