import "../util.js"

/** @typedef {[number[], Point, X, X]} X */

function go(/** @type {string} */ input, /** @type {number} */ within) {
  console.time()

  const g = input.grid()
  const s = g.indexOf("S")
  const e = g.indexOf("E")
  s.v = "."
  e.v = "."

  // IDEA: start + end == within

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
