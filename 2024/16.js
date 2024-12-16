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

/** @typedef {[number[], Point, X, X]} X */

function go(/** @type {string} */ input, /** @type {number} */ within) {
  console.time()

  const g = input.grid()
  const s = g.indexOf("S")
  const e = g.indexOf("E")
  s.v = "."
  e.v = "."

  const q = g.map((x) => {
    if (x == "#") return false
    /** @type {X} */ const t = [[], pt(0, -1)]
    /** @type {X} */ const b = [[], pt(0, 1)]
    /** @type {X} */ const l = [[], pt(-1, 0)]
    /** @type {X} */ const r = [[], pt(1, 0)]
    t[2] = b[2] = l
    t[3] = b[3] = r
    l[2] = r[2] = t
    l[3] = r[3] = b
    return [t, r, b, l]
  })

  e.in(q).v[1][0].push(within)

  let start = Date.now()
  for (let num = within; num > 0; num--) {
    if (num % 100 == 0)
      console.log({
        num,
        d:
          (Date.now() - start) / ((within - num) / within) +
          (start - Date.now()),
      })
    q.k().forEach((p) => {
      if (!p.v) return
      for (const [i, [v, d, l, r]] of p.v.entries()) {
        if (!v.includes(num)) continue

        {
          const n = p.add(d)
          if (n.v) {
            n.v[i][0].add(num - 1)
          }
        }

        if (num >= 1000) {
          for (const x of [l, r]) {
            x[0].add(num - 1000)
          }
        }
      }
    })
  }

  // console.log(
  //   q.rows
  //     .flat()
  //     .filter((x) => x != false)
  //     .flatMap((x) => x.map((x) => x[0]))
  //     .filter((x) => x.length),
  // )
  console.timeEnd()
  return 0
}

// go(input(2024, 16), 94232)

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
