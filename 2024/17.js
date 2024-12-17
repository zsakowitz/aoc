import "../util.js"

const s = "2,4,1,5,7,5,4,5,0,3,1,6,5,5,3,0"
const d = s.split(",").int()

function go(a) {
  return go() == 2 && a != 0

  //   for (const v of d.slice(0, -1)) {
  //     const r = go()
  //     if (v != r) return false
  //     if (a == 0) return false
  //   }
  //
  //   const r = go()
  //   if (d.last != r) return false
  //   return a == 0

  function go() {
    // const ret = (a % 8 ^ 0b11 ^ ((a >> 3) >> (a % 8 ^ 0b101))) % 8
    // a >>= 3
    // return ret

    let b = a % 8
    const v = (b ^ 0b101) % 8 ^ (a >> (b ^ 0b101)) % 8 ^ 0b110
    a = a >> 3
    return v
  }
}

const q = [
  1840894, 1840897, 1840905, 1840928, 1840936, 1840944, 1840952, 1840958,
  1841022, 1841025, 1841033,
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
