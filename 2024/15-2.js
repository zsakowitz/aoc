import "../util.js"

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

function vert(/** @type {Point} */ d) {
  function move(/** @type {Point} */ l) {
    if (l.v == "]") l = l.l
    else if (l.v != "[") return

    const { r } = l
    const l2 = l.add(d)
    const r2 = r.add(d)

    if (l2.v == "#" || r2.v == "#") {
      return
    }

    const gp = g.c()
    move(l2)
    move(r2)

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

  const p = g.i("@")
  const p2 = p.add(d)
  move(p2)

  if (p2.v == ".") {
    p2.v = "@"
    p.v = "."
  }
}

const lasts = []
let i = 0
function n() {
  lasts.push([g.c(), i])
  const s = m[i]
  if (!s) return
  i++
  if (s.y) {
    vert(s)
  } else {
    lr(s)
  }
  g.draw()
}
function p() {
  ;[g, i] = lasts.pop()
  g.draw()
}
// g.draw()
for (const s of m) {
  if (s.y) {
    vert(s)
  } else {
    lr(s)
  }
}
console.log("---")
const res1 = g.k().sum((x) => (x.v == "O" ? x.x + x.y * 100 : 0))
console.log(res1)
const res2 = g.k().sum((x) => (x.v == "[" ? x.x + x.y * 100 : 0))
console.log(res2)
// g.log()

// tried 1376958
// tried 1394939
// trying 1381446
