import "../util.js"
;`89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`
  .trim()
  .grid()
  .k()
  .filter((p) => +p.v == 0)
  .sum((k) => {
    let p = [k]
    for (let n = 1; n <= 9; n++) {
      p = p
        .flatMap((p) => [
          p.t().v == n && p.t(),
          p.b().v == n && p.b(),
          p.l().v == n && p.l(),
          p.r().v == n && p.r(),
        ])
        .filter((x) => x)
        .filter((x, i, a) => a.findIndex((y) => y.x == x.x && y.y == x.y) == i)
    }
    return p.length
  })
  .check(593)

input()
  .trim()
  .grid()
  .k()
  .filter((p) => p.v == 0)
  .sum((k) => {
    let p = [[k]]
    for (let n = 1; n <= 9; n++) {
      p = p.flatMap((q) => {
        const p = q[q.length - 1]
        const r = [
          p.t().v == n && p.t(),
          p.b().v == n && p.b(),
          p.l().v == n && p.l(),
          p.r().v == n && p.r(),
        ].filter((r) => r)
        return r.map((r) => [...q, r])
      })
    }
    return p.length
  })
  .check(1192)
