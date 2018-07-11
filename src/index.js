'use strict';

import Chart from 'chart.js';

import StyleHelper from './helpers/helpers.style';

import StyleArcElement from './elements/element.styleArc';
import StyleLineElement from './elements/element.styleLine';
import StylePointElement from './elements/element.stylePoint';
import StyleRectangleElement from './elements/element.styleRectangle';

import StyleTooltip from './core/core.styleTooltip';
import StyleController from './core/core.styleController';
import StyleBarController from './controllers/controller.styleBar';
import StyleBubbleController from './controllers/controller.styleBubble';
import StyleDoughnutController from './controllers/controller.styleDoughnut';
import StyleLineController from './controllers/controller.styleLine';
import StylePolarAreaController from './controllers/controller.stylePolarArea';
import StyleRadarController from './controllers/controller.styleRadar';

import StyleLegendPlugin from './plugins/plugin.styleLegend';

// For Chart.js 2.6.0 backward compatibility
Chart.helpers.valueOrDefault = Chart.helpers.valueOrDefault || Chart.helpers.getValueOrDefault;
Chart.helpers.valueAtIndexOrDefault = Chart.helpers.valueAtIndexOrDefault || Chart.helpers.getValueAtIndexOrDefault;
Chart.helpers.mergeIf = Chart.helpers.mergeIf || function(target, source) {
	return Chart.helpers.configMerge.call(this, source, target);
};
Chart.helpers.options = Chart.helpers.options || {};
Chart.helpers.options.resolve = Chart.helpers.options.resolve || function(inputs, context, index) {
	var i, ilen, value;

	for (i = 0, ilen = inputs.length; i < ilen; ++i) {
		value = inputs[i];
		if (value === undefined) {
			continue;
		}
		if (context !== undefined && typeof value === 'function') {
			value = value(context);
		}
		if (index !== undefined && Chart.helpers.isArray(value)) {
			value = value[index];
		}
		if (value !== undefined) {
			return value;
		}
	}
};

// For Chart.js 2.7.1 backward compatibility
Chart.layouts = Chart.layouts || Chart.layoutService;

Chart.helpers.style = StyleHelper(Chart);

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
