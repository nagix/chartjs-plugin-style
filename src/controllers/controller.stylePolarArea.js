'use strict';

import Chart from 'chart.js';
import StyleArc from '../elements/element.styleArc';
import optionsHelpers from '../helpers/helpers.options';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var extend = helpers.extend;
var resolve = optionsHelpers.resolve;

// Ported from Chart.js 2.7.3. Modified for style polarArea.
Chart.defaults.polarArea.legend.labels.generateLabels = function(chart) {
	var data = chart.data;
	if (data.labels.length && data.datasets.length) {
		return data.labels.map(function(label, i) {
			var meta = chart.getDatasetMeta(0);
			var ds = data.datasets[0];
			var arc = meta.data[i] || {};
			var custom = arc.custom || {};
			var arcOpts = chart.options.elements.arc;
			var fill = resolve([custom.backgroundColor, ds.backgroundColor, arcOpts.backgroundColor], undefined, i);
			var stroke = resolve([custom.borderColor, ds.borderColor, arcOpts.borderColor], undefined, i);
			var bw = resolve([custom.borderWidth, ds.borderWidth, arcOpts.borderWidth], undefined, i);

			return extend({
				text: label,
				fillStyle: fill,
				strokeStyle: stroke,
				lineWidth: bw,
				hidden: isNaN(ds.data[i]) || meta.data[i].hidden,

				// Extra data used for toggling the correct item
				index: i
			}, arc._styleOptions || styleHelpers.resolveStyle(meta.controller, arc, i, arcOpts));
		});
	}
	return [];
};

var PolarAreaController = Chart.controllers.polarArea;

export default PolarAreaController.extend({

	dataElementType: StyleArc,

	updateElement: function(arc, index) {
		var me = this;
		var options = styleHelpers.resolveStyle(me, arc, index, me.chart.options.elements.arc);
		var model = {};

		Object.defineProperty(arc, '_model', {
			configurable: true,
			get: function() {
				return model;
			},
			set: function(value) {
				extend(model, value, options);
			}
		});

		PolarAreaController.prototype.updateElement.apply(me, arguments);

		delete arc._model;
		arc._model = model;
		arc._styleOptions = options;
	},

	setHoverStyle: function(element) {
		var me = this;

		PolarAreaController.prototype.setHoverStyle.apply(me, arguments);

		styleHelpers.saveStyle(element);
		styleHelpers.setHoverStyle(element._model, element._styleOptions);
	},

	removeHoverStyle: function(element) {
		var me = this;

		// For Chart.js 2.7.2 backward compatibility
		if (!element.$previousStyle) {
			styleHelpers.mergeStyle(element._model, element._styleOptions);
		}

		PolarAreaController.prototype.removeHoverStyle.apply(me, arguments);
	}
});
