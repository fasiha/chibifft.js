"use strict";
function mul(a, b, x, y) { return [a * x - b * y, a * y + b * x]; }
function add(a, b, x, y) { return [a + x, b + y] };
function sub(a, b, x, y) { return [a - x, b - y] };
function get(v, n) { return v.slice(2 * n, 2 * n + 2); }
function set(v, n, a, b) {
  v[2 * n] = a;
  v[2 * n + 1] = b;
}
function expj(phase) { return [Math.cos(phase), Math.sin(phase)]; }
module.exports = {
  mul,
  add,
  sub,
  get,
  set,
  expj,
};