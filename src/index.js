'use strict';

import Chart from 'chart.js';

import StyleTooltip from './core/core.styleTooltip';

import StyleHelper from './helpers/helpers.style';

import StyleArcElement from './elements/element.styleArc';
import StyleLineElement from './elements/element.styleLine';
import StylePointElement from './elements/element.stylePoint';
import StyleRectangleElement from './elements/element.styleRectangle';

import StylePlugin from './plugins/plugin.style';

Chart.StyleTooltip = StyleTooltip;

Chart.helpers.style = StyleHelper;

Chart.elements.StyleArc = StyleArcElement;
Chart.elements.StyleLine = StyleLineElement;
Chart.elements.StylePoint = StylePointElement;
Chart.elements.StyleRectangle = StyleRectangleElement;

Chart.plugins.register(StylePlugin);

export default StylePlugin;
