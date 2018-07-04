# chartjs-plugin-style

[![npm](https://img.shields.io/npm/v/chartjs-plugin-style.svg?style=flat-square)](https://npmjs.com/package/chartjs-plugin-style) [![Bower](https://img.shields.io/bower/v/chartjs-plugin-style.svg?style=flat-square)](https://libraries.io/bower/chartjs-plugin-style) [![Travis](https://img.shields.io/travis/nagix/chartjs-plugin-style/master.svg?style=flat-square)](https://travis-ci.org/nagix/chartjs-plugin-style) [![Code Climate](https://img.shields.io/codeclimate/maintainability/nagix/chartjs-plugin-style.svg?style=flat-square)](https://codeclimate.com/github/nagix/chartjs-plugin-style)

*[Chart.js](https://www.chartjs.org) plugin for more styling options*

This plugin requires Chart.js 2.7.2.

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

## Usage

chartjs-plugin-style can be used with ES6 modules, plain JavaScript and module loaders.

chartjs-plugin-style requires [Chart.js](https://www.chartjs.org). Include Chart.js and chartjs-plugin-style.js to your page to enable style options.

Version 0.1 only supports shadows for datasets and the tooltip. More options are to be added in the upcoming releases.

## Tutorial and Samples

You can find a tutorial and samples at [nagix.github.io/chartjs-plugin-style](https://nagix.github.io/chartjs-plugin-style).

## Configuration

To configure this plugin, you can simply add the following properties to your datasets and tooltip.

### Line, Radar and Scatter

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `shadowOffsetX` | `Number` | 0 | Indicates the horizontal distance the shadow should extend from the line. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetX).
| `shadowOffsetY` | `Number` | 0 | Indicates the vertical distance the shadow should extend from the line. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetY).
| `shadowBlur` | `Number` | 0 | Indicates the size of the blurring effect for the line; this value doesn't correspond to a number of pixels. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowBlur).
| `shadowColor` | `Number` | `'rgba(0, 0, 0, 0)'` | A standard CSS color value indicating the color of the shadow effect for the line. See [Colors](http://www.chartjs.org/docs/latest/general/colors.html#colors).
| `pointShadowOffsetX` | `Number/Number[]` | 0 | The horizontal distance the shadow should extend from the point.
| `pointShadowOffsetY` | `Number/Number[]` | 0 | The vertical distance the shadow should extend from the point.
| `pointShadowBlur` | `Number/Number[]` | 0 | The size of the blurring effect for the point.
| `pointShadowColor` | `Number/Number[]` | `'rgba(0, 0, 0, 0)'` | The color of the shadow effect for the point.
| `pointHoverShadowOffsetX` | `Number/Number[]` | 0 | The horizontal distance the shadow should extend from the point when hovered.
| `pointHoverShadowOffsetY` | `Number/Number[]` | 0 | The vertical distance the shadow should extend from the point when hovered.
| `pointHoverShadowBlur` | `Number/Number[]` | 0 | The size of the blurring effect for the point when hovered.
| `pointHoverShadowColor` | `Number/Number[]` | `'rgba(0, 0, 0, 0)'` | The color of the shadow effect for the point when hovered.

### Bar, Doughnut, Pie, Polar Area and Bubble

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `shadowOffsetX` | `Number` | 0 | Indicates the horizontal distance the shadow should extend from the element.
| `shadowOffsetY` | `Number` | 0 | Indicates the vertical distance the shadow should extend from the element.
| `shadowBlur` | `Number` | 0 | Indicates the size of the blurring effect; this value doesn't correspond to a number of pixels.
| `shadowColor` | `Number` | `'rgba(0, 0, 0, 0)'` | A standard CSS color value indicating the color of the shadow effect.
| `hoverShadowOffsetX` | `Number/Number[]` | 0 | The horizontal distance the shadow should extend from the element when hovered.
| `hoverShadowOffsetY` | `Number/Number[]` | 0 | The vertical distance the shadow should extend from the element when hovered.
| `hoverShadowBlur` | `Number/Number[]` | 0 | The size of the blurring effect when hovered.
| `hoverShadowColor` | `Number/Number[]` | `'rgba(0, 0, 0, 0)'` | The color of the shadow effect when hovered.

### Tooltip

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `shadowOffsetX` | `Number` | 0 | Indicates the horizontal distance the shadow should extend from the tooltip.
| `shadowOffsetY` | `Number` | 0 | Indicates the vertical distance the shadow should extend from the tooltip.
| `shadowBlur` | `Number` | 0 | Indicates the size of the blurring effect; this value doesn't correspond to a number of pixels.
| `shadowColor` | `Number` | `'rgba(0, 0, 0, 0)'` | A standard CSS color value indicating the color of the shadow effect.

For example:

```
{
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            data: [45, 20, 64, 32, 76, 51],
            shadowOffsetX: 5,
            shadowOffsetY: 5,
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            pointShadowOffsetX: 5,
            pointShadowOffsetY: 5,
            pointShadowBlur: 20,
            pointShadowColor: 'rgba(0, 0, 0, 0.5)',
            pointHoverShadowOffsetX: 5,
            pointHoverShadowOffsetY: 5,
            pointHoverShadowBlur: 40,
            pointHoverShadowColor: 'rgba(0, 0, 0, 1)'
        }]
    },
    options: {
        tooltips: {
            shadowOffsetX: 5,
            shadowOffsetY: 5,
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
gulp build      # build dist files
gulp watch      # watch for changes and build automatically
gulp lint       # perform code linting
gulp package    # create an archive with dist files and samples
```

## License

chartjs-plugin-style is available under the [MIT license](https://opensource.org/licenses/MIT).
