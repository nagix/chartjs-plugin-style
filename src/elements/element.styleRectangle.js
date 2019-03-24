'use strict';

import Chart from 'chart.js';
import styleHelpers from '../helpers/helpers.style';

var helpers = Chart.helpers;

var Rectangle = Chart.elements.Rectangle;

// Ported from Chart.js 2.8.0
function swap(orig, v1, v2) {
	return orig === v1 ? v2 : orig === v2 ? v1 : orig;
}

// Ported from Chart.js 2.8.0
function parseBorderSkipped(vm) {
	var edge = vm.borderSkipped;
	var res = {};

	if (!edge) {
		return res;
	}

	if (vm.horizontal) {
		if (vm.base > vm.x) {
			edge = swap(edge, 'left', 'right');
		}
	} else if (vm.base < vm.y) {
		edge = swap(edge, 'bottom', 'top');
	}

	res[edge] = true;
	return res;
}

// Ported from Chart.js 2.8.0
function parseBorderWidth(vm, maxW, maxH) {
	var value = vm.borderWidth;
	var skip = parseBorderSkipped(vm);
	var t, r, b, l;

	if (helpers.isObject(value)) {
		t = +value.top || 0;
		r = +value.right || 0;
		b = +value.bottom || 0;
		l = +value.left || 0;
	} else {
		t = r = b = l = +value || 0;
	}

	return {
		t: skip.top || (t < 0) ? 0 : t > maxH ? maxH : t,
		r: skip.right || (r < 0) ? 0 : r > maxW ? maxW : r,
		b: skip.bottom || (b < 0) ? 0 : b > maxH ? maxH : b,
		l: skip.left || (l < 0) ? 0 : l > maxW ? maxW : l
	};
}

export default Rectangle.extend({

	draw: function() {
		var me = this;
		var args = arguments;
		var chart = me._chart;
		var vm = me._view;
		var bevelExtra = styleHelpers.opaque(vm.borderColor) && vm.borderWidth > 0 ? vm.borderWidth / 2 : 0;

		var drawCallback = function() {
			Rectangle.prototype.draw.apply(me, args);
		};
		var setPathCallback = function() {
			me.setPath();
		};

		styleHelpers.drawShadow(chart, vm.shadowOffsetX, vm.shadowOffsetY,
			vm.shadowBlur, vm.shadowColor, drawCallback, true);

		if (styleHelpers.opaque(vm.backgroundColor)) {
			styleHelpers.drawBackground(vm, drawCallback);
			styleHelpers.drawBackgroundOverlay(chart, vm.backgroundOverlayColor,
				vm.backgroundOverlayMode, setPathCallback);
			styleHelpers.drawBevel(chart, vm.bevelWidth + bevelExtra,
				vm.bevelHighlightColor, vm.bevelShadowColor, setPathCallback);
		}

		styleHelpers.drawInnerGlow(chart, vm.innerGlowWidth, vm.innerGlowColor,
			vm.borderWidth, setPathCallback);
		styleHelpers.drawOuterGlow(chart, vm.outerGlowWidth, vm.outerGlowColor,
			vm.borderWidth, setPathCallback);

		styleHelpers.drawBorder(vm, drawCallback);
	},

	setPath: function() {
		var ctx = this._chart.ctx;
		var vm = this._view;
		var left, right, top, bottom, half, width, height, border;

		if (vm.width !== undefined) {
			half = vm.width / 2;
			left = vm.x - half;
			right = vm.x + half;
			top = Math.min(vm.y, vm.base);
			bottom = Math.max(vm.y, vm.base);
		} else {
			half = vm.height / 2;
			left = Math.min(vm.x, vm.base);
			right = Math.max(vm.x, vm.base);
			top = vm.y - half;
			bottom = vm.y + half;
		}

		width = right - left;
		height = bottom - top;
		border = parseBorderWidth(vm, width / 2, height / 2);

		ctx.rect(
			left + border.l / 2,
			top + border.t / 2,
			width - (border.l + border.r) / 2,
			height - (border.t + border.b) / 2
		);
	}
});
