import "../util.js"

// This file is basically hardcoded.

const initialA = input(2024, 17).split("\n")[0].slice("Register A: ".length)
const v = input(2024, 17).split("\n")[4].slice("Program: ".length)
const exp = v.split(",").int()

function once(/** @type {number} */ a) {
  let b = a % 8
  b = b ^ 5
  const c = a >> b
  b = b ^ c
  a = a >> 3
  b = b ^ 6
  return b % 8
}

function run(/** @type {bigint} */ a) {
  const ret = []
  do {
    let b = a % 8n
    b = b ^ 5n
    const c = a >> b
    b = b ^ c
    a = a >> 3n
    b = b ^ 6n
    ret.push(b % 8n)
  } while (a != 0n)
  return ret.join(",")
}

run(BigInt(initialA)).check("3,4,3,1,7,6,5,6,0", "YESIMSURE")

let working = exp.map((target) => {
  /** @type {Set<string>} */
  const works = new Set()
  for (const n of rx(1 << 11)) {
    if (once(n) == target) works.add(n.toString(2).padStart(11, "0"))
  }
  return works
})

function shrink(/** @type {Set<string>[]} */ values) {
  if (values.length < 2) {
    return values
  }

  const [as, bs, ...rest] = values
  const a = [...as]
  const b = [...bs]
  const works = b.by(a).mnn(([b, a]) => {
    if (b.slice(3, 11) == a.slice(0, 8)) {
      return b.slice(0, 3) + a
    }
  })
  return [new Set(works), ...rest]
}

while (working.length >= 2) working = shrink(working)
;[...working[0]]
  .map((n) => BigInt("0b" + n))
  .filter((x) => run(x) == v)
  .bigmin()
  .check(109019930331546n)
