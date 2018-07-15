'use strict';
let cx = require('./complex');

function separateComplexInterleaved(a, start, n) {
  let nhalf = n / 2;
  let b = Array(2 * nhalf);
  for (let i = 0; i < nhalf; i++) { cx.set(b, i, ...cx.get(a, start + 2 * i + 1)); }
  for (let i = 0; i < nhalf; i++) { cx.set(a, start + i, ...cx.get(a, start + 2 * i)); }
  for (let i = 0; i < nhalf; i++) { cx.set(a, start + i + nhalf, ...cx.get(b, i)); }
}

function fftComplexInterleaved(x, start = 0, n = (x.length / 2)) {
  if (n > 1) {
    separateComplexInterleaved(x, start, n);
    fftComplexInterleaved(x, start, n / 2);
    fftComplexInterleaved(x, start + n / 2, n / 2);
    let nhalf = n / 2;
    for (let i = 0; i < nhalf; i++) {
      let e = cx.get(x, i + start);
      let o = cx.get(x, i + nhalf + start);
      let wo = cx.mul(...cx.expj(-2 * Math.PI * i / n), ...o);
      let res = cx.add(...e, ...wo);
      cx.set(x, i + start, ...res);
      res = cx.sub(...e, ...wo);
      cx.set(x, i + start + nhalf, ...res);
    }
  }
}
module.exports = {
  fftComplexInterleaved,
  separateComplexInterleaved
};