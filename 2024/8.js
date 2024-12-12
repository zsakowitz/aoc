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
    for (const [a, b] of g
      .k()
      .filter((x) => x.v == char)
      .toArray()
      .choose2()) {
      if (part == 1) {
        b.add(b, a).xq()?.addIn(output)
        a.add(a, b).xq()?.addIn(output)
      } else {
        for (const [ax, bx] of [a, b].perms()) {
          ints()
            .mnn((n) => bx.add(bx.sub(ax).scale(n)).xq()?.addIn(output))
            .run()
        }
      }
    }
  }

  // same on both:
  return output.size
}

go(input(2024, 8), 1).check(390)
go(input(2024, 8), 2).check(1246)
