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
g.k()
  .sum((x) => (x.v == "O" ? x.x + 100 * x.y : 0))
  .check(1441031)

{
  const [gridSource, movesSource] = input(2024, 15).split("\n\n")

  let g = gridSource
    .replaceAll("#", "##")
    .replaceAll("O", "[]")
    .replaceAll(".", "..")
    .replaceAll("@", "@.")
    .grid()

  const m = movesSource.chars().mnn((char) => char.dir())

  function lr(/** @type {Point} */ d) {
    const p = g.i("@")
    let q = p.c()
    let canMove
    let m = 0
    while (true) {
      const n = q.add(d)
      if (n.v == "#") {
        canMove = false
        break
      } else if (n.v == ".") {
        canMove = true
        break
      }
      q = n
      m++
    }
    if (!canMove) return
    for (let s = m; s >= 0; s--) {
      p.add(d.scale(s + 1)).v = p.add(d.scale(s)).v
    }
    p.v = "."
  }

  function move(/** @type {Point} */ l, /** @type {Point} */ d) {
    if (l.v == "]") l = l.l
    else if (l.v != "[") return

    const { r } = l
    const l2 = l.add(d)
    const r2 = r.add(d)

    if (l2.v == "#" || r2.v == "#") {
      return
    }

    const gp = g.c()
    move(l2, d)
    move(r2, d)

    if (l2.v == "." && r2.v == ".") {
      l2.v = "["
      r2.v = "]"
      l.v = "."
      r.v = "."
      return
    } else {
      g.copyFrom(gp)
    }
  }

  function vert(/** @type {Point} */ d) {
    const p = g.i("@")
    const p2 = p.add(d)
    move(p2, d)

    if (p2.v == ".") {
      p2.v = "@"
      p.v = "."
    }
  }
  for (const s of m) {
    if (s.y) {
      vert(s)
    } else {
      lr(s)
    }
  }
  const res2 = g.k().sum((x) => (x.v == "[" ? x.x + x.y * 100 : 0))
  res2.check(1425169)

  // tried 1376958
  // tried 1394939
  // trying 1381446
}
