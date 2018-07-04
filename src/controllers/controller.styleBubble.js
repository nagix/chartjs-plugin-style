'use strict';

export default function(Chart) {

	var elements = Chart.elements;
	var helpers = Chart.helpers;

	var BubbleController = Chart.controllers.bubble;

	return Chart.controllers.bubble.extend({

		dataElementType: elements.StylePoint,

		/**
		 * Ported from Chart.js 2.7.2. Modified for style bubble.
		 * @protected
		 */
		updateElement: function(point, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var custom = point.custom || {};
			var xScale = me.getScaleForId(meta.xAxisID);
			var yScale = me.getScaleForId(meta.yAxisID);
			var options = me._resolveElementOptions(point, index);
			var data = me.getDataset().data[index];
			var dsIndex = me.index;

			var x = reset ? xScale.getPixelForDecimal(0.5) : xScale.getPixelForValue(typeof data === 'object' ? data : NaN, index, dsIndex);
			var y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(data, index, dsIndex);

			point._xScale = xScale;
			point._yScale = yScale;
			point._options = options;
			point._datasetIndex = dsIndex;
			point._index = index;
			point._model = {
				backgroundColor: options.backgroundColor,
				borderColor: options.borderColor,
				borderWidth: options.borderWidth,
				hitRadius: options.hitRadius,
				pointStyle: options.pointStyle,
				radius: reset ? 0 : options.radius,
				skip: custom.skip || isNaN(x) || isNaN(y),
				x: x,
				y: y,

				shadowOffsetX: options.shadowOffsetX,
				shadowOffsetY: options.shadowOffsetY,
				shadowBlur: options.shadowBlur,
				shadowColor: options.shadowColor
			};

			point.pivot();
		},

		/**
		 * @protected
		 */
		setHoverStyle: function(element) {
			BubbleController.prototype.setHoverStyle.apply(this, arguments);

			var valueOrDefault = helpers.valueOrDefault;
			var model = element._model;
			var options = element._options;

			if (element.$previousStyle) {
				element.$previousStyle.shadowOffsetX = model.shadowOffsetX;
				element.$previousStyle.shadowOffsetY = model.shadowOffsetY;
				element.$previousStyle.shadowBlur = model.shadowBlur;
				element.$previousStyle.shadowColor = model.shadowColor;
			}

			model.shadowOffsetX = valueOrDefault(options.hoverShadowOffsetX, options.shadowOffsetX);
			model.shadowOffsetY = valueOrDefault(options.hoverShadowOffsetY, options.shadowOffsetY);
			model.shadowBlur = valueOrDefault(options.hoverShadowBlur, options.shadowBlur);
			model.shadowColor = valueOrDefault(options.hoverShadowColor, helpers.getHoverColor(options.shadowColor));
		},

		/**
		 * @protected
		 */
		removeHoverStyle: function(element) {
			var model = element._model;
			var options = element._options;

			// For Chart.js 2.7.2 backward compatibility
			if (!element.$previousStyle) {
				model.shadowOffsetX = options.shadowOffsetX;
				model.shadowOffsetY = options.shadowOffsetY;
				model.shadowBlur = options.shadowBlur;
				model.shadowColor = options.shadowColor;
			}

			BubbleController.prototype.removeHoverStyle.apply(this, arguments);
		},

		/**
		 * Ported from Chart.js 2.7.2. Modified for style bubble.
		 * @private
		 */
		_resolveElementOptions: function(point, index) {
			var me = this;
			var chart = me.chart;
			var datasets = chart.data.datasets;
			var dataset = datasets[me.index];
			var custom = point.custom || {};
			var options = chart.options.elements.point;
			var resolve = helpers.options.resolve;
			var data = dataset.data[index];
			var values = {};
			var i, ilen, key;

			// Scriptable options
			var context = {
				chart: chart,
				dataIndex: index,
				dataset: dataset,
				datasetIndex: me.index
			};

			var keys = [
				'backgroundColor',
				'borderColor',
				'borderWidth',
				'hoverBackgroundColor',
				'hoverBorderColor',
				'hoverBorderWidth',
				'hoverRadius',
				'hitRadius',
				'pointStyle',
				'shadowOffsetX',
				'shadowOffsetY',
				'shadowBlur',
				'shadowColor',
				'hoverShadowOffsetX',
				'hoverShadowOffsetY',
				'hoverShadowBlur',
				'hoverShadowColor'
			];

			for (i = 0, ilen = keys.length; i < ilen; ++i) {
				key = keys[i];
				values[key] = resolve([
					custom[key],
					dataset[key],
					options[key]
				], context, index);
			}

			// Custom radius resolution
			values.radius = resolve([
				custom.radius,
				data ? data.r : undefined,
				dataset.radius,
				options.radius
			], context, index);

			return values;
		}
	});
}
