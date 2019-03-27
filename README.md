# chartjs-plugin-style

[![npm](https://img.shields.io/npm/v/chartjs-plugin-style.svg?style=flat-square)](https://npmjs.com/package/chartjs-plugin-style) [![Bower](https://img.shields.io/bower/v/chartjs-plugin-style.svg?style=flat-square)](https://libraries.io/bower/chartjs-plugin-style) [![Travis](https://img.shields.io/travis/nagix/chartjs-plugin-style/master.svg?style=flat-square)](https://travis-ci.org/nagix/chartjs-plugin-style) [![Code Climate](https://img.shields.io/codeclimate/maintainability/nagix/chartjs-plugin-style.svg?style=flat-square)](https://codeclimate.com/github/nagix/chartjs-plugin-style) [![Awesome](https://awesome.re/badge-flat2.svg)](https://github.com/chartjs/awesome)

*[Chart.js](https://www.chartjs.org) plugin for more styling options*

This plugin requires Chart.js 2.6.0 or later.

## Installation

You can download the latest version of chartjs-plugin-style from the [GitHub releases](https://github.com/nagix/chartjs-plugin-style/releases/latest).

To install via npm:

```bash
npm install chartjs-plugin-style --save
```

To install via bower:

```bash
bower install chartjs-plugin-style --save
```

To use CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-style@latest/dist/chartjs-plugin-style.min.js"></script>
```
```html
<script src="https://unpkg.com/chartjs-plugin-style@latest/dist/chartjs-plugin-style.min.js"></script>
```

## Usage

chartjs-plugin-style can be used with ES6 modules, plain JavaScript and module loaders.

chartjs-plugin-style requires [Chart.js](https://www.chartjs.org). Include Chart.js and chartjs-plugin-style.js to your page to enable style options.

Version 0.5 supports the bevel, drop shadow, inner glow, outer glow and overlay effects for datasets and the tooltip. More options are to be added in the upcoming releases.

### Usage in ES6 as module

Nothing else than importing the module should be enough.

```js
import 'chartjs-plugin-style';
```

## Tutorial and Samples

You can find a tutorial and samples at [nagix.github.io/chartjs-plugin-style](https://nagix.github.io/chartjs-plugin-style).

## Configuration

To configure this plugin, you can simply add the following properties to your datasets and tooltip. `point*` properties are used only in line, radar and scatter charts. `hover*` properties are not used in a tooptip.

| Name | Type | [Scriptable](https://www.chartjs.org/docs/latest/general/options.html#scriptable-options) | [Indexable](https://www.chartjs.org/docs/latest/general/options.html#indexable-options) | Default
| ---- | ---- | :--: | :--: | ----
| [`backgroundOverlayColor`](#overlay-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`backgroundOverlayMode`](#overlay-effect) | `string` | Yes | Yes | `'source-over'`
| [`bevelWidth`](#bevel-effect) | `number` | Yes | Yes | `0`
| [`bevelHighlightColor`](#bevel-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`bevelShadowColor`](#bevel-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`hoverBackgroundOverlayColor`](#overlay-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`hoverBackgroundOverlayMode`](#overlay-effect) | `string` | Yes | Yes | `'source-over'`
| [`hoverBevelWidth`](#bevel-effect) | `number` | Yes | Yes | `0`
| [`hoverBevelHighlightColor`](#bevel-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`hoverBevelShadowColor`](#bevel-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`hoverInnerGlowWidth`](#glow-effects) | `number` | Yes | Yes | `0`
| [`hoverInnerGlowColor`](#glow-effects) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`hoverOuterGlowWidth`](#glow-effects) | `number` | Yes | Yes | `0`
| [`hoverOuterGlowColor`](#glow-effects) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`hoverShadowOffsetX`](#shadow-effect) | `number` | Yes | Yes | `0`
| [`hoverShadowOffsetY`](#shadow-effect) | `number` | Yes | Yes | `0`
| [`hoverShadowBlur`](#shadow-effect) | `number` | Yes | Yes | `0`
| [`hoverShadowColor`](#shadow-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`innerGlowWidth`](#glow-effects) | `number` | Yes | Yes | `0`
| [`innerGlowColor`](#glow-effects) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`outerGlowWidth`](#glow-effects) | `number` | Yes | Yes | `0`
| [`outerGlowColor`](#glow-effects) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`pointBackgroundOverlayColor`](#overlay-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`pointBackgroundOverlayMode`](#overlay-effect) | `string` | Yes | Yes | `'source-over'`
| [`pointBevelWidth`](#bevel-effect) | `number` | Yes | Yes | `0`
| [`pointBevelHighlightColor`](#bevel-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`pointBevelShadowColor`](#bevel-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`pointHoverBackgroundOverlayColor`](#overlay-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`pointHoverBackgroundOverlayMode`](#overlay-effect) | `string` | Yes | Yes | `'source-over'`
| [`pointHoverBevelWidth`](#bevel-effect) | `number` | Yes | Yes | `0`
| [`pointHoverBevelHighlightColor`](#bevel-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`pointHoverBevelShadowColor`](#bevel-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`pointHoverInnerGlowWidth`](#glow-effects) | `number` | Yes | Yes | `0` 
| [`pointHoverInnerGlowColor`](#glow-effects) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`pointHoverOuterGlowWidth`](#glow-effects) | `number` | Yes | Yes | `0`
| [`pointHoverOuterGlowColor`](#glow-effects) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`pointHoverShadowOffsetX`](#shadow-effect) | `number` | Yes | Yes | `0`
| [`pointHoverShadowOffsetY`](#shadow-effect) | `number` | Yes | Yes | `0`
| [`pointHoverShadowBlur`](#shadow-effect) | `number` | Yes | Yes | `0`
| [`pointHoverShadowColor`](#shadow-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`pointInnerGlowWidth`](#glow-effects) | `number` | Yes | Yes | `0`
| [`pointInnerGlowColor`](#glow-effects) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`pointOuterGlowWidth`](#glow-effects) | `number` | Yes | Yes | `0`
| [`pointOuterGlowColor`](#glow-effects) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`pointShadowOffsetX`](#shadow-effect) | `number` | Yes | Yes | `0`
| [`pointShadowOffsetY`](#shadow-effect) | `number` | Yes | Yes | `0`
| [`pointShadowBlur`](#shadow-effect) | `number` | Yes | Yes | `0`
| [`pointShadowColor`](#shadow-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`
| [`shadowOffsetX`](#shadow-effect) | `number` | Yes | Yes | `0`
| [`shadowOffsetY`](#shadow-effect) | `number` | Yes | Yes | `0`
| [`shadowBlur`](#shadow-effect) | `number` | Yes | Yes | `0`
| [`shadowColor`](#shadow-effect) | `Color` | Yes | Yes | `'rgba(0, 0, 0, 0)'`

### Shadow effect

The shadow effect can be controlled with the following properties.

| Name | Description
| ---- | ----
| `shadowOffsetX` | Indicates the horizontal distance the shadow should extend from the line. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetX).
| `shadowOffsetY` | Indicates the vertical distance the shadow should extend from the line. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetY).
| `shadowBlur` | Indicates the size of the blurring effect for the line; this value doesn't correspond to a number of pixels. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowBlur).
| `shadowColor` | A standard CSS color value indicating the color of the shadow effect for the line. See [Colors](http://www.chartjs.org/docs/latest/general/colors.html#colors).
| `hoverShadowOffsetX` | The horizontal distance the shadow should extend from the element when hovered.
| `hoverShadowOffsetY` | The vertical distance the shadow should extend from the element when hovered.
| `hoverShadowBlur` | The size of the blurring effect when hovered.
| `hoverShadowColor` | The color of the shadow effect when hovered.
| `pointShadowOffsetX` | The horizontal distance the shadow should extend from the point.
| `pointShadowOffsetY` | The vertical distance the shadow should extend from the point.
| `pointShadowBlur` | The size of the blurring effect for the point.
| `pointShadowColor` | The color of the shadow effect for the point.
| `pointHoverShadowOffsetX` | The horizontal distance the shadow should extend from the point when hovered.
| `pointHoverShadowOffsetY` | The vertical distance the shadow should extend from the point when hovered.
| `pointHoverShadowBlur` | The size of the blurring effect for the point when hovered.
| `pointHoverShadowColor` | The color of the shadow effect for the point when hovered.

If the value is undefined, `point*` values fallback first to the dataset options then to the associated `elements.point.*` options. The rest of the values fallback to the associated `elements.{element type}.*` options.

### Bevel effect

The bevel effect can be controlled with the following properties.

| Name | Description
| ---- | ----
| `bevelWidth` | The width of the bevel effect.
| `bevelHighlightColor` | The highlight color of the bevel effect.
| `bevelShadowColor` | The shadow color of the bevel effect.
| `hoverBevelWidth` | The width of the bevel effect when hovered.
| `hoverBevelHighlightColor` | The highlight color of the bevel effect when hovered.
| `hoverBevelShadowColor` | The shadow color of the bevel effect when hovered.
| `pointBevelWidth` | The width of the bevel effect for the point.
| `pointBevelHighlightColor` | The highlight color of the bevel effect for the point.
| `pointBevelShadowColor` | The shadow color of the bevel effect for the point.
| `pointHoverBevelWidth` | The width of the bevel effect for the point when hovered.
| `pointHoverBevelHighlightColor` | The highlight color of the bevel effect for the point when hovered.
| `pointHoverBevelShadowColor` | The shadow color of the bevel effect for the point when hovered.

If the value is undefined, `point*` values fallback first to the dataset options then to the associated `elements.point.*` options. The rest of the values fallback to the associated `elements.{element type}.*` options.

### Glow effects

The glow effect can be controlled with the following properties.

| Name | Description
| ---- | ----
| `innerGlowWidth` | The width of the inner glow effect.
| `innerGlowColor` | The color of the inner glow effect.
| `outerGlowWidth` | The width of the outer glow effect.
| `outerGlowColor` | The color of the outer glow effect.
| `hoverInnerGlowWidth` | The width of the inner glow effect when hovered.
| `hoverInnerGlowColor` | The color of the inner glow effect when hovered.
| `hoverOuterGlowWidth` | The width of the outer glow effect when hovered.
| `hoverOuterGlowColor` | The color of the outer glow effect when hovered.
| `pointInnerGlowWidth` | The width of the inner glow effect for the point.
| `pointInnerGlowColor` | The color of the inner glow effect for the point.
| `pointOuterGlowWidth` | The width of the outer glow effect for the point.
| `pointOuterGlowColor` | The color of the outer glow effect for the point.
| `pointHoverInnerGlowWidth` | The width of the inner glow effect for the point when hovered.
| `pointHoverInnerGlowColor` | The color of the inner glow effect for the point when hovered.
| `pointHoverOuterGlowWidth` | The width of the outer glow effect for the point when hovered.
| `pointHoverOuterGlowColor` | The color of the outer glow effect for the point when hovered.

If the value is undefined, `point*` values fallback first to the dataset options then to the associated `elements.point.*` options. The rest of the values fallback to the associated `elements.{element type}.*` options.

### Overlay effect

The overlay effect can be controlled with the following properties. Note that these properties are not used in a tooltip.

| Name | Description
| ---- | ----
| `backgroundOverlayColor` | The background color overlaid on the element, which can be a standard CSS color value, a [CanvasPattern](https://developer.mozilla.org/en-US/docs/Web/API/CanvasPattern) or [CanvasGradient](https://developer.mozilla.org/en/docs/Web/API/CanvasGradient) object. See [Colors](http://www.chartjs.org/docs/latest/general/colors.html#colors).
| `backgroundOverlayMode` | Indicates the type of compositing operation to apply when overlaying a color. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation).
| `hoverBackgroundOverlayColor`
| `hoverBackgroundOverlayMode` | Indicates the type of compositing operation to apply when overlaying a color when hovered.
| `pointBackgroundOverlayColor` | The background color overlaid on the point.
| `pointBackgroundOverlayMode` | Indicates the type of compositing operation to apply when overlaying a color on the point.
| `pointHoverBackgroundOverlayColor` | The background color overlaid on the point when hovered.
| `pointHoverBackgroundOverlayMode` | Indicates the type of compositing operation to apply when overlaying a color on the point when hovered.

If the value is undefined, `point*` values fallback first to the dataset options then to the associated `elements.point.*` options. The rest of the values fallback to the associated `elements.{element type}.*` options.

## Example usage

```js
{
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            data: [45, 20, 64, 32, 76, 51],
            shadowOffsetX: 3,
            shadowOffsetY: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            pointBevelWidth: 3,
            pointBevelHighlightColor: 'rgba(255, 255, 255, 0.75)',
            pointBevelShadowColor: 'rgba(0, 0, 0, 0.5)',
            pointShadowOffsetX: 3,
            pointShadowOffsetY: 3,
            pointShadowBlur: 10,
            pointShadowColor: 'rgba(0, 0, 0, 0.5)',
            pointHoverInnerGlowWidth: 20,
            pointHoverInnerGlowColor: 'rgba(255, 255, 0, 0.5)',
            pointHoverOuterGlowWidth: 20,
            pointHoverOuterGlowColor: 'rgba(255, 255, 0, 1)',
            backgroundOverlayColor: ctx.createPattern(img, 'repeat'),
            backgroundOverlayMode: 'multiply'
        }]
    },
    options: {
        tooltips: {
            bevelWidth: 3,
            bevelHighlightColor: 'rgba(255, 255, 255, 0.75)',
            bevelShadowColor: 'rgba(0, 0, 0, 0.5)'
            shadowOffsetX: 3,
            shadowOffsetY: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
    }
}
```

## Building

You first need to install node dependencies (requires [Node.js](https://nodejs.org/)):

```bash
npm install
```

The following commands will then be available from the repository root:

```bash
gulp build            # build dist files
gulp build --watch    # build and watch for changes
gulp lint             # perform code linting
gulp package          # create an archive with dist files and samples
```

## License

chartjs-plugin-style is available under the [MIT license](https://opensource.org/licenses/MIT).
