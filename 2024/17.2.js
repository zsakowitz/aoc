import "../util.js"

const exp = [2, 4, 1, 5, 7, 5, 4, 5, 0, 3, 1, 6, 5, 5, 3, 0]
const v = exp.join(",")

function normal(/** @type {number} */ a) {
  const out = []

  do {
    let b = a % 8
    b = b ^ 5
    const c = a >> b
    b = b ^ c
    a = a >> 3
    b = b ^ 6
    out.push(b % 8)
  } while (a != 0)

  return out.join(",")
}

function n1(/** @type {number} */ a) {
  const out = []

  do {
    const [a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10] = a.bits()
    out.push(
      [!a0, !a1, a2].bits() ^
        [a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10]
          .slice([!a0, a1, !a2].bits())
          .slice(0, 3)
          .bits(),
    )
    a = a >> 3
  } while (a != 0)

  return out.join(",")
}

// max: 1<<56
const q = new Set()
console.time()
for (const x of rx(1 << 14)) {
  if (normal(x).startsWith(v.slice(0, 4))) {
    const e = x.toString(2).padStart(20, "0").slice(-14)
    q.add(e)
    console.log(e)
  }
  // const o1 = n1(x)
  // if (o0 != o1) {
  // throw new Error("nope")
  // }
}
console.timeEnd()
console.log(q)

// 12: 1.69ms
// 13: 2.334ms
// 14: 3.595ms
// 20: 134.879ms
// 28: 43.243s
