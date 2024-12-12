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
        const c = b.add(b.sub(a))
        const d = a.add(a.sub(b))
        c.xq()?.addIn(output)
        d.xq()?.addIn(output)
      } else {
        for (const [ax, bx] of [a, b].perms()) {
          for (const n of ints()) {
            if (!bx.add(bx.sub(ax).scale(n)).xq()?.addIn(output)) break
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
