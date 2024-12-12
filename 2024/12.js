import "../util.js"

function go(/** @type {1 | 2} */ part) {
  const g = input(2024, 12).grid()

  const visited = ps()

  return g.k().sum((k) => {
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
    const perim = part == 1 ? ps(claimed).perim() : ps(claimed).edges()
    return area * perim
  })
}

go(1).check(1449902)
go(2).check(908042)
