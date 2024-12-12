import "../util.js"

/** @type {false} */
const FALSE = false
/** @type {true} */
const TRUE = true

{
  const data = input(2024, 9)
    .chars()
    .flatMap((x, i) => (i % 2 ? t(FALSE, 0) : t(true, i / 2)).r(+x))
  while (true) {
    const i = data.findIndex((x) => x[0] == FALSE)
    const ni = data.findLastIndex((x) => x[0] == true)
    if (i == -1) break
    if (i >= ni) break
    ;[data[i], data[ni]] = [data[ni], data[i]]
  }
  data.sum((x, i) => (x[0] ? i * x[1] : 0)).check(6279058075753)
}

{
  const data = input(2024, 9)
    .chars()
    .map((x, i) => (i % 2 ? t(FALSE, +x) : t(TRUE, +x, i / 2, true)))
  while (true) {
    const i = data.findIndex((x, i) => i > 0 && i % 2 == 0 && x[1] == 0)
    if (i == -1) break
    const im = i - 1
    const ip = i + 1
    if (ip >= data.length) break
    data[im][1] += data[ip][1]
    data.splice(i, 2)
  }
  while (true) {
    const li = data.findLastIndex((a) => a[3])
    if (li == -1) break
    const l = data[li]
    l[3] = FALSE
    const bi = data.findIndex((x) => !x[0] && x[1] >= l[1])
    if (bi == -1) continue
    const b = data[bi]
    if (li <= bi) continue
    if (b[1] == l[1]) {
      b.splice(0, b.length, ...l)
      data[li] = [FALSE, l[1]]
    } else {
      data[li] = [FALSE, l[1]]
      data.splice(bi, 0, l)
      b[1] -= l[1]
    }

    for (let i = 1; i < data.length; i++) {
      if (!data[i - 1][0] && !data[i][0]) {
        data[i - 1][1] += data[i][1]
        data.splice(i, 1)
        i--
      }
    }
  }
  const expd = data.flatMap((x) => (x[0] ? x[2].r(x[1]) : (0).r(x[1])))
  expd.sum((x, i) => i * x).check(6301361958738)
}
