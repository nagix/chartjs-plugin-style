'use strict';

import StyleBarController from './controller.styleBar';

export default StyleBarController.extend({
	/**
	 * @private
	 */
	_getValueScaleId: function() {
		return this.getMeta().xAxisID;
	},

	/**
	 * @private
	 */
	_getIndexScaleId: function() {
		return this.getMeta().yAxisID;
	},

	/**
	 * For Chart.js 2.7.3 backward compatibility
	 * @private
	 */
	getValueScaleId: function() {
		return this.getMeta().xAxisID;
	},

	/**
	 * For Chart.js 2.7.3 backward compatibility
	 * @private
	 */
	getIndexScaleId: function() {
		return this.getMeta().yAxisID;
	}
});
