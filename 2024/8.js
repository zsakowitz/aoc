import "../util.js"

function go(/** @type {string} */ input, /** @type {1|2} */ part) {
  // same on both
  const g = input.grid()
  const output = ps()
  const chars = input
    .trim()
    .mall(/[^.\s]/g)
    .unique()
  for (const char of chars) {
    const poss = g
      .k()
      .filter((x) => x.v == char)
      .toArray()
    for (const [a, b] of poss.choose2()) {
      if (part == 1) {
        const c = pt(b.x + (b.x - a.x), b.y + (b.y - a.y))
        const d = pt(a.x + (a.x - b.x), a.y + (a.y - b.y))
        if (g.has(c)) {
          output.add(c)
        }
        if (g.has(d)) {
          output.add(d)
        }
      } else {
        for (const [ax, bx] of [
          [a, b],
          [b, a],
        ]) {
          for (const n of ints) {
            const c = bx.add(bx.sub(ax).scale(n))
            if (g.has(c)) {
              output.add(c)
            } else break
          }
        }
      }
    }
  }

  // same on both:
  return output.size
}

go(input(2024, 8), 1).check(390)
go(input(2024, 8), 2).check(1246)
