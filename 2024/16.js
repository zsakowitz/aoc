// const g = input().grid()
// const s = g.indexOf("S")
// const e = g.indexOf("E")
// s.v = "."
// e.v = "."
// const ret = g.map((x) => {
//   if (x == "#") return false
//   const t = [Infinity, pt(0, -1)]
//   const b = [Infinity, pt(0, 1)]
//   const l = [Infinity, pt(-1, 0)]
//   const r = [Infinity, pt(1, 0)]
//   t[2] = b[2] = l
//   t[3] = b[3] = r
//   l[2] = r[2] = t
//   l[3] = r[3] = b
//   return [t, r, b, l]
// })
// const end = ret.at(e)
// s.g = ret
// s.v[1][0] = 0
// let i = 0
// let f
// while (true) {
//   for (const k of ret.k()) {
//     if (!k.v) continue
//     for (const [vi, vd] of k.v.entries()) {
//       const [v, d, l, r] = vd
//       if (v != i) continue
//       for (const x of [l, r]) {
//         if (v + 1000 < x[0]) {
//           x[0] = v + 1000
//         }
//       }
//       const n = k.add(d).v
//       if (n && v + 1 < n[vi][0]) {
//         n[vi][0] = v + 1
//       }
//     }
//   }
//   i++
//   f = end.find((x) => x[0] != Infinity)
//   if (f) {
//     console.log(f)
//     break
//   }
//   if (i % 1000 == 0) console.log(i)
// }

import "../util.js"

function go(/** @type {string} */ input, /** @type {number} */ within) {
  console.time()
  const g = input.grid()
  const s = g.indexOf("S")
  const e = g.indexOf("E")
  s.v = "."
  e.v = "."

  /** @type {Record<string, Record<number, boolean>>} */
  const cached = Object.create(null)

  /** @returns {boolean} */
  function go(
    /** @type {Grid<string>} */ g,
    /** @type {Point} */ start,
    /** @type {Point} */ end,
    /** @type {Point} */ dir,
    /** @type {number} */ within,
  ) {
    {
      const c = (cached[[start, dir].id()] ??= Object.create(null))[within]
      if (c != null) return c
    }

    {
      const c = (cached[[start, dir.neg()].id()] ??= Object.create(null))[
        within + 2000
      ]
      if (c != null)
        return ((cached[[start, dir].id()] ??= Object.create(null))[within] = c)
    }

    if (within == 0) {
      return ((cached[[start, dir].id()] ??= Object.create(null))[within] =
        start.is(end))
    }

    let success = false

    if (within >= 1000) {
      const a = go(g, start, end, dir.c90(), within - 1000)
      const b = go(g, start, end, dir.cc90(), within - 1000)
      if (a || b) success = true
    }

    const next = start.add(dir)
    const val = next.v == "." && go(g, next, end, dir, within - 1)
    if (val) success = true

    return ((cached[[start, dir].id()] ??= Object.create(null))[within] =
      success)
  }

  go(g, s, e, pt(1, 0), within)

  const v = Object.entries(cached)
    .filter((x) => Object.entries(x[1]).some((x) => x[1]))
    .map((x) => x[0].split(";")[0].ints())
    .map((x) => pt(...x))
    .unique((x) => x.id())

  console.timeEnd()
  return v.length
}

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

go(
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
).check(64)
