import "../util.js"

const s = "2,4,1,5,7,5,4,5,0,3,1,6,5,5,3,0"
const d = s.split(",").int()

function go(a) {
  return go() == 2

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
    b = b ^ 0b101
    let c = a >> b
    b = b ^ c
    b = b ^ 0b110
    const v = b % 8
    a = a >> 3
    return v
  }
}

console.time()
for (const i of ints()) {
  if (go(i)) console.log(i)
}
// const q = ints().find((x) => {
//   if (x % 10_000_000 == 0) console.timeLog("default", x)
//   return go(x)
// })
// console.log({ q })
