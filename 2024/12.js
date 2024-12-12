import "../util.js"

const g = input(2024, 12).grid()

const visited = ps()

g.k()
  .sum((k) => {
    if (visited.has(k)) return 0
    const claimed = [k]
    const { v } = k
    while (true) {
      const next = claimed
        .flatMap((x) => x.nf())
        .f(v)
        .unique((x) => x.id())
        .filter((x) => !claimed.any(x))
      if (!next.length) break
      claimed.push(...next)
    }
    claimed.forEach((x) => visited.add(x))
    const area = claimed.length
    const perim = claimed.sum((p) => {
      return (
        +!claimed.any(p.t()) +
        +!claimed.any(p.b()) +
        +!claimed.any(p.l()) +
        +!claimed.any(p.r())
      )
    })
    console.log({ v, area, perim })
    return area * perim
  })
  .check(1449902)
