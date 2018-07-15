"use strict";
let test = require('tape');
let f = require('./dft');
let cx = require('./complex');

const doubleEpsilon = 2.220446049250313e-16;

test('DC signal', t => {
  let x = [1, 0, 0, 0, 0, 0, 0, 0];
  let y = f.dftComplexInterleaved(x);
  t.deepEqual(y, Array.from(Array(8), (_, n) => 0 + !(n % 2)))
  t.end();
});

function isclose(actual, expected, atol, rtol) {
  return Math.abs(actual - expected) <= (atol + rtol * Math.abs(expected));
}

function allclose(actual, expected, atol, rtol) {
  return actual.every((actual, i) => isclose(actual, expected[i], atol, rtol));
}

test('sinusoid->dft', t => {
  const eps = doubleEpsilon * 50;
  let n = 10;
  let freq = 2;
  let x = Array(n * 2);

  // cos(x) = (exp(i x) + exp(-i x)) / 2 => DFT(freq) == DFT(-freq) == n / 2
  for (let i = 0; i < n; i++) { cx.set(x, i, Math.cos(2 * Math.PI * i / n * freq), 0); }
  let y = f.dftComplexInterleaved(x);
  t.ok(allclose(cx.get(y, freq), [n / 2, 0], eps, eps));
  t.ok(allclose(cx.get(y, n - freq), [n / 2, 0], eps, eps));

  // sin(x) = (exp(i x) + exp(-i x)) / 2i => DFT(freq) == n / 2i, DFT(-freq) == -n / 2i. Recall 1/i = -i.
  for (let i = 0; i < n; i++) { cx.set(x, i, Math.sin(2 * Math.PI * i / n * freq), 0); }
  y = f.dftComplexInterleaved(x);
  t.ok(allclose(cx.get(y, freq), [0, -n / 2], eps, eps));
  t.ok(allclose(cx.get(y, n - freq), [0, n / 2], eps, eps));

  t.end();
});

test('4x4 DFT matrix', t => {
  let Dft4 = [];
  // Generate the columns of the 4x4 complex identity matrix (diagonals = 1) and apply each to DFT.
  // Result is the 4x4 DFT matrix that's well known, e.g., Wikipedia.
  for (let i = 0; i < 4; i++) {
    let eye = Array.from(Array(4 * 2), (_, n) => n / 2 === i ? 1 : 0);
    Dft4.push(f.dftComplexInterleaved(eye));
  }

  let o = [1, 0];
  let mo = [-1, 0];
  let i = [0, 1];
  let mi = [0, -1];
  // From Wikipedia: https://en.wikipedia.org/w/index.php?title=DFT_matrix&oldid=848520147#Four-point
  let expected = [[].concat(o, o, o, o), [].concat(o, mi, mo, i), [].concat(o, mo, o, mo), [].concat(o, i, mo, mi)];

  const eps = doubleEpsilon * 50;
  Dft4.every((actual, idx) => allclose(actual, expected[idx], eps, eps));

  t.end()
});