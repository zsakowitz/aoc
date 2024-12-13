import "../util.js"

input(2024, 2)
  .lines()
  .sws()
  .int()
  .count((row) => row.sd().allany(ri(1, 3), ri(-3, -1)))
  .check(591)

input(2024, 2)
  .lines()
  .sws()
  .int()
  .count((row) =>
    [row, ...row.woall()].some((x) => x.sd().allany(ri(1, 3), ri(-3, -1))),
  )
  .check(621)
