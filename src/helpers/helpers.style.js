'use strict';

export default function() {

	return {
		drawBackground: function(view, drawCallback) {
			var borderWidth = view.borderWidth;

			view.borderWidth = 0;
			drawCallback();
			view.borderWidth = borderWidth;
		},

		drawBorder: function(view, drawCallback) {
			var backgroundColor = view.backgroundColor;

			if (view.borderWidth) {
				view.backgroundColor = 'rgba(0, 0, 0, 0)';
				drawCallback();
				view.backgroundColor = backgroundColor;
			}
		},

		drawShadow: function(chart, offsetX, offsetY, blur, color, drawCallback, shadowOnly) {
			var ctx = chart.ctx;
			var offset = shadowOnly ? chart.width : 0;
			var pixelRatio = chart.currentDevicePixelRatio;

			ctx.save();

			ctx.shadowOffsetX = (offsetX + offset) * pixelRatio;
			ctx.shadowOffsetY = offsetY * pixelRatio;
			ctx.shadowBlur = blur * pixelRatio;
			ctx.shadowColor = color;
			if (shadowOnly) {
				ctx.globalCompositeOperation = 'destination-over';
			}
			ctx.translate(-offset, 0);

			drawCallback();

			ctx.restore();
		},

		drawBevel: function(chart, width, highlightColor, shadowColor) {
			var ctx = chart.ctx;
			var offset = (width * chart.currentDevicePixelRatio) / 2;

			if (!width) {
				return;
			}

			ctx.save();
			ctx.clip();

			// Add rect to make stencil
			ctx.rect(-offset, -offset, chart.width + offset * 2, chart.height + offset * 2);

			// Draw bevel shadow
			ctx.fillStyle = 'gray';
			ctx.shadowOffsetX = -offset;
			ctx.shadowOffsetY = -offset;
			ctx.shadowBlur = offset;
			ctx.shadowColor = shadowColor;
			ctx.globalCompositeOperation = 'source-atop';
			ctx.fill('evenodd');

			// Draw Bevel highlight
			ctx.shadowOffsetX = offset;
			ctx.shadowOffsetY = offset;
			ctx.shadowColor = highlightColor;
			ctx.fill('evenodd');

			ctx.restore();
		}
	};
}
