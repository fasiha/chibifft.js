var test = require('tape');
var f = require('./index');
test('separateComplexInterleaved', t => {
  var x = Array.from(Array(8), (_, n) => n / 2);
  // 0,0.5, 1,1.5, 2,2.5, 3,3.5
  f.separateComplexInterleaved(x, 0, x.length / 2);
  t.deepEqual(x, [0, 0.5, 2, 2.5, 1, 1.5, 3, 3.5])
  t.end();
})

test('DC signal', t => {
  var x = [1, 0, 0, 0, 0, 0, 0, 0];
  f.fftComplexInterleaved(x);
  t.deepEqual(x, Array.from(Array(8), (_, n) => 0 + !(n % 2)))
  t.end();
})