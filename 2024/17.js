import "../util.js"

const s = "2,4,1,5,7,5,4,5,0,3,1,6,5,5,3,0"

function go(a) {
  return go() == 2 && a != 0

  function go() {
    const v = a % 8 ^ 0b011 ^ (a >> (a % 8 ^ 0b101)) % 8
    a = a >> 3
    return v
  }
}

const q = [
  806456, 806462, 806526, 806529, 806531, 806537, 806539, 806547, 806555,
]
const last = q.last

for (const i of ints()) {
  if (i == last) {
    if (!go(i)) throw new Error("invalid " + i)
    console.log(i, i % 8)
    process.exit()
  } else if (q[0] <= i && i < q.last) {
    const v = go(i)
    const e = q.includes(i)
    if (v != e) throw new Error("invalid " + i)
    if (v) console.log(i, i % 8)
  } else {
    if (go(i)) console.log(i, i % 8)
  }
}
// const q = ints().find((x) => {
//   if (x % 10_000_000 == 0) console.timeLog("default", x)
//   return go(x)
// })
// console.log({ q })
