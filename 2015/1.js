import "../util.js"

input(2015, 1)
  .do((x) => x.count("(") - x.count(")"))
  .check(74)

input(2015, 1)
  .chars()
  .v()
  .acc((a, b) => (b == "(" ? a + 1 : a - 1), 0)
  .fi((x) => x < 0)
  .inc()
  .check(1795)
