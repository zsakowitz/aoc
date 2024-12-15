import "./util.js"

const i0 = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`.on`

`
const g = i0[0]
  .replaceAll("#", "##")
  .replaceAll("O", "[]")
  .replaceAll(".", "..")
  .replaceAll("@", "@.")
  .grid()
function go(/** @type {Point} */ d) {
  const p = nn(g.k().find((k) => k.v == "@"))
  if (d.x) {
    try {
      console.log("horiz")
      g.log()
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
        return
      }
      for (let j = i; j >= 0; j--) {
        const a = p.add(d.scale(j))
        const b = p.add(d.scale(j + 1))
        b.v = a.v
      }
      p.v = "."
      return
    } finally {
      console.log("--")
      g.log()
    }
  }
  console.log("vert " + (d.y == 1 ? "down" : "up"))
  g.log()
  try {
    const b = ps()
    if (p.add(d).v == "[") b.add(p.add(d))
    else if (p.add(d).v == "]") b.add(p.add(d).l())
    while (true) {
      let lastSize = b.size
      for (const k of b.k().toArray()) {
        if (k.add(d).v == "[") b.add(k.add(d))
        else if (k.add(d).v == "]") b.add(k.add(d).l())
        if (k.r().add(d).v == "[") b.add(k.r().add(d))
      }
      if (b.size == lastSize) break
    }
    for (const a of b.k().toArray().toReversed()) {
      if (a.v != "[") {
        console.log("issue")
      }
      const b = a.r()
      if (a.add(d).v == "." && b.add(d).v == ".") {
        a.add(d).v = "["
        b.add(d).v = "]"
        a.v = "."
        b.v = "."
      }
    }
    if (p.add(d).v == ".") {
      p.v = "."
      p.add(d).v = "@"
    }
  } finally {
    console.log("--")
    g.log()
  }
}
function ss() {
  return i0[1]
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
}
const bx = g.k().count(["[", "]"])
const dx = g.k().count(".")
for (const d of ss()) {
  go(d)
  if (
    g
      .k()
      .some(
        (x) =>
          (x.v == "[" && x.add(pt(1, 0)).v != "]") ||
          (x.v == "]" && x.l().v != "["),
      ) ||
    g.k().count(["[", "]"]) != bx ||
    g.k().count(".") != dx
  ) {
    console.warn("issue")
  }
}
const s = g.k().sum((x) => (x.v == "[" ? x.x + 100 * x.y : 0))
if (s == 1441798) console.log("sigh")
console.log(s)
