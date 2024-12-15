import "../util.js"

const i0 = input(2024, 15).split("\n\n")
const g = i0[0].grid()
const ss = i0[1]
  .chars()
  .map((x) =>
    x == "^"
      ? pt(0, -1)
      : x == ">"
        ? pt(1, 0)
        : x == "<"
          ? pt(-1, 0)
          : x == "v"
            ? pt(0, 1)
            : null,
  )
  .filter((x) => x != null)
for (const d of ss) {
  const p = nn(g.k().find((k) => k.v == "@"))
  let q = p.c()
  let i = 0
  while (true) {
    const n = q.add(d)
    if (n.v == "#" || n.v == ".") {
      break
    }
    q = n
    i++
  }
  if (q.add(d).v == "#") {
    continue
  }
  for (let j = i; j >= 0; j--) {
    const a = p.add(d.scale(j))
    const b = p.add(d.scale(j + 1))
    b.v = a.v
  }
  p.v = "."
}
;(".")
g.k().sum((x) => (x.v == "O" ? x.x + 100 * x.y : 0))
