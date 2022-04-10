/**
 * jQuery SVG Gauge Plugin 1.0.0
 *
 * This jQuery plugin requires Raphael 2.x
 *
 * License: WTFPL
 * Copyright (C) 2013 Terry Young <terryyounghk at gmail dot com>
 */
(function($, Raphael, RaphaelExtensions, undefined) {


  /**
   * The SVGGauge instance will be stored in this.data(dataKey) for internal reference
   * @type {String}
   */
  var dataKey = 'jquery-svg-gauge';

  /**
   * Available methods of .svgGauge()
   * @type {Object}
   */
  var methods = {
    /**
     * Initializes the svgGauge
     * @param options
     * @return {*} chaining
     */
    init: function(options) {
      return this.each(function(i, el) {
        var $el = $(el);
        $el.data(dataKey, new SVGGauge($el, options));
      });
    },

    /**
     * Returns the svgGauge instance
     * @return {*}
     */
    widget: function() {
      return this.data(dataKey);
    },

    /**
     * Returns the Raphael paper object, in case you ever need to access it directly
     */
    paper: function() {
      return (this.data(dataKey)) ? this.data(dataKey).paper : undefined;
    },

    /**
     * Sets/Gets the value of the svgGauge
     *
     * Obsolete. As we are going to duck-punch $.fn.val below, you can then just use $('#gauge').val() to set/get the value.
     *
     * @param value
     * @return {*}
     */
    value: function(value) {
      var instance = this.data(dataKey);
      return (value === undefined) ? instance.val() : instance.val(value);
    },

    /**
     * Returns the minValue of the svgGauge
     * @return {int}
     */
    minValue: function() {
      return (this.data(dataKey)) ? this.data(dataKey).minValue : undefined;
    },

    /**
     * Returns the maxValue of the svgGauge
     * @return {int}
     */
    maxValue: function() {
      return (this.data(dataKey)) ? this.data(dataKey).maxValue : undefined;
    },

    /**
     *
     * @return {*}
     */
    shutdown: function() {
      return this.each(function(i, el) {
        $(el).data(dataKey).shutdown();
      });
    },

    /**
     * For demo. Sets a random value to the svgGauge
     * @return {*}
     */
    randomize: function() {
      return this.each(function(i, el) {
        $(el).data(dataKey).randomize();
      });
    }
  };

  $.fn.svgGauge = function(method) {
    // Method calling logic
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.svgGauge');
      return undefined;
    }
  };

  // -----------------------------------------------------------------------------------------------------------------
  // DUCK PUNCH !!!!!!!!!!!!!!!!!!!!
  //
  // Usages:
  //
  // $('#gauge').val(100); // Sets the value of the svgGauge to 100
  // alert($('#gauge').val()); // alerts '100'
  //
  var _oldval = $.fn.val;
  $.fn.val = function(value) {
    if (value === undefined) {
      // return the first svgGauge's value
      var instance = this.first().data(dataKey);
      if (instance instanceof SVGGauge) {
        return instance.val();
      } else {
        // else, let the original .val() kick in
        return _oldval.apply(this, arguments);
      }
    } else {
      // apply the value to all elements in the set
      return this.each(function(i, el) {
        var $el = $(el),
          instance = $el.data(dataKey);

        if (instance instanceof SVGGauge) {
          instance.val(value);
        } else {
          _oldval.apply($el, [value]);
        }
      });
    }
  };
  //
  // QUACK !!!!!!!!!!!!!!!!!!!!
  // -----------------------------------------------------------------------------------------------------------------


  // -----------------------------------------------------------------------------------------------------------------
  // Beyond this line is the internal SVGGauge constructor and prototype
  // The default properties are within the SVGGauge's init() method
  //

  var NORMAL = 1,
    WARNING = 2,
    CRITICAL = 3,
    ZONES = [];

  // map integer values to text strings
  ZONES[NORMAL] = 'normal';
  ZONES[WARNING] = 'warning';
  ZONES[CRITICAL] = 'critical';

  function SVGGauge(jqObject, options) {
    this.init();
    $.extend(true, this, this.defaults); // First extend the new instance with the defaults
    $.extend(true, this, options || {}); // Then extend the new instance with options, if specified, which overrides the defaults
    this.originalOptions = options; // reserved
    this.container = jqObject.get(0); // required by Raphael: http://raphaeljs.com/reference.html#Raphael
    this._validateOptions(); // some values need to be ensured they are within acceptable ranges
    this.create();
    this.draw();


    // prevent from overriding
    if (options && options['value'] !== undefined) {
      this.value = this.minValue;
      this.val(options.value);
    }

    this.testing = function() {
      console.warn(this.value);
    }
  }


  SVGGauge.prototype = {
    init: function() {
      var msg;
      if (!geom) {
        msg = 'Geom JavaScript Library is required for the jQuery svgGauge plugin.';
      } else if (!Raphael) {
        msg = 'Raphael JavaScript Library is required for the jQuery svgGauge plugin.';
      } else if (!Raphael.type) {
        msg = 'Your browser does not support vector graphics.';
      } else {
        this.defaults = {
          'value': 0,
          'minValue': 0,
          'maxValue': 100,
          'valuePrecision': 2 // the maximum number of decimals for returned values
          ,
          'percentagePrecision': 0 // the maximum number of decimals for returned percentages
          ,
          'width': 150 // The width of the Raphael paper
          ,
          'height': 150 // The height of the Raphael paper
          ,
          'margin': 7

          //       90
          //        |
          // 0 _____|_____
          //        |
          //      -90
          ,
          'startingIncline': 0,
          'endingIncline': undefined,
          'majorTicks': {
            'show': true,
            'count': 5,
            'length': 15,
            'attr': {
              'stroke': '#000000', // translates to SVG stroke
              'opacity': 1,
              'stroke-width': 2 // translates to SVG stroke-width
            }
          },
          'minorTicks': {
            'show': true,
            'count': 5,
            'length': 7,
            'attr': {
              'stroke': '#000000', // translates to SVG stroke
              'opacity': 1,
              'stroke-width': 1 // translates to SVG stroke-width
            }
          },
          'arc': {
            'show': true,
            'attr': {
              'stroke': '#000000', // translates to SVG stroke
              'opacity': 1,
              'stroke-width': 2 // translates to SVG stroke-width
            }
          },
          'zones': {
            'normal': {
              'show': true,
              'fromPercentage': 0,
              'toPercentage': 0.6,
              'attr': {
                'stroke': '#27ff1d', // translates to SVG stroke
                'opacity': 1,
                'stroke-width': 7 // translates to SVG stroke-width
              }
            },
            'warning': {
              'show': true,
              'fromPercentage': 0.6,
              'toPercentage': 0.8,
              'attr': {
                'stroke': '#EDE910', // translates to SVG stroke
                'opacity': 1,
                'stroke-width': 7 // translates to SVG stroke-width
              }
            },
            'critical': {
              'show': true,
              'fromPercentage': 0.8,
              'toPercentage': 1,
              'attr': {
                'stroke': '#EF0E0E', // translates to SVG stroke
                'opacity': 1,
                'stroke-width': 7 // translates to SVG stroke-width
              }
            }
          },
          'hand': {
            'centerPointRadius': 4,
            'length': 65,
            'attr': {
              'fill': '#333'
            }
          },

          // animation
          'duration': 700, // total duration of the entire animated sequence
          'easing': 'easeOut', // Easing effect when gauge hand animates

          /**
           * This functions fires on each frame of the gauge meter animation
           * The scope of this function is the HTML container of the SVGGauge widget instance
           *
           * @param data      All real-time information based on the current angle of the gauge hand.
           *                  'data' has the following properties:
           *                  data.value
           *                  data.percentage         e.g. 0.834 (where gauge.percentagePrecision is 1)
           *                  data.percentageString   e.g. 83.4% (where gauge.percentagePrecision is 1)
           *                  data.angle              The angle relative to gauge.startingIncline
           *                  data.totalAngle         gauge.endingIncline - gauge.startingIncline
           *                  data.zone               The zone as Integer (1=normal, 2=warning, 3=critical)
           * @param gauge     The SVGGauge instance
           */
          'onAnimate': function(data, gauge) {},

          /**
           * This function fires at the moment the gauge meter crosses into another zone
           * The scope of this function is the HTML container of the SVGGauge widget instance
           *
           * @param zone      The zone as string. Possible values: 'normal', warning', 'critical'.
           * @param data      All real-time information based on the current angle of the gauge hand.
           *                  'data' has the following properties:
           *                  data.value
           *                  data.percentage         e.g. 0.834 (where gauge.percentagePrecision is 1)
           *                  data.percentageString   e.g. 83.4% (where gauge.percentagePrecision is 1)
           *                  data.angle              The angle relative to gauge.startingIncline
           *                  data.totalAngle         gauge.endingIncline - gauge.startingIncline
           *                  data.zone               The zone as Integer (1=normal, 2=warning, 3=critical)
           *                  data.previousZone       The zone as Integer (1=normal, 2=warning, 3=critical)
           * @param gauge     The SVGGauge instance
           */
          'onZoneChange': function(zone, data, gauge) {}
        };

        this.sets = {}; // reserved object for holding different types of Raphael Sets
      }
      if (msg !== undefined) {
        return (window.console && console.warn(msg)) || alert(msg);
      }
      return true;
    },

    /**
     * This function creates the Raphael paper
     */
    create: function() {
      this.paper = Raphael(this.container, this.width, this.height);
      $.extend(true, this.paper, RaphaelExtensions);
      try {
        delete window.RaphaelExtensions;
      } catch (e) {
        window['RaphaelExtensions'] = undefined;
      }

      this.paper.HTMLcontainer = this.container; // add a reference of the SVG document's HTML container to the paper
    },

    /**
     * This is a triage function which draws the gauge components
     */
    draw: function() {

      //this.paper.circle(b.center.x, b.center.y, this.radius);

      this._drawGaugeZones();
      this._drawGaugeTicks();
      this._drawHand();
    },

    _drawHand: function() {
      var b = this.bbox,
        dotRadius = this.hand.centerPointRadius,
        rx = dotRadius, // for clarity
        ry = dotRadius, // for clarity
        handAttr = $.extend({}, this.hand.attr, {
          'stroke-width': 0 // until future versions of this plugin draws the hand in a less sloppy way, we won't have stroke-widths
        }),
        dot = this.paper.ellipse(b.center.x, b.center.y, rx, ry)
          .attr(handAttr),
        handLength = this.hand.length,
        hand = this.paper.path([
          ['M', [b.center.x, b.center.y - ry].join(',')],
          ['L', [b.center.x - handLength, b.center.y].join(',')],
          ['L', [b.center.x, b.center.y + ry].join(',')]
        ].join(''))
          .attr(handAttr),
        handSet = this.paper.set();

      handSet.push(dot, hand);

      handSet.rotate(this.startingIncline, b.center.x, b.center.y);

      this.sets.hand = handSet;
    },

    _drawGaugeZones: function() {
      var b = this.bbox,
        instance = this,
        zoneSet = this.paper.set();

      $.each(this.zones, function(key, zone) {
        var zonePath = instance.paper.path()
          .attr($.extend(true, {}, zone.attr, {
            'gaugeArcZone': [
              b.center.x,
              b.center.y,
              zone.fromPercentage,
              zone.toPercentage,
              instance.radius - zone.attr['stroke-width'] / 2,
              instance.startingIncline,
              instance.endingIncline
            ]
          }))
          .rotate(instance.startingIncline, b.center.x, b.center.x);
        if (!zone.show) {
          zonePath.hide();
        }
        zoneSet.push(zonePath);
      });

      var arcPath = this.paper.path()
        .attr($.extend(true, {}, this.arc.attr, {
          'gaugeArcZone': [
            b.center.x,
            b.center.y,
            0,
            1,
            this.radius,
            this.startingIncline,
            this.endingIncline
          ]
        }))
        .rotate(instance.startingIncline, b.center.x, b.center.x);

      if (!this.arc.show) {
        arcPath.hide();
      }

      this.sets.arc = arcPath;

      $.extend(this.sets, {
        'zones': zoneSet
      });
    },

    _drawGaugeTicks: function() {
      // draw gauge ticks
      var majorTickGuideSet = this.paper.set(),
        majorTickSet = this.paper.set(),
        minorTickGuideSet = this.paper.set(),
        minorTickSet = this.paper.set(),
        iMajorTicks = this.majorTicks.count,
        iMinorTicks = this.minorTicks.count,
        majorTickAngleIncrement = this.totalAngle / iMajorTicks,
        minorTickAngleIncrement = majorTickAngleIncrement / (iMinorTicks + 1),
        b = this.bbox,
        iTotalLength;

      for (var i = 0,
          k = 1,
          j = iMajorTicks,
          a1 = this.startingIncline; i <= j; a1 = this.startingIncline + k * majorTickAngleIncrement, i++, k++) {

        var majorTickGuide = this.paper.path([
          'M', [b.center.x, b.center.y].join(','),
          'L', [b.left.x, b.left.y].join(',')
        ].join(''))
          .attr({
            'fill-opacity': 0,
            'stroke-opacity': 0,
            'stroke-width': 0
          })
          .rotate(a1, b.center.x, b.center.y);

        iTotalLength = majorTickGuide.getTotalLength();

        var majorTick = this.paper.path(
          majorTickGuide.getSubpath(iTotalLength - this.majorTicks.length, iTotalLength)
        )
          .rotate(a1, b.center.x, b.center.y)
          .attr(this.majorTicks.attr);

        if (i < j) {
          for (var a2 = a1 + minorTickAngleIncrement,
              l = 0,
              m = 1,
              n = iMinorTicks; l <= n; a2 = a1 + m * minorTickAngleIncrement, l++, m++) {

            var minorTickGuide = this.paper.path([
              'M', [b.center.x, b.center.y].join(','),
              'L', [b.left.x, b.left.y].join(',')
            ].join(''))
              .attr({
                'fill-opacity': 0,
                'stroke-opacity': 0,
                'stroke-width': 0
              })
              .rotate(a1, b.center.x, b.center.y);

            iTotalLength = minorTickGuide.getTotalLength();

            var minorTick = this.paper.path(
              minorTickGuide.getSubpath(iTotalLength - this.minorTicks.length, iTotalLength)
            )
              .rotate(a2, b.center.x, b.center.y)
              .attr(this.minorTicks.attr);

            minorTickGuideSet.push(minorTickGuide);
            minorTickSet.push(minorTick);
          }
        }

        majorTickGuideSet.push(majorTickGuide);
        majorTickSet.push(majorTick);
      }

      if (!this.majorTicks.show) {
        majorTickSet.hide();
      }

      if (!this.minorTicks.show) {
        minorTickSet.hide();
      }

      $.extend(this.sets, {
        'majorTicks': {
          'guides': majorTickGuideSet,
          'ticks': majorTickSet
        },
        'minorTicks': {
          'guides': minorTickGuideSet,
          'ticks': minorTickSet
        }
      });
    },

    _validateOptions: function() {
      var w = this.width - this.margin * 2,
        h = this.height - this.margin * 2,
        cx = this.width / 2,
        cy = this.height / 2,
        b = geom.getBoundingBox(w, h, cx, cy);

      this.bbox = b; // bounding box information

      this.radius = this.width / 2 - this.margin; // this.radius is a derived property

      // ensure startingIncline is within 2nd and 3rd quadrant
      if (!$.isNumeric(this.startingIncline)) {
        this.startingIncline = 0;
      } else {
        this.startingIncline = Math.max(-89, Math.min(89, this.startingIncline));
      }

      // ensure endingIncline is within 1st and 4th quadrant
      if (!$.isNumeric(this.endingIncline)) {
        this.endingIncline = 180 + -this.startingIncline; // symmetrical by default
      } else {
        this.endingIncline = Math.max(91, Math.min(269, this.endingIncline));
      }

      this.totalAngle = this.endingIncline - this.startingIncline;
    },

    _getBox: function() {
      var w = this.width,
        h = this.height;
      return {

      }
    },

    /**
     * This function sets or gets the value of the gauge
     * @param value
     * @return {*} Returns the value of gauge is no arguments provided. Returns true upon successful assignment, false otherwise.
     */
    val: function(value) {
      // getter
      if (value === undefined) {
        return this.value;
      }

      // skip setter if there no change in value
      if (value == this.value) {
        return true;
      }

      // must be evaluated as numeric
      if (!$.isNumeric(value)) {
        return false;
      }

      // F.T.I.
      value = value * 1; // ensure it is numeric

      // setter

      // make sure 'value' is within the allowed range
      value = Math.max(Math.min(value.toFixed(this.valuePrecision), this.maxValue), this.minValue);

      //console.warn(this.minValue);

      var b = this.bbox,
        finalPercentage = (value - this.minValue) / Math.abs(this.maxValue - this.minValue),
        totalAngle = Math.abs(this.endingIncline - this.startingIncline),
        finalAngle = totalAngle * finalPercentage + this.startingIncline,
        instance = this,
        handSet = this.sets.hand,
        previousZone = this.zone;

      function onAnimate(obj) {
        var data = instance._getRealtimeValues();
        if ($.isFunction(instance.onAnimate)) {
          instance.onAnimate.apply(instance.container, [data, instance]);
        }
        if (previousZone != data.zone) {
          if ($.isFunction(instance.onZoneChange)) {
            data.previousZone = previousZone;
            instance.onZoneChange.apply(instance.container, [ZONES[data.zone], data, instance]);
          }
          previousZone = data.zone;
        }
      }

      eve.on('raphael.anim.frame.' + handSet[1].id, onAnimate);

      handSet.animate({
        transform: ['r', finalAngle, b.center.x, b.center.y]
      }, this.duration, this.easing, function() {
        eve.unbind('raphael.anim.frame.' + handSet[1].id, onAnimate);
      });

      // ...

      this.value = value;

      return true;
    },

    _getRealtimeValues: function() {
      var hand = this.sets.hand[0],
        currentRotation = hand.attr('transform')[0][1] * 1,
        currentAngle = currentRotation - this.startingIncline,
        totalAngle = Math.abs(this.endingIncline - this.startingIncline),
        currentPercentage = currentAngle / totalAngle,
        currentValue = Math.abs(this.maxValue - this.minValue) * currentPercentage + this.minValue,
        currentZone = (this.zones.normal.fromPercentage <= currentPercentage && currentPercentage < this.zones.normal.toPercentage) ? NORMAL : (this.zones.warning.fromPercentage <= currentPercentage && currentPercentage < this.zones.warning.toPercentage) ? WARNING : (this.zones.critical.fromPercentage <= currentPercentage && currentPercentage < this.zones.critical.toPercentage) ? CRITICAL : 0; // unknown

      // for display purposes
      currentPercentage = currentPercentage.toFixed(this.percentagePrecision + 2) * 1; // e.g. 0.08543 = 85.43%
      currentValue = currentValue.toFixed(this.valuePrecision) * 1;

      return {
        'value': currentValue,
        'percentage': currentPercentage,
        'percentageString': (currentPercentage * 100).toFixed(this.percentagePrecision) + '%',
        'angle': currentAngle,
        'zone': currentZone,
        'totalAngle': totalAngle
      };
    },

    /**
     * For demo purposes
     * @return {*}
     */
    randomize: function() {
      var iMin = this.minValue,
        iMax = this.maxValue,
        iRand = Math.floor(Math.random() * (iMax - iMin + 1) + iMin);
      this.val(iRand);
      return this;
    }
  };

})(jQuery, Raphael, window.RaphaelExtensions);