'use strict';

import StyleBarController from './controller.styleBar';

export default function(Chart) {
	return StyleBarController(Chart).extend({
		/**
		 * @private
		 */
		getValueScaleId: function() {
			return this.getMeta().xAxisID;
		},

		/**
		 * @private
		 */
		getIndexScaleId: function() {
			return this.getMeta().yAxisID;
		}
	});
}
