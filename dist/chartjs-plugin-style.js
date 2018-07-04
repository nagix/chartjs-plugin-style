/*
 * @license
 * chartjs-plugin-style
 * https://github.com/nagix/chartjs-plugin-style/
 * Version: 0.1.0
 *
 * Copyright 2018 Akihiko Kusanagi
 * Released under the MIT license
 * https://github.com/nagix/chartjs-plugin-style/blob/master/LICENSE.md
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chart.js')) :
	typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
	(factory(global.Chart));
}(this, (function (Chart) { 'use strict';

Chart = Chart && Chart.hasOwnProperty('default') ? Chart['default'] : Chart;

'use strict';

var StyleArcElement = function(Chart$$1) {

	return Chart$$1.elements.Arc.extend({

		// Ported from Chart.js 2.7.2. Modified for style tooltip.
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;
			var sA = vm.startAngle;
			var eA = vm.endAngle;

			ctx.beginPath();

			ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
			ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);

			ctx.closePath();
			ctx.strokeStyle = vm.borderColor;
			ctx.lineWidth = vm.borderWidth;

			ctx.fillStyle = vm.backgroundColor;

			ctx.save();

			ctx.shadowOffsetX = vm.shadowOffsetX;
			ctx.shadowOffsetY = vm.shadowOffsetY;
			ctx.shadowBlur = vm.shadowBlur;
			ctx.shadowColor = vm.shadowColor;

			ctx.fill();

			ctx.restore();

			ctx.lineJoin = 'bevel';

			if (vm.borderWidth) {
				ctx.stroke();
			}
		}

	});
};

'use strict';

var StyleLineElement = function(Chart$$1) {

	return Chart$$1.elements.Line.extend({

		draw: function() {
			var me = this;
			var vm = me._view;
			var ctx = me._chart.ctx;

			ctx.save();

			ctx.shadowOffsetX = vm.shadowOffsetX;
			ctx.shadowOffsetY = vm.shadowOffsetY;
			ctx.shadowBlur = vm.shadowBlur;
			ctx.shadowColor = vm.shadowColor;

			Chart$$1.elements.Line.prototype.draw.apply(me, arguments);

			ctx.restore();
		}
	});
};

'use strict';

var StylePointElement = function(Chart$$1) {

	return Chart$$1.elements.Point.extend({

		draw: function() {
			var me = this;
			var vm = me._view;
			var ctx = me._chart.ctx;

			ctx.save();

			ctx.shadowOffsetX = vm.shadowOffsetX;
			ctx.shadowOffsetY = vm.shadowOffsetY;
			ctx.shadowBlur = vm.shadowBlur;
			ctx.shadowColor = vm.shadowColor;

			Chart$$1.elements.Point.prototype.draw.apply(me, arguments);

			ctx.restore();
		}
	});
};

'use strict';

var StyleRectangleElement = function(Chart$$1) {

	return Chart$$1.elements.Rectangle.extend({

		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;
			var left, right, top, bottom, signX, signY, borderSkipped;
			var borderWidth = vm.borderWidth;

			if (!vm.horizontal) {
				// bar
				left = vm.x - vm.width / 2;
				right = vm.x + vm.width / 2;
				top = vm.y;
				bottom = vm.base;
				signX = 1;
				signY = bottom > top ? 1 : -1;
				borderSkipped = vm.borderSkipped || 'bottom';
			} else {
				// horizontal bar
				left = vm.base;
				right = vm.x;
				top = vm.y - vm.height / 2;
				bottom = vm.y + vm.height / 2;
				signX = right > left ? 1 : -1;
				signY = 1;
				borderSkipped = vm.borderSkipped || 'left';
			}

			// Canvas doesn't allow us to stroke inside the width so we can
			// adjust the sizes to fit if we're setting a stroke on the line
			if (borderWidth) {
				// borderWidth shold be less than bar width and bar height.
				var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
				borderWidth = borderWidth > barSize ? barSize : borderWidth;
				var halfStroke = borderWidth / 2;
				// Adjust borderWidth when bar top position is near vm.base(zero).
				var borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
				var borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
				var borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
				var borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);
				// not become a vertical line?
				if (borderLeft !== borderRight) {
					top = borderTop;
					bottom = borderBottom;
				}
				// not become a horizontal line?
				if (borderTop !== borderBottom) {
					left = borderLeft;
					right = borderRight;
				}
			}

			ctx.beginPath();
			ctx.fillStyle = vm.backgroundColor;
			ctx.strokeStyle = vm.borderColor;
			ctx.lineWidth = borderWidth;

			ctx.save();

			ctx.shadowOffsetX = vm.shadowOffsetX;
			ctx.shadowOffsetY = vm.shadowOffsetY;
			ctx.shadowBlur = vm.shadowBlur;
			ctx.shadowColor = vm.shadowColor;

			// Corner points, from bottom-left to bottom-right clockwise
			// | 1 2 |
			// | 0 3 |
			var corners = [
				[left, bottom],
				[left, top],
				[right, top],
				[right, bottom]
			];

			// Find first (starting) corner with fallback to 'bottom'
			var borders = ['bottom', 'left', 'top', 'right'];
			var startCorner = borders.indexOf(borderSkipped, 0);
			if (startCorner === -1) {
				startCorner = 0;
			}

			function cornerAt(index) {
				return corners[(startCorner + index) % 4];
			}

			// Draw rectangle from 'startCorner'
			var corner = cornerAt(0);
			ctx.moveTo(corner[0], corner[1]);

			for (var i = 1; i < 4; i++) {
				corner = cornerAt(i);
				ctx.lineTo(corner[0], corner[1]);
			}

			ctx.fill();

			ctx.restore();

			if (borderWidth) {
				ctx.stroke();
			}
		}
	});
};

'use strict';

var StyleTooltip = function(Chart$$1) {

	var helpers = Chart$$1.helpers;

	var Tooltip = Chart$$1.Tooltip;

	/**
	 * Helper method to merge the opacity into a color
	 */
	function mergeOpacity(colorString, opacity) {
		var color = helpers.color(colorString);
		return color.alpha(opacity * color.alpha()).rgbaString();
	}

	return Chart$$1.Tooltip.extend({

		initialize: function() {
			Tooltip.prototype.initialize.apply(this, arguments);

			var model = this._model;
			var tooltipOpts = this._options;

			model.shadowOffsetX = tooltipOpts.shadowOffsetX;
			model.shadowOffsetY = tooltipOpts.shadowOffsetY;
			model.shadowBlur = tooltipOpts.shadowBlur;
			model.shadowColor = tooltipOpts.shadowColor;
		},

		update: function() {
			Tooltip.prototype.update.apply(this, arguments);

			var me = this;
			var model = me._model;
			var opts = me._options;

			model.shadowOffsetX = opts.shadowOffsetX;
			model.shadowOffsetY = opts.shadowOffsetY;
			model.shadowBlur = opts.shadowBlur;
			model.shadowColor = opts.shadowColor;

			return me;
		},

		drawBackground: function(pt, vm, ctx, tooltipSize, opacity) {
			ctx.save();

			ctx.shadowOffsetX = vm.shadowOffsetX;
			ctx.shadowOffsetY = vm.shadowOffsetY;
			ctx.shadowBlur = vm.shadowBlur;
			ctx.shadowColor = mergeOpacity(vm.shadowColor, opacity);

			Tooltip.prototype.drawBackground.apply(this, arguments);

			ctx.restore();
		}
	});
};

'use strict';

var StyleController = function(Chart$$1) {

	var helpers = Chart$$1.helpers;

	helpers.extend(Chart$$1.prototype, {

		// Ported from Chart.js 2.7.2. Modified for style tooltip.
		initToolTip: function() {
			var me = this;
			me.tooltip = new Chart$$1.StyleTooltip({
				_chart: me,
				_chartInstance: me, // deprecated, backward compatibility
				_data: me.data,
				_options: me.options.tooltips
			}, me);
		}
	});
};

'use strict';

var StyleBarController = function(Chart$$1) {

	var elements = Chart$$1.elements;
	var helpers = Chart$$1.helpers;

	var BarController = Chart$$1.controllers.bar;

	return Chart$$1.controllers.bar.extend({

		dataElementType: elements.StyleRectangle,

		// Ported from Chart.js 2.7.2. Modified for style bar.
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
				shadowColor: custom.shadowColor ? custom.shadowColor : helpers.valueAtIndexOrDefault(dataset.shadowColor, index, rectangleOptions.shadowColor)
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

			BarController.prototype.removeHoverStyle.apply(this, arguments);
		}
	});
};

'use strict';

var StyleBubbleController = function(Chart$$1) {

	var elements = Chart$$1.elements;
	var helpers = Chart$$1.helpers;

	var BubbleController = Chart$$1.controllers.bubble;

	return Chart$$1.controllers.bubble.extend({

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
};

'use strict';

var StyleDoughnutController = function(Chart$$1) {

	var elements = Chart$$1.elements;
	var helpers = Chart$$1.helpers;

	// Ported from Chart.js 2.7.2. Modified for style tooltip.
	Chart$$1.defaults.doughnut.legend.labels.generateLabels = function(chart) {
		var data = chart.data;
		if (data.labels.length && data.datasets.length) {
			return data.labels.map(function(label, i) {
				var meta = chart.getDatasetMeta(0);
				var ds = data.datasets[0];
				var arc = meta.data[i];
				var custom = arc && arc.custom || {};
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

	var DoughnutController = Chart$$1.controllers.doughnut;

	return Chart$$1.controllers.doughnut.extend({

		dataElementType: elements.StyleArc,

		// Ported from Chart.js 2.7.2. Modified for style bar.
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
			var valueAtIndexOrDefault = helpers.valueAtIndexOrDefault;

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
			var valueOrDefault = helpers.valueAtIndexOrDefault;
			var elementOpts = this.chart.options.elements.arc;
			model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueOrDefault(dataset.backgroundColor, index, elementOpts.backgroundColor);
			model.borderColor = custom.borderColor ? custom.borderColor : valueOrDefault(dataset.borderColor, index, elementOpts.borderColor);
			model.borderWidth = custom.borderWidth ? custom.borderWidth : valueOrDefault(dataset.borderWidth, index, elementOpts.borderWidth);

			model.shadowOffsetX = custom.shadowOffsetX ? custom.shadowOffsetX : valueOrDefault(dataset.shadowOffsetX, index, elementOpts.shadowOffsetX);
			model.shadowOffsetY = custom.shadowOffsetY ? custom.shadowOffsetY : valueOrDefault(dataset.shadowOffsetY, index, elementOpts.shadowOffsetY);
			model.shadowBlur = custom.shadowBlur ? custom.shadowBlur : valueOrDefault(dataset.shadowBlur, index, elementOpts.shadowBlur);
			model.shadowColor = custom.shadowColor ? custom.shadowColor : valueOrDefault(dataset.shadowColor, index, elementOpts.shadowColor);

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

			DoughnutController.prototype.removeHoverStyle.apply(this, arguments);
		}
	});
};

'use strict';

var StyleLineController = function(Chart$$1) {

	var elements = Chart$$1.elements;
	var helpers = Chart$$1.helpers;

	var LineController = Chart$$1.controllers.line;

	function lineEnabled(dataset, options) {
		return helpers.valueOrDefault(dataset.showLine, options.showLines);
	}

	return Chart$$1.controllers.line.extend({

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

		updateElement: function(point, index) {
			LineController.prototype.updateElement.apply(this, arguments);

			var me = this;

			point._model.shadowOffsetX = me.getPointShadowOffsetX(point, index);
			point._model.shadowOffsetY = me.getPointShadowOffsetY(point, index);
			point._model.shadowBlur = me.getPointShadowBlur(point, index);
			point._model.shadowColor = me.getPointShadowColor(point, index);
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
			}

			model.shadowOffsetX = custom.hoverShadowOffsetX || valueOrDefault(dataset.pointHoverShadowOffsetX, index, model.shadowOffsetX);
			model.shadowOffsetY = custom.hoverShadowOffsetY || valueOrDefault(dataset.pointHoverShadowOffsetY, index, model.shadowOffsetY);
			model.shadowBlur = custom.hoverShadowBlur || valueOrDefault(dataset.pointHoverShadowBlur, index, model.shadowBlur);
			model.shadowColor = custom.hoverShadowColor || valueOrDefault(dataset.pointHoverShadowColor, index, helpers.getHoverColor(model.shadowColor));
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
			}

			LineController.prototype.removeHoverStyle.apply(this, arguments);
		}
	});
};

'use strict';

var StylePolarAreaController = function(Chart$$1) {

	var elements = Chart$$1.elements;
	var helpers = Chart$$1.helpers;

	// Ported from Chart.js 2.7.2. Modified for style tooltip.
	Chart$$1.defaults.doughnut.legend.labels.generateLabels = function(chart) {
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

	var PolarAreaController = Chart$$1.controllers.polarArea;

	return Chart$$1.controllers.polarArea.extend({

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
};

'use strict';

var StyleRadarController = function(Chart$$1) {

	var elements = Chart$$1.elements;
	var helpers = Chart$$1.helpers;

	var RadarController = Chart$$1.controllers.radar;

	return Chart$$1.controllers.radar.extend({

		datasetElementType: elements.StyleLine,

		dataElementType: elements.StylePoint,

		// Ported from Chart.js 2.7.2. Modified for style radar.
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
					tension: custom.tension ? custom.tension : helpers.valueOrDefault(dataset.lineTension, lineElementOptions.tension),
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
					shadowColor: custom.shadowColor ? custom.shadowColor : (dataset.shadowColor || lineElementOptions.shadowColor)
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

			point._model.shadowOffsetX = custom.shadowOffsetX ? custom.shadowOffsetX : helpers.valueAtIndexOrDefault(dataset.pointShadowOffsetX, index, pointElementOptions.shadowOffsetX);
			point._model.shadowOffsetY = custom.shadowOffsetY ? custom.shadowOffsetY : helpers.valueAtIndexOrDefault(dataset.pointShadowOffsetY, index, pointElementOptions.shadowOffsetY);
			point._model.shadowBlur = custom.shadowBlur ? custom.shadowBlur : helpers.valueAtIndexOrDefault(dataset.pointShadowBlur, index, pointElementOptions.shadowBlur);
			point._model.shadowColor = custom.shadowColor ? custom.shadowColor : helpers.valueAtIndexOrDefault(dataset.pointShadowColor, index, pointElementOptions.shadowColor);
		},

		setHoverStyle: function(element) {
			RadarController.prototype.setHoverStyle.apply(this, arguments);

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
			}

			model.shadowOffsetX = custom.hoverShadowOffsetX ? custom.hoverShadowOffsetX : valueOrDefault(dataset.pointHoverShadowOffsetX, index, model.shadowOffsetX);
			model.shadowOffsetY = custom.hoverShadowOffsetY ? custom.hoverShadowOffsetY : valueOrDefault(dataset.pointHoverShadowOffsetY, index, model.shadowOffsetY);
			model.shadowBlur = custom.hoverShadowBlur ? custom.hoverShadowBlur : valueOrDefault(dataset.pointHoverShadowBlur, index, model.shadowBlur);
			model.shadowColor = custom.hoverShadowColor ? custom.hoverShadowColor : valueOrDefault(dataset.pointHoverShadowColor, index, helpers.getHoverColor(model.shadowColor));
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

			RadarController.prototype.removeHoverStyle.apply(this, arguments);
		}
	});
};

var StyleLegendPlugin = function(Chart$$1) {

	var defaults = Chart$$1.defaults;
	var helpers = Chart$$1.helpers;
	var layouts = Chart$$1.layouts;

	// Ported from Chart.js 2.7.2. Modified for style tooltip.
	// Generates labels shown in the legend
	defaults.global.legend.labels.generateLabels = function(chart) {
		var data = chart.data;
		return helpers.isArray(data.datasets) ? data.datasets.map(function(dataset, i) {
			return {
				text: dataset.label,
				fillStyle: (!helpers.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor[0]),
				hidden: !chart.isDatasetVisible(i),
				lineCap: dataset.borderCapStyle,
				lineDash: dataset.borderDash,
				lineDashOffset: dataset.borderDashOffset,
				lineJoin: dataset.borderJoinStyle,
				lineWidth: dataset.borderWidth,
				strokeStyle: dataset.borderColor,
				pointStyle: dataset.pointStyle,

				shadowOffsetX: (!helpers.isArray(dataset.shadowOffsetX) ? dataset.shadowOffsetX : dataset.shadowOffsetX[0]),
				shadowOffsetY: (!helpers.isArray(dataset.shadowOffsetY) ? dataset.shadowOffsetY : dataset.shadowOffsetY[0]),
				shadowBlur: (!helpers.isArray(dataset.shadowBlur) ? dataset.shadowBlur : dataset.shadowBlur[0]),
				shadowColor: (!helpers.isArray(dataset.shadowColor) ? dataset.shadowColor : dataset.shadowColor[0]),

				// Below is extra data used for toggling the datasets
				datasetIndex: i
			};
		}, this) : [];
	};

	/**
	 * Ported from Chart.js 2.7.2. Modified for style tooltip.
	 *
	 * Helper function to get the box width based on the usePointStyle option
	 * @param labelopts {Object} the label options on the legend
	 * @param fontSize {Number} the label font size
	 * @return {Number} width of the color box area
	 */
	function getBoxWidth(labelOpts, fontSize) {
		return labelOpts.usePointStyle ?
			fontSize * Math.SQRT2 :
			labelOpts.boxWidth;
	}

	var StyleLegend = Chart$$1.Legend.extend({

		// Ported from Chart.js 2.7.2. Modified for style tooltip.
		// Actually draw the legend on the canvas
		draw: function() {
			var me = this;
			var opts = me.options;
			var labelOpts = opts.labels;
			var globalDefault = defaults.global;
			var lineDefault = globalDefault.elements.line;
			var legendWidth = me.width;
			var lineWidths = me.lineWidths;

			if (opts.display) {
				var ctx = me.ctx;
				var valueOrDefault = helpers.valueOrDefault;
				var fontColor = valueOrDefault(labelOpts.fontColor, globalDefault.defaultFontColor);
				var fontSize = valueOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize);
				var fontStyle = valueOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle);
				var fontFamily = valueOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily);
				var labelFont = helpers.fontString(fontSize, fontStyle, fontFamily);
				var cursor;

				// Canvas setup
				ctx.textAlign = 'left';
				ctx.textBaseline = 'middle';
				ctx.lineWidth = 0.5;
				ctx.strokeStyle = fontColor; // for strikethrough effect
				ctx.fillStyle = fontColor; // render in correct colour
				ctx.font = labelFont;

				var boxWidth = getBoxWidth(labelOpts, fontSize);
				var hitboxes = me.legendHitBoxes;

				// current position
				var drawLegendBox = function(x, y, legendItem) {
					if (isNaN(boxWidth) || boxWidth <= 0) {
						return;
					}

					// Set the ctx for the box
					ctx.save();

					ctx.fillStyle = valueOrDefault(legendItem.fillStyle, globalDefault.defaultColor);
					ctx.lineCap = valueOrDefault(legendItem.lineCap, lineDefault.borderCapStyle);
					ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, lineDefault.borderDashOffset);
					ctx.lineJoin = valueOrDefault(legendItem.lineJoin, lineDefault.borderJoinStyle);
					ctx.lineWidth = valueOrDefault(legendItem.lineWidth, lineDefault.borderWidth);
					ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, globalDefault.defaultColor);
					var isLineWidthZero = (valueOrDefault(legendItem.lineWidth, lineDefault.borderWidth) === 0);

					if (ctx.setLineDash) {
						// IE 9 and 10 do not support line dash
						ctx.setLineDash(valueOrDefault(legendItem.lineDash, lineDefault.borderDash));
					}

					ctx.shadowOffsetX = valueOrDefault(legendItem.shadowOffsetX, lineDefault.shadowOffsetX);
					ctx.shadowOffsetY = valueOrDefault(legendItem.shadowOffsetY, lineDefault.shadowOffsetY);
					ctx.shadowBlur = valueOrDefault(legendItem.shadowBlur, lineDefault.shadowBlur);
					ctx.shadowColor = valueOrDefault(legendItem.shadowColor, lineDefault.shadowColor);

					if (opts.labels && opts.labels.usePointStyle) {
						// Recalculate x and y for drawPoint() because its expecting
						// x and y to be center of figure (instead of top left)
						var radius = fontSize * Math.SQRT2 / 2;
						var offSet = radius / Math.SQRT2;
						var centerX = x + offSet;
						var centerY = y + offSet;

						// Draw pointStyle as legend symbol
						helpers.canvas.drawPoint(ctx, legendItem.pointStyle, radius, centerX, centerY);
					} else {
						// Draw box as legend symbol
						if (!isLineWidthZero) {
							ctx.strokeRect(x, y, boxWidth, fontSize);
						}
						ctx.fillRect(x, y, boxWidth, fontSize);
					}

					ctx.restore();
				};
				var fillText = function(x, y, legendItem, textWidth) {
					var halfFontSize = fontSize / 2;
					var xLeft = boxWidth + halfFontSize + x;
					var yMiddle = y + halfFontSize;

					ctx.fillText(legendItem.text, xLeft, yMiddle);

					if (legendItem.hidden) {
						// Strikethrough the text if hidden
						ctx.beginPath();
						ctx.lineWidth = 2;
						ctx.moveTo(xLeft, yMiddle);
						ctx.lineTo(xLeft + textWidth, yMiddle);
						ctx.stroke();
					}
				};

				// Horizontal
				var isHorizontal = me.isHorizontal();
				if (isHorizontal) {
					cursor = {
						x: me.left + ((legendWidth - lineWidths[0]) / 2),
						y: me.top + labelOpts.padding,
						line: 0
					};
				} else {
					cursor = {
						x: me.left + labelOpts.padding,
						y: me.top + labelOpts.padding,
						line: 0
					};
				}

				var itemHeight = fontSize + labelOpts.padding;
				helpers.each(me.legendItems, function(legendItem, i) {
					var textWidth = ctx.measureText(legendItem.text).width;
					var width = boxWidth + (fontSize / 2) + textWidth;
					var x = cursor.x;
					var y = cursor.y;

					if (isHorizontal) {
						if (x + width >= legendWidth) {
							y = cursor.y += itemHeight;
							cursor.line++;
							x = cursor.x = me.left + ((legendWidth - lineWidths[cursor.line]) / 2);
						}
					} else if (y + itemHeight > me.bottom) {
						x = cursor.x = x + me.columnWidths[cursor.line] + labelOpts.padding;
						y = cursor.y = me.top + labelOpts.padding;
						cursor.line++;
					}

					drawLegendBox(x, y, legendItem);

					hitboxes[i].left = x;
					hitboxes[i].top = y;

					// Fill the actual label
					fillText(x, y, legendItem, textWidth);

					if (isHorizontal) {
						cursor.x += width + (labelOpts.padding);
					} else {
						cursor.y += itemHeight;
					}

				});
			}
		},
	});

	// Ported from Chart.js 2.7.2. Modified for style tooltip.
	function createNewLegendAndAttach(chart, legendOpts) {
		var legend = new StyleLegend({
			ctx: chart.ctx,
			options: legendOpts,
			chart: chart
		});

		layouts.configure(chart, legend, legendOpts);
		layouts.addBox(chart, legend);
		chart.legend = legend;
	}

	return {
		id: 'legend',

		_element: StyleLegend,

		// Ported from Chart.js 2.7.2. Modified for style tooltip.
		beforeInit: function(chart) {
			var legendOpts = chart.options.legend;

			if (legendOpts) {
				createNewLegendAndAttach(chart, legendOpts);
			}
		},

		// Ported from Chart.js 2.7.2. Modified for style tooltip.
		beforeUpdate: function(chart) {
			var legendOpts = chart.options.legend;
			var legend = chart.legend;

			if (legendOpts) {
				helpers.mergeIf(legendOpts, defaults.global.legend);

				if (legend) {
					layouts.configure(chart, legend, legendOpts);
					legend.options = legendOpts;
				} else {
					createNewLegendAndAttach(chart, legendOpts);
				}
			} else if (legend) {
				layouts.removeBox(chart, legend);
				delete chart.legend;
			}
		},

		// Ported from Chart.js 2.7.2. Modified for style tooltip.
		afterEvent: function(chart, e) {
			var legend = chart.legend;
			if (legend) {
				legend.handleEvent(e);
			}
		}
	};
};

'use strict';

Chart.elements.StyleArc = StyleArcElement(Chart);
Chart.elements.StyleLine = StyleLineElement(Chart);
Chart.elements.StylePoint = StylePointElement(Chart);
Chart.elements.StyleRectangle = StyleRectangleElement(Chart);

Chart.StyleTooltip = StyleTooltip(Chart);
StyleController(Chart);

Chart.controllers.bar = StyleBarController(Chart);
Chart.controllers.bubble = StyleBubbleController(Chart);
Chart.controllers.doughnut = StyleDoughnutController(Chart);
Chart.controllers.line = StyleLineController(Chart);
Chart.controllers.pie = Chart.controllers.doughnut;
Chart.controllers.polarArea = StylePolarAreaController(Chart);
Chart.controllers.radar = StyleRadarController(Chart);
Chart.controllers.scatter = Chart.controllers.line;

Chart.plugins.getAll().forEach(function(plugin) {
	if (plugin.id === 'legend') {
		Chart.plugins.unregister(plugin);
	}
});
Chart.plugins.register(StyleLegendPlugin(Chart));
Chart.Legend = StyleLegendPlugin._element;

})));
