const exp = [2, 4, 1, 5, 7, 5, 4, 5, 0, 3, 1, 6, 5, 5, 3, 0]

function normal(/** @type {number} */ a) {
  const out = []

  do {
    const b0 = a % 8
    const b1 = b0 ^ 5
    const c = a >> b1
    const b2 = b1 ^ c
    a = a >> 3
    const b3 = b2 ^ 6
    out.push(b3 % 8)
  } while (a != 0)

  return out.join(",")
}
