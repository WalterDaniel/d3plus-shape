import {accessor, constant} from "d3plus-common";

import {default as Shape} from "./Shape";

/**
    @class Circle
    @extends Shape
    @desc Creates SVG circles based on an array of data.
*/
export default class Circle extends Shape {

  /**
      @memberof Circle
      @desc Invoked when creating a new class instance, and overrides any default parameters inherited from Shape.
      @private
  */
  constructor() {
    super();
    this._name = "Circle";
    this._r = accessor("r");
  }

  /**
      Provides the default positioning to the <rect> elements.
      @private
  */
  _applyPosition(elem) {
    elem
      .attr("r", (d, i) => this._r(d, i))
      .attr("x", (d, i) => -this._r(d, i) / 2)
      .attr("y", (d, i) => -this._r(d, i) / 2);
  }

  /**
      Draws the circles.
      @param {Function} [*callback* = undefined]
      @private
  */
  render(callback) {

    super.render(callback);

    this._enter.append("circle")
        .attr("r", 0).attr("x", 0).attr("y", 0)
        .call(this._applyStyle.bind(this))
      .transition(this._transition)
        .call(this._applyPosition.bind(this));

    this._update.select("circle").transition(this._transition)
      .call(this._applyStyle.bind(this))
      .call(this._applyPosition.bind(this));

    this._exit.select("circle").transition(this._transition)
      .attr("r", 0).attr("x", 0).attr("y", 0);

    return this;

  }

  /**
      @memberof Circle
      @desc Given a specific data point and index, returns the aesthetic properties of the shape.
      @param {Object} *data point*
      @param {Number} *index*
      @private
  */
  _aes(d, i) {
    return {r: this._r(d, i)};
  }

  /**
      @memberof Circle
      @desc If *value* is specified, sets the radius accessor to the specified function or number and returns the current class instance. If *value* is not specified, returns the current radius accessor.
      @param {Function|Number} [*value*]
      @example
function(d) {
  return d.r;
}
  */
  r(_) {
    return arguments.length ? (this._r = typeof _ === "function" ? _ : constant(_), this) : this._r;
  }

}