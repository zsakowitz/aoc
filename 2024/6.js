import "../util.js"

const g = input(2024, 6).grid()
const ps = new PointSet()
let q = nn(g.k().find((x) => x.v == "^"))
let d = pt(0, -1)

while (q.exists()) {
  ps.add(q)

  if (q.add(d).v == "#") {
    d = d.c90()
    continue
  }

  q = q.add(d)
}

ps.size.check(5404)

function hasLoop(/** @type {ReturnType<string['grid']>} */ g) {
  const ps = new Set()
  let q = g.k().find((x) => x.v == "^")
  if (q == null) return false
  let d = pt(0, -1)

  while (q.exists()) {
    const id = q.id() + ";" + d.id()
    if (ps.has(id)) return true
    ps.add(id)

    if (q.add(d).v == "#") {
      d = d.c90()
      continue
    }

    q = q.add(d)
  }

  return false
}

const g2 = input(2024, 6).grid()
g2.k()
  .count((k) => {
    const a = g2.c()
    a.rows[k.i][k.j] = "#"
    return hasLoop(a)
  })
  .check(1984)
