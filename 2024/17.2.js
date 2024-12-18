import "../util.js"

const exp = [2, 4, 1, 5, 7, 5, 4, 5, 0, 3, 1, 6, 5, 5, 3, 0]

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
    const [a0, a1, a2] = a.bits()
    // const [...rest, a2, a1, a0] = a
    out.push((a % 8 ^ 3 ^ (a >> ([a0, a1, a2].bits() ^ 5))) % 8)
    a = a >> 3
  } while (a != 0)

  return out.join(",")
}

for (const x of rx(1_000_000)) {
  const o0 = normal(x)
  const o1 = n1(x)
  if (o0 != o1) {
    throw new Error("nope")
  }
}
