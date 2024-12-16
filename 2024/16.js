const g = input().grid()
const s = g.indexOf("S")
const e = g.indexOf("E")
s.v = "."
e.v = "."
const ret = g.map((x) => {
  if (x == "#") return false
  const t = [Infinity, pt(0, -1)]
  const b = [Infinity, pt(0, 1)]
  const l = [Infinity, pt(-1, 0)]
  const r = [Infinity, pt(1, 0)]
  t[2] = b[2] = l
  t[3] = b[3] = r
  l[2] = r[2] = t
  l[3] = r[3] = b
  return [t, r, b, l]
})
const end = ret.at(e)
s.g = ret
s.v[1][0] = 0
let i = 0
while (true) {
  for (const k of ret.k()) {
    if (!k.v) continue
    for (const [vi, vd] of k.v.entries()) {
      const [v, d, l, r] = vd
      if (v != i) continue
      for (const x of [l, r]) {
        if (v + 1000 < x[0]) {
          x[0] = v + 1000
        }
      }
      const n = k.add(d).v
      if (n && v + 1 < n[vi][0]) {
        n[vi][0] = v + 1
      }
    }
  }
  i++
  const f = end.find((x) => x[0] != Infinity)
  if (f) {
    console.log(f)
    break
  }
  if (i % 1000 == 0) console.log(i)
}

const cache = Object.create(null)

/** @returns {boolean} */
function canReach(
  /** @type {Grid<string>} */ g,
  /** @type {Point} */ start,
  /** @type {Point} */ end,
  /** @type {Point} */ dir,
  /** @type {number} */ within,
) {
  const id = start.id() + ";" + dir.id() + ";" + within
  if (cache[id] != null) return cache[id]

  if (within == 0) {
    return start.is(end)
  }

  if (within >= 1000) {
    if (
      canReach(g, start, end, dir.c90(), within - 1000) ||
      canReach(g, start, end, dir.cc90(), within - 1000)
    ) {
      cache[id] = true
      return true
    }
  }

  const next = start.add(dir)
  return (cache[id] = next.v == "." && canReach(g, next, end, dir, within - 1))
}

{
  const t = [ps(), pt(0, -1)]
  const b = [ps(), pt(0, 1)]
  const l = [ps(), pt(-1, 0)]
  const r = [ps(), pt(1, 0)]
  t[2] = b[2] = l
  t[3] = b[3] = r
  l[2] = r[2] = t
  l[3] = r[3] = b
  const o = [t, r, b, l]
  for (const [i, [v]] of ret.at(e).entries()) {
    if (v != Infinity) o[i].add(pt(e.x, e.y, undefined, ret))
  }
  for (let j = 0; j <= 92432; j++) {
    for (const [i, [ps, d, pl, pr]] of o.entries()) {
      for (const k of ps.k().toArray()) {
        const prev = k.sub(d)
        if (prev.v) {
          if (prev.v[i][0] == k.v[i][0] - 1) {
            ps.add(prev)
          }
        }
        const [v, _, l, r] = k.v[i]
        if (l[0] == v[0] - 1000) pl.add(k)
        if (r[0] == v[0] - 1000) pr.add(k)
      }
    }
    if (i < 100 && i % 10 == 0) console.log(i)
    if (i < 1000 && i % 100 == 0) console.log(i)
    if (i % 1000 == 0) console.log(i)
  }
}
