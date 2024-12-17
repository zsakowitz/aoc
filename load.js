import "./util.js"

const [year, day] = aoc.today()

await Promise.all([
  ...ri(2015, year - 1)
    .by(ri(1, 25))
    .map(([x, y]) => aoc.checkInput(x, y)),
  ...ri(1, day).map((x) => aoc.checkInput(year, x)),
])
