import "../util.js"

function i(/** @type {number[][]} */ a) {
  return a.map(([a, b, ax, bx]) => [
    (a + ax).imod(101),
    (b + bx).imod(103),
    ax,
    bx,
  ])
}

/** @type {number[][]} */
const a = input(2024, 14)
  .lines()
  .map((x) =>
    x.cap(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/, (x) => x.slice(1).int()),
  )

const r = rx(100).reduce(i, a)

let x0 = 0
let x1 = 0
let x2 = 0
let x3 = 0
for (const [x, y] of r) {
  if (x < 50 && y < 51) x0++
  if (x > 50 && y < 51) x1++
  if (x < 50 && y > 51) x2++
  if (x > 50 && y > 51) x3++
}
;(x0 * x1 * x2 * x3).check(218965032)

function m(/** @type {number[][]} */ a) {
  const b = Object.create(null)
  for (const [x, y] of a) {
    b[x + "," + y] = true
  }
  return Object.entries(b).length == 500
}

ints().acc(i, a).finn(m).check(7036)
