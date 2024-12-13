import "../util.js"

function linsolve(
  /** @type {number} */ ax,
  /** @type {number} */ ay,
  /** @type {number} */ bx,
  /** @type {number} */ by,
  /** @type {number} */ px,
  /** @type {number} */ py,
) {
  const x = (bx * py - by * px) / (bx * ay - by * ax)
  const y = (py - ay * x) / by
  if (x != Math.floor(x)) return 0
  if (y != Math.floor(y)) return 0
  return 3 * x + y
}

const re =
  /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/g

input(2024, 13)
  .caps(re, (x) => x.slice(1).int())
  .map(([ax, ay, bx, by, x, y]) => linsolve(ax, ay, bx, by, x, y))
  .sum()
  .check(38714)

input(2024, 13)
  .caps(re, (x) => x.slice(1).int())
  .map(([ax, ay, bx, by, x, y]) =>
    linsolve(ax, ay, bx, by, x + 10000000000000, y + 10000000000000),
  )
  .sum()
  .check(74015623345775)
