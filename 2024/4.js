import "../util1.js"

// p1
const i = input(2024, 4)

!(
  i
    .grid()
    .k()
    .sum(
      (q) =>
        +q.diag(3, 3).join("").is("XMAS".mx()) +
        +q.diag(3, -3).join("").is("XMAS".mx()),
    ) +
  i.count("XMAS".mx()) +
  i.tx().count("XMAS".mx())
).check(2504)

// p2
i.grid()
  .k()
  .sum(
    (pt) =>
      +(
        pt.lt().diag(2, 2).join("").is("SAM".mx()) &&
        pt.rt().diag(-2, 2).join("").is("SAM".mx())
      ),
  )
  .check(1923)
