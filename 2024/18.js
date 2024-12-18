import "../util.js"

const i = input(2024, 18).lxy()

function go(/** @type {number} */ limit) {
  const g = Grid.of(true, 71)

  for (const p of i.slice(0, limit)) {
    g.set(p, false)
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

const idx = rx(i.length).search((n) => go(n).f().s())
i[idx].xy().check("25,6", "YESIMSURE") // p2
