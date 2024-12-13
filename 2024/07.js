import "../util.js"

/** @returns {Generator<number>} */
function* go(/** @type {number[]} */ b, p2 = false) {
  if (b.length == 1) {
    yield +b[0]
  } else {
    for (const x of go(b.slice(0, -1), p2)) {
      yield x + b.last
      yield x * b.last
      if (p2) yield x.concat(b.last)
    }
  }
}

input(2024, 7)
  .lines()
  .map((l) => l.split(": "))
  .filter(([a, b]) => go(b.ints()).some((x) => x == +a))
  .sum((x) => +x[0])
  .check(5540634308362)

input(2024, 7)
  .lines()
  .map((l) => l.split(": "))
  .filter(([a, b]) => go(b.ints(), true).some((x) => x == +a))
  .sum((x) => +x[0])
  .check(472290821152397)
