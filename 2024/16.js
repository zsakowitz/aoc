import "../util.js"

function go(
  /** @type {string} */ input,
  /** @type {number} */ p1expected,
  /** @type {number} */ p2expected,
) {
  console.time()

  const g = input.grid()
  const s = g.indexOf("S")
  const e = g.indexOf("E")
  s.v = "."
  e.v = "."

  function create(/** @type {"add" | "sub"} */ f) {
    /** @type {Graph<0>} */
    const graph = new Graph()
    const o = g.map((x) => (x == "." ? Point.ring(() => graph.add(0)) : null))
    for (const k of o) {
      if (!k.v) continue
      for (const [i, [v, d, ...lr]] of k.v.entries()) {
        for (const [side] of lr) {
          v.link(side, 1000)
        }
        const n = k[f](d)
        if (n.v) {
          v.link(n.v[i][0], 1)
        }
      }
    }

    console.timeLog("default", "building graph")

    return t(graph, o)
  }

  const [nor, onor] = create("add")
  const [rev, orev] = create("sub")

  const nord = nor.djikstra(nn(onor.at(s))[1][0])
  console.timeLog("default", "running djikstra")

  const ends = nn(onor.at(e))
    .map((ring) => nn(nord.get(ring[0])))
    .enum()

  const p1 = ends.map((x) => x[1]).min()
  p1.check(p1expected)

  console.timeLog("default", "finished p1")

  const revd = rev.djikstra(
    ends.filter((x) => x[1] == p1).map(([i]) => nn(orev.at(e))[i][0]),
  )
  console.timeLog("default", "running djikstra #2")

  const p2 = onor.k().count((n) => {
    if (!n.v) return
    const r = n.in(orev)
    if (!r.v) return
    return [0, 1, 2, 3].some((idxRing) => {
      const a = nn(n.v)[idxRing][0]
      const b = nn(r.v)[idxRing][0]
      const as = nord.get(a) ?? NaN
      const bs = revd.get(b) ?? NaN
      return as + bs == p1
    })
  })
  console.timeLog("default", "counting p2")
  p2.check(p2expected)

  console.timeEnd()
}

function go2(
  /** @type {string} */ input,
  /** @type {number} */ p1expected,
  /** @type {number} */ p2expected,
) {
  console.group(p1expected, p2expected)
  try {
    go(input, p1expected, p2expected)
  } finally {
    console.groupEnd()
  }
}

go2(
  `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`,
  7036,
  45,
)

go2(
  `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`,
  11048,
  64,
)

go2(input(2024, 16), 92432, 458)
