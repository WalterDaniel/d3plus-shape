import {extent} from "d3-array";
import {nest} from "d3-collection";
import {interpolatePath} from "d3-interpolate-path";
import {select} from "d3-selection";
import * as paths from "d3-shape";

import {accessor, constant, merge} from "d3plus-common";

import {default as Shape} from "./Shape";

/**
    @class Area
    @extends Shape
    @desc Creates SVG areas based on an array of data.
*/
export default class Area extends Shape {

  /**
      @memberof Area
      @desc Invoked when creating a new class instance, and overrides any default parameters inherited from Shape.
      @private
  */
  constructor() {

    super();

    this._curve = "linear";
    this._defined = () => true;
    this._name = "Area";
    this._x = accessor("x");
    this._x0 = accessor("x");
    this._x1 = null;
    this._y = constant(0);
    this._y0 = constant(0);
    this._y1 = accessor("y");

  }

  /**
      Filters/manipulates the data array before binding each point to an SVG group.
      @param {Array} [*data* = the data array to be filtered]
      @private
  */
  _dataFilter(data) {

    const areas = nest().key(this._id).entries(data).map(d => {

      d.data = merge(d.values);
      d.i = data.indexOf(d.values[0]);

      const x = extent(d.values.map(this._x)
        .concat(d.values.map(this._x0))
        .concat(this._x1 ? d.values.map(this._x1) : [])
      );
      d.xR = x;
      d.width = x[1] - x[0];
      d.x = x[0] + d.width / 2;

      const y = extent(d.values.map(this._y)
        .concat(d.values.map(this._y0))
        .concat(this._y1 ? d.values.map(this._y1) : [])
      );
      d.yR = y;
      d.height = y[1] - y[0];
      d.y = y[0] + d.height / 2;

      d.nested = true;
      d.__d3plus__ = true;
      return d;
    });

    areas.key = d => d.key;
    return areas;

  }

  /**
      Draws the area polygons.
      @param {Function} [*callback* = undefined]
      @private
  */
  render(callback) {

    super.render(callback);

    const path = this._path = paths.area()
      .defined(this._defined)
      .curve(paths[`curve${this._curve.charAt(0).toUpperCase()}${this._curve.slice(1)}`])
      .x(this._x).x0(this._x0).x1(this._x1)
      .y(this._y).y0(this._y0).y1(this._y1);

    const exitPath = paths.area()
      .defined(d => d)
      .curve(paths[`curve${this._curve.charAt(0).toUpperCase()}${this._curve.slice(1)}`])
      .x(this._x).x0(this._x0).x1(this._x1)
      .y(this._y).y0(this._y0).y1(this._y1);

    this._enter.append("path")
      .attr("transform", d => `translate(${-d.xR[0] - d.width / 2}, ${-d.yR[0] - d.height / 2})`)
      .attr("d", d => path(d.values))
      .call(this._applyStyle.bind(this));

    this._update.select("path").transition(this._transition)
      .attr("transform", d => `translate(${-d.xR[0] - d.width / 2}, ${-d.yR[0] - d.height / 2})`)
      .attrTween("d", function(d) {
        return interpolatePath(select(this).attr("d"), path(d.values));
      })
      .call(this._applyStyle.bind(this));

    this._exit.select("path").transition(this._transition)
      .attrTween("d", function(d) {
        return interpolatePath(select(this).attr("d"), exitPath(d.values));
      });

    return this;

  }

  /**
      @memberof Area
      @desc Given a specific data point and index, returns the aesthetic properties of the shape.
      @param {Object} *data point*
      @param {Number} *index*
      @private
  */
  _aes(d, i) {
    return {points: d.values.map(p => [this._x(p, i), this._y(p, i)])};
  }

  /**
      @memberof Area
      @desc If *value* is specified, sets the area curve to the specified string and returns the current class instance. If *value* is not specified, returns the current area curve.
      @param {String} [*value* = "linear"]
  */
  curve(_) {
    return arguments.length
         ? (this._curve = _, this)
         : this._curve;
  }

  /**
      @memberof Area
      @desc If *value* is specified, sets the defined accessor to the specified function and returns the current class instance. If *value* is not specified, returns the current defined accessor.
      @param {Function} [*value*]
  */
  defined(_) {
    return arguments.length
         ? (this._defined = _, this)
         : this._defined;
  }

  /**
      @memberof Area
      @desc If *value* is specified, sets the x0 accessor to the specified function or number and returns the current class instance. If *value* is not specified, returns the current x0 accessor.
      @param {Function|Number} [*value*]
  */
  x0(_) {
    return arguments.length
         ? (this._x0 = typeof _ === "function" ? _ : constant(_), this)
         : this._x0;
  }

  /**
      @memberof Area
      @desc If *value* is specified, sets the x1 accessor to the specified function or number and returns the current class instance. If *value* is not specified, returns the current x1 accessor.
      @param {Function|Number|null} [*value*]
  */
  x1(_) {
    return arguments.length
         ? (this._x1 = typeof _ === "function" || _ === null ? _ : constant(_), this)
         : this._x1;
  }

  /**
      @memberof Area
      @desc If *value* is specified, sets the y0 accessor to the specified function or number and returns the current class instance. If *value* is not specified, returns the current y0 accessor.
      @param {Function|Number} [*value*]
  */
  y0(_) {
    return arguments.length
         ? (this._y0 = typeof _ === "function" ? _ : constant(_), this)
         : this._y0;
  }

  /**
      @memberof Area
      @desc If *value* is specified, sets the y1 accessor to the specified function or number and returns the current class instance. If *value* is not specified, returns the current y1 accessor.
      @param {Function|Number|null} [*value*]
  */
  y1(_) {
    return arguments.length
         ? (this._y1 = typeof _ === "function" || _ === null ? _ : constant(_), this)
         : this._y1;
  }

}