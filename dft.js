"use strict";
let cx = require('./complex');
function dftComplexInterleaved(x, inverse = false) {
  const n = x.length / 2;
  const phase = (inverse ? 1 : -1) * 2 * Math.PI / n;
  let ret = Array.from(Array(x.length), _ => 0);
  for (let col = 0; col < n; col++) {
    const elt = cx.get(x, col);
    for (let row = 0; row < n; row++) {
      cx.set(ret, row, ...cx.add(...cx.get(ret, row), ...cx.mul(...cx.expj(phase * row * col), ...elt)));
      //     ret[row] =                    ret[row] +                 expj(phase * row * col)   * elt
    }
  }
  return ret;
}

function inverseDftComplexInterleaved(x) { return dftComplexInterleaved(x, true).map(x => x / x.length); }

module.exports = {
  dftComplexInterleaved,
  inverseDftComplexInterleaved
};