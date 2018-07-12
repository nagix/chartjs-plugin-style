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

		drawShadow: function(chart, offsetX, offsetY, blur, color, drawCallback, backmost) {
			var ctx = chart.ctx;
			var offset = chart.width;
			var pixelRatio = chart.currentDevicePixelRatio;

			ctx.save();

			ctx.shadowOffsetX = (offsetX + offset) * pixelRatio;
			ctx.shadowOffsetY = offsetY * pixelRatio;
			ctx.shadowBlur = blur * pixelRatio;
			ctx.shadowColor = color;
			if (backmost) {
				ctx.globalCompositeOperation = 'destination-over';
			}
			ctx.translate(-offset, 0);

			drawCallback();

			ctx.restore();
		},

		setPath: function(ctx, drawCallback) {
			ctx.save();
			ctx.beginPath();
			ctx.clip();
			drawCallback();
			ctx.restore();
		},

		drawBevel: function(chart, width, highlightColor, shadowColor, drawCallback) {
			var ctx = chart.ctx;
			var offset = chart.width;
			var pixelRatio = chart.currentDevicePixelRatio;
			var shadowOffset = (width * pixelRatio) / 2;

			if (!width) {
				return;
			}

			ctx.save();
			ctx.clip();

			// Make stencil
			ctx.translate(-offset, 0);
			this.setPath(ctx, drawCallback);
			ctx.rect(0, 0, chart.width, chart.height);

			// Draw bevel shadow
			ctx.fillStyle = 'black';
			ctx.shadowOffsetX = offset * pixelRatio - shadowOffset;
			ctx.shadowOffsetY = -shadowOffset;
			ctx.shadowBlur = shadowOffset;
			ctx.shadowColor = shadowColor;
			ctx.globalCompositeOperation = 'source-atop';
			ctx.fill('evenodd');

			// Draw Bevel highlight
			ctx.shadowOffsetX = offset * pixelRatio + shadowOffset;
			ctx.shadowOffsetY = shadowOffset;
			ctx.shadowColor = highlightColor;
			ctx.fill('evenodd');

			ctx.restore();
		},

		drawGlow: function(chart, width, color, borderWidth, drawCallback, isOuter) {
			var ctx = chart.ctx;
			var offset = chart.width;
			var pixelRatio = chart.currentDevicePixelRatio;

			if (!width) {
				return;
			}

			ctx.save();

			// Clip inner or outer area
			this.setPath(ctx, drawCallback);
			if (isOuter) {
				ctx.rect(0, 0, chart.width, chart.height);
			}
			ctx.clip('evenodd');

			// Set path
			ctx.translate(-offset, 0);
			this.setPath(ctx, drawCallback);
			if (!isOuter) {
				ctx.rect(0, 0, chart.width, chart.height);
			}

			// Draw glow
			ctx.lineWidth = borderWidth;
			ctx.strokeStyle = 'black';
			ctx.fillStyle = 'black';
			ctx.shadowOffsetX = offset * pixelRatio;
			ctx.shadowBlur = width * pixelRatio;
			ctx.shadowColor = color;
			ctx.fill('evenodd');
			if (borderWidth) {
				ctx.stroke();
			}

			ctx.restore();
		},

		drawInnerGlow: function(chart, width, color, borderWidth, drawCallback) {
			this.drawGlow(chart, width, color, borderWidth, drawCallback);
		},

		drawOuterGlow: function(chart, width, color, borderWidth, drawCallback) {
			this.drawGlow(chart, width, color, borderWidth, drawCallback, true);
		}
	};
}
