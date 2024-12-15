import "../util.js"

input(2024, 10)
  .trim()
  .grid()
  .int()
  .k()
  .filter((p) => +p.v == 0)
  .sum((k) => {
    let p = [k]
    for (let n = 1; n <= 9; n++) {
      p = p
        .flatMap((p) => [
          p.t.v == n && p.t,
          p.b.v == n && p.b,
          p.l.v == n && p.l,
          p.r.v == n && p.r,
        ])
        .filter((x) => x !== false)
        .filter((x, i, a) => a.findIndex((y) => y.x == x.x && y.y == x.y) == i)
    }
    return p.length
  })
  .check(593)

input(2024, 10)
  .trim()
  .grid()
  .int()
  .k()
  .filter((p) => p.v == 0)
  .sum((k) => {
    let p = [[k]]
    for (let n = 1; n <= 9; n++) {
      p = p.flatMap((q) => {
        const p = q[q.length - 1]
        const r = [
          p.t.v == n && p.t,
          p.b.v == n && p.b,
          p.l.v == n && p.l,
          p.r.v == n && p.r,
        ].filter((r) => r != false)
        return r.map((r) => [...q, r])
      })
    }
    return p.length
  })
  .check(1192)
