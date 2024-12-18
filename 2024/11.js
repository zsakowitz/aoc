import "../util.js"

function go(/** @type {number} */ count) {
  const map = Object.create(null)

  /** @returns {number} */ function iter(
    /** @type {number} */ x,
    /** @type {number} */ i,
  ) {
    if (map[x + "," + i] != null) {
      return map[x + "," + i]
    }
    if (i == 0) return 1
    const n =
      x == 0 ? [1]
      : x.toString().length % 2 ? [x * 2024]
      : x.toString().xmid().int()
    const v = n.map((n) => iter(n, i - 1)).sum()
    map[x + "," + i] = v
    return v
  }

  return input(2024, 11)
    .ints()
    .map((n) => iter(n, count))
    .sum()
}

go(25).check(183484)
go(75).check(218817038947400)
