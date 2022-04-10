/**
 *
 * This is an extension to RaphaelJS for drawing Arcs
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @access      public
 *
 */

window.RaphaelExtensions = {
	ca: {

		/**
		 * @usage make an arc at 50,50 with a radius of 30 that grows from 0 to 40 of 100 with a bounce
		 * var my_arc = archtype.path().attr({
		 *      "stroke": "#f00",
		 *      "stroke-width": 14,
		 *      arc: [50, 50, 0, 100, 50]
		 * });
		 *
		 * my_arc.animate({
		 *      arc: [50, 50, amount, 100, 50]
		 * }, 1500, "bounce");
		 *
		 * @param cx
		 * @param cy
		 * @param value
		 * @param total
		 * @param radius
		 * @param startingIncline
		 * @param endingIncline
		 * @return {Object}
		 */
		gaugeArc: function (cx, cy, value, total, radius, startingIncline, endingIncline) {
			startingIncline = (startingIncline === undefined)
				? 0
				: Math.max(-89, Math.min(89, startingIncline));
			endingIncline = (startingIncline === undefined)
				? 180 - startingIncline
				: Math.max(91, Math.min(269, endingIncline));

			var alpha = Math.abs(endingIncline - startingIncline) / total * value,
				a = (180 - alpha) * Math.PI / 180,
				x = cx + radius * Math.cos(a),
				y = cy - radius * Math.sin(a),
				path;

			path = [
				["M", cx - radius, cy],
				["A", radius, radius,
					0,
					+(alpha > 180),
					1,
					x,
					y]
			];
			return {
				path: path
			};
		},

		gaugeArcZone: function (cx, cy, fromPercentage, toPercentage, radius, startingIncline, endingIncline) {
			var arc = this.paper.path().attr({
					gaugeArc: [cx, cy, 100, 100, radius, startingIncline, endingIncline]
				}),
				length = arc.getTotalLength(),
				path = arc.getSubpath(length * fromPercentage, length * toPercentage);

			arc.remove();

			return {
				path: path
			}
		}
	}
};
