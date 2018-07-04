'use strict';

import Chart from 'chart.js';

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
