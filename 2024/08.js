import "../util.js"

function go(/** @type {string} */ input, /** @type {1|2} */ part) {
  const g = input.grid()
  const output = ps()
  input
    .trim()
    .mall(/[^.\s]/g)
    .unique()
    .map((char) => {
      for (const [a, b] of g.k().f(char).arr().c2()) {
        for (const [ax, bx] of [a, b].perms()) {
          if (part == 1) {
            bx.add(bx, ax).xq()?.addTo(output)
          } else {
            ints()
              .mnn((n) => bx.add(bx.sub(ax).scale(n)).xq()?.addTo(output))
              .run()
          }
        }
      }
    })
  return output.size
}

go(input(2024, 8), 1).check(390)
go(input(2024, 8), 2).check(1246)
