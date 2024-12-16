import "../util.js"

function go(/** @type {string} */ input, /** @type {number} */ within) {
  console.time()

  const g = input.grid()
  const s = g.indexOf("S")
  const e = g.indexOf("E")
  s.v = "."
  e.v = "."

  const dists = g.map((x) =>
    x == "#"
      ? null
      : t(
          Point.ring(() => /** @type {number[]} */ ([])),
          Point.ring(() => /** @type {number[]} */ ([])),
        ),
  )

  nn(dists.at(s))[0][1][0].push(within)
  // nn(dists.at(e))[1][0][0].push(within)
  // nn(dists.at(e))[1][1][0].push(within)
  // nn(dists.at(e))[1][2][0].push(within)
  nn(dists.at(e))[1][3][0].push(within)

  for (let i = within; i > 0; i--) {
    if (i % 1000 == 0) console.log(i)

    for (const k of dists.k()) {
      if (!k.v) continue

      for (const [idxPart, ring] of k.v.entries()) {
        for (const [idxRing, [values, dir, l, r]] of ring.entries()) {
          if (!values.some((x) => x == i)) continue

          {
            const next = k.add(dir)
            if (next.v) {
              next.v[idxPart][idxRing][0].add(i - 1)
            }
          }

          if (i >= 1000) {
            for (const side of [l, r]) {
              side[0].add(i - 1000)
            }
          }
        }
      }
    }
  }

  // IDEA: start + end == within

  console.timeEnd()

  return dists.k().count(
    (k) =>
      k.v &&
      [0, 1, 2, 3].some((idxRing) => {
        const a = nn(k.v)[0][idxRing][0]
        const b = nn(k.v)[1][(idxRing + 2) % 4][0]
        return a.some((a) => b.some((b) => a + b == within))
      }),
  )
}

go(input(2024, 16), 94232)

go(
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
).check(45)

// go(
//   `#################
// #...#...#...#..E#
// #.#.#.#.#.#.#.#.#
// #.#.#.#...#...#.#
// #.#.#.#.###.#.#.#
// #...#.#.#.....#.#
// #.#.#.#.#.#####.#
// #.#...#.#.#.....#
// #.#.#####.#.###.#
// #.#.#.......#...#
// #.#.###.#####.###
// #.#.#...#.....#.#
// #.#.#.#####.###.#
// #.#.#.........#.#
// #.#.#.#########.#
// #S#.............#
// #################`,
//   11048,
// ).check(64)
