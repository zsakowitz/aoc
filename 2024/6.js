import "../util.js"

const g = input(2024, 6).grid()
let p = g.fi("^")
let d = pt(0, -1)
const coords = Array(1000)
  .fill(0)
  .map(() => Array(1000).fill(0))

while (true) {
  coords[p.i][p.j] = 1
  while (p.add(d).v == "#") {
    d = d.c90()
  }
  while (p.add(d).v == ".") {
    p = p.add(d)
    coords[p.i][p.j] = 1
  }
  if (p.add(d).v == null) {
    break
  }
}

coords.sum((r) => r.count((x) => x))
