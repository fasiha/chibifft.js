'use strict';

function cmul(a, b, x, y) { return [a * x - b * y, a * y + b * x]; }
function cadd(a, b, x, y) { return [a + x, b + y] };
function csub(a, b, x, y) { return [a - x, b - y] };
function cget(v, n) { return v.slice(2 * n, 2 * n + 2); }
function cset(v, n, a, b) {
  v[2 * n] = a;
  v[2 * n + 1] = b;
}

function separateComplexInterleaved(a, start, n) {
  let nhalf = n / 2;
  let b = Array(2 * nhalf);
  for (let i = 0; i < nhalf; i++) cset(b, i, ...cget(a, start + 2 * i + 1));
  for (let i = 0; i < nhalf; i++) cset(a, start + i, ...cget(a, start + 2 * i));
  for (let i = 0; i < nhalf; i++) cset(a, start + i + nhalf, ...cget(b, i));
}

function fftComplexInterleaved(x, start = 0, n = (x.length / 2)) {
  if (n > 1) {
    separateComplexInterleaved(x, start, n);
    fftComplexInterleaved(x, start, n / 2);
    fftComplexInterleaved(x, start + n / 2, n / 2);
    let nhalf = n / 2;
    for (let i = 0; i < nhalf; i++) {
      let e = cget(x, i + start);
      let o = cget(x, i + nhalf + start);
      let phase = -2 * Math.PI * i / n;
      let w = [Math.cos(phase), Math.sin(phase)];
      let left = cadd(...e, ...cmul(...w, ...o));
      cset(x, i + start, ...left);
      let right = csub(...e, ...cmul(...w, ...o));
      cset(x, i + start + nhalf, ...right);
    }
  }
}
module.exports = {
  fftComplexInterleaved,
  separateComplexInterleaved,
  cmul,
  cadd,
  csub,
  cget,
  cset
};