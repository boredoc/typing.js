# jQuery SVG Gauge Plugin

You don't need to learn Raphael.js to use this.

This jQuery plugin uses Raphael.js internally to draw customizable SVG Gauges, and allows you to set/get values by simply using `.val()`


## License

[WTFPL](http://en.wikipedia.org/wiki/WTFPL)


## Dependencies

* jQuery 1.9 or above
* Raphael.js 2.1.1 or above - as the 'Transformation Rotation Precision issue was resolved', see [https://github.com/DmitryBaranovskiy/raphael/issues/653]
* You will also need geometry.js and raphael-extensions.js I included in this Plunker


## Some notable features
* Let's you create an SVG Gauge in jQuery fashion, and does the RaphaelJS work for you
* Get and Set gauge values using `.val()`
* `onAnimate` and `onZoneChange` event handlers
* Configurable start and end angles of the gauge
* Configurable zones of the gauge
* Cosmetic aspects of the gauge are exposed as options, as much as possible. The thickness, length, color of major and minor tick marks, gauge hand, gauge arc, zones, etc

