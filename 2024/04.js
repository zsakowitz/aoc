import "../util.js"

// p1
const i = input(2024, 4)

!(
  i
    .grid()
    .k()
    .sum((q) => +q.drb(3).j.is(mx`XMAS`) + +q.drt(3).j.is(mx`XMAS`)) +
  i.count(mx`XMAS`) +
  i.tx().count(mx`XMAS`)
).check(2504)

// p2
i.grid()
  .k()
  .sum((pt) => pt.lt.drb(2).j.is(mx`SAM`) && pt.rt.dlb(2).j.is(mx`SAM`))
  .check(1923)
