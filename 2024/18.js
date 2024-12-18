import "../util.js"

const i = input(2024, 18)
  .lines()
  .map((x) => x.split(",").int())

function go(/** @type {number} */ limit) {
  const g = new Grid(
    Array(71)
      .fill(0)
      .map(() =>
        Array(71)
          .fill(0)
          .map(() => true),
      ),
  )
  for (const p of i.slice(0, limit)) {
    g.rows[p[1]][p[0]] = false
  }

  const gr = new Graph()
  const go = g.map((x) => (x ? gr.add(0) : null))
  for (const k of go.k()) {
    if (!k.v) continue
    for (const n of k.n()) {
      if (n?.v) k.v.link(n.v, 1)
    }
  }

  const s = nn(go.at(pt(0, 0)))
  const e = nn(go.at(pt(70, 70)))
  const dj = gr.djikstra(s)
  return nn(dj.get(e))
}

go(1024).check(372) // p1

const idx = rx(i.length).search((n) => (go(n) == Infinity ? 1 : -1))
i[idx].join(",").check("25,6", "YESIMSURE") // p2
