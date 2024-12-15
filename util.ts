"use strict"

const _ = ([] as number[])[0]
type X = Exclude<typeof _, number>

let fs: typeof import("node:fs")
let path: typeof import("node:path")

if (typeof process != "undefined") {
  fs = await import("node:fs")
  path = await import("node:path")
}

const colors = {
  black: "\u001b[30m",
  blue: "\u001b[34m",
  cyan: "\u001b[36m",
  dim: "\u001b[2m",
  green: "\u001b[32m",
  magenta: "\u001b[35m",
  red: "\u001b[31m",
  reset: "\u001b[0m",
  white: "\u001b[37m",
  yellow: "\u001b[33m",
}

const warn = (() => {
  let ACTIVE_WARNINGS = new WeakSet<TemplateStringsArray>()
  let warningTimeout = false

  return function warn(strings: TemplateStringsArray, ...interps: unknown[]) {
    if (ACTIVE_WARNINGS.has(strings)) return

    ACTIVE_WARNINGS.add(strings)

    if (!warningTimeout) {
      queueMicrotask(() => {
        ACTIVE_WARNINGS = new WeakSet()
        warningTimeout = false
      })
      warningTimeout = true
    }

    const arr = [
      colors.yellow + strings[0],
      ...strings.slice(1).flatMap((string, index) => [interps[index], string]),
    ]
    ;(arr.last as string) += colors.reset

    if (typeof process == "undefined") {
      console.warn(...arr)
    } else {
      console.warn(...arr)
      console.warn(
        colors.yellow +
          colors.dim +
          new Error("").stack!.split("\n").slice(1).join("\n") +
          colors.reset,
      )
    }
  }
})()

Number.prototype.imod = function (this: number, divisor) {
  if (divisor <= 0) {
    warn`.imod(${divisor}) divides by a nonpositive number.`
  }
  return ((this % divisor) + divisor) % divisor
}

Number.prototype.int = function () {
  return +this
}

Number.prototype.concat = function (other) {
  if (!Number.isSafeInteger(this) || !Number.isSafeInteger(other)) {
    warn`Concatenating numbers which aren't safe integers.`
  }
  return +(this.toString() + other)
}

Number.prototype.fnfilter = function (n) {
  return n === this || (n instanceof Point && !!n.g && n.v === this)
}

Number.prototype.check = function (expected) {
  if (this !== expected) {
    throw new Error(
      `${colors.red}FAILED: expected ${expected} but got ${this}${colors.reset}`,
    )
  } else {
    console.log(`${colors.green}PASSED: ${expected}${colors.reset}`)
  }
  return +this
}

Number.prototype.inc = function (this: number) {
  return this + 1
}

Number.prototype.dec = function (this: number) {
  return this - 1
}

Number.prototype.c = function () {
  return +this
}

Number.prototype.sd = function (this: number, other) {
  return this - other
}

Number.prototype.ud = function (this: number, other) {
  return Math.abs(this - other)
}

Number.prototype.is = function (this: number, x) {
  return x.fnfilter(this, undefined)
}

Number.prototype.clamp = function (this: number, min, max) {
  return Math.max(min, Math.min(max, this))
}

Number.prototype.min = function (this: number, ...args) {
  return Math.min(this, ...args)
}

Number.prototype.max = function (this: number, ...args) {
  return Math.max(this, ...args)
}

Number.prototype.fnasnumberbase = function () {
  return rx(+this)
    .map((x) => "" + x)
    .toArray()
}

Number.prototype.m1 = function (this: number, f) {
  if (this == -1) return f()
  return this
}

Number.prototype.nbal = function (base) {
  const digits = base.fnasnumberbase()

  if (!Number.isSafeInteger(digits.length) || !(digits.length % 2)) {
    warn`.nbal() expects an odd numbered base; operation may fail.`
  }

  const offset = (1 - digits.length) / 2

  let o = ""
  let n = +this

  while (n != 0) {
    const m5 = Math.round(n / digits.length) * digits.length
    const diff = n - m5
    o = digits[diff - offset] + o
    n = m5 / digits.length
  }

  return o
}

Number.prototype.fnregexcapture = function (array) {
  return array[+this]
}

String.prototype.int = function () {
  return +this
}

String.prototype.ints = function () {
  return this.match(/\d+/g)?.map((x) => +x) ?? []
}

String.prototype.dir = function (this: string) {
  return {
    "^": pt(0, -1),
    "<": pt(-1, 0),
    ">": pt(+1, 0),
    v: pt(0, 1),
  }[this]
}

String.prototype.fnfilter = function (n) {
  return n === this || (n instanceof Point && !!n.g && n.v === this)
}

String.prototype.count = function (f) {
  return f.fncounttarget("" + this)
}

String.prototype.fncounttarget = function (this: string, source) {
  return (source.length - source.replaceAll(this, "").length) / this.length
}

String.prototype.chars = function () {
  return this.split("")
}

String.prototype.lines = function () {
  return this.split("\n")
}

String.prototype.grid = function () {
  return new Grid(this.lines().map((x) => x.chars())) as Grid<string>
}

String.prototype.sws = function () {
  return this.split(/\s+/g)
}

String.prototype.c = function () {
  return "" + this
}

String.prototype.on = function (label) {
  const l = Array.isArray(label)
    ? String.raw({ raw: label }, ...[].slice.call(arguments, 1))
    : (label as string)

  return this.split(l)
}

String.prototype.is = function (this: string, f) {
  return f.fnfilter(this, undefined)
}

String.prototype.xat = function (idx) {
  return [this.slice(0, idx), this.slice(idx)]
}

String.prototype.xmid = function (this: string) {
  if (this.length % 2 != 0) {
    warn`Splitting an odd-length string in half.`
  }
  return this.xat(this.length / 2)
}

String.prototype.nb = function (base, offset) {
  if (offset === undefined) {
    warn`No offset passed; implicitly using offset zero.`
    offset = 0
  }

  const digits = base.fnasnumberbase()

  return this.chars()
    .map((char) =>
      digits.indexOf(char).m1<false>(() => {
        warn`Digit not listed in digits list when converting number in .nb(); skipping.`
        return false
      }),
    )
    .filter((x) => x !== false)
    .map((x) => x + offset)
    .reduce((a, b) => digits.length * a + b, 0)
}

String.prototype.fnasnumberbase = function () {
  return this.chars()
}

String.prototype.check = function (this: string, expected, confirmation) {
  if (confirmation !== "YESIMSURE") {
    warn`Calling .check() on a string; pass "YESIMSURE" as 2nd arg to disable warning.`
  }

  if (this !== expected) {
    throw new Error(
      `${colors.red}FAILED: expected ${expected} but got ${this}${colors.reset}`,
    )
  } else {
    console.log(`${colors.green}PASSED: ${expected}${colors.reset}`)
  }

  return this
}

String.prototype.mall = function (regex) {
  return (
    this.matchAll(regex)
      .map((x) => x[0])
      .toArray() || []
  )
}

String.prototype.mx = function (this: string) {
  return [this, this.reverse()]
}

String.prototype.rev = String.prototype.reverse = function () {
  return this.chars().reverse().join("")
}

String.prototype.tx = function () {
  return this.lines()
    .map((x) => x.chars())
    .tx()
    .map((x) => x.join(""))
    .join("\n")
}

String.prototype.cap = function <T>(
  this: string,
  regex: RegExp,
  cap?: FnRegexCapture<T>,
): T | string[] | X {
  if (regex.global) {
    warn`Used a global RegExp in .cap(); switching to non-global`
    regex = new RegExp(regex.source, regex.flags.replace("g", ""))
  }
  if (!cap) {
    return (this.match(regex) ?? []).slice(1)
  }
  const m = regex.exec(this)
  if (m) {
    return cap.fnregexcapture(m)
  } else {
    return undefined!
  }
}

String.prototype.caps = function <T>(
  regex: RegExp,
  cap?: FnRegexCapture<T>,
): T[] | string[][] {
  if (!regex.global) {
    warn`Used a non-global RegExp in .caps(); switching to global`
    regex = new RegExp(regex.source, regex.flags + "g")
  }
  if (!cap) {
    return this.matchAll(regex)
      .map((x) => x.slice(1))
      .toArray()
  }
  return this.matchAll(regex)
    .map((x) => cap.fnregexcapture(x))
    .toArray()
}

String.prototype.digitname = function (this: string) {
  return [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ].indexOf(this)
}

String.prototype.digits = function (this: string) {
  return this.mall(/\d/g).map((x) => +x)
}

String.prototype.digitnamesfwd = function (this: string) {
  return this.mall(/\d|one|two|three|four|five|six|seven|eight|nine/g).map(
    (x) => x.digitname().m1(() => +x),
  )
}

String.prototype.digitnamesrev = function (this: string) {
  return this.reverse()
    .mall(/\d|thgie|neves|eerht|enin|evif|ruof|xis|owt|eno/g)
    .map((x) =>
      x
        .reverse()
        .digitname()
        .m1(() => +x),
    )
}

Function.prototype.fnfilter = function (x, i) {
  return this(x, i)
}

Function.prototype.c = function () {
  return this
}

Function.prototype.inv = function () {
  const self = this
  return function (...args) {
    return !self.apply(this, args)
  }
}

Function.prototype.fnregexcapture = function (arr) {
  return this(arr)
}

RegExp.prototype.fnfilter = function (x) {
  return this.test(x)
}

RegExp.prototype.fncounttarget = function (source) {
  return source.matchAll(this).count()
}

RegExp.prototype.c = function () {
  return this
}

Array.prototype.mnn = function (f) {
  return this.map(f).filter((x) => x != null)
}

Array.prototype.id = function () {
  const inner = this.map((x) => x.id())
  if (inner.some((x) => x.includes(";;;"))) {
    return inner.join(";;;;")
  } else if (inner.some((x) => x.includes(";;"))) {
    return inner.join(";;;")
  } else if (inner.some((x) => x.includes(";"))) {
    return inner.join(";;")
  } else {
    return inner.join(";")
  }
}

Object.defineProperty(Array.prototype, "j", {
  configurable: true,
  get() {
    return this.join("")
  },
})

Array.prototype.any = function (f) {
  return this.some((x, i) => f.fnfilter(x, i))
}

Array.prototype.fncounttarget = function (source) {
  return this.sum((target) => target.fncounttarget(source))
}

Array.prototype.f = function (f) {
  return this.filter((x, i) => f.fnfilter(x, i))
}

Array.prototype.fi = function (f) {
  const output = Array(this.length)
  for (let i = 0; i < this.length; i++) {
    if (!(i in this)) continue
    if (f.fnfilter(this[i], i)) {
      output[i] = this[i]
    }
  }
  return output
}

Array.prototype.k = Array.prototype.keys
Array.prototype.v = Array.prototype.values
Array.prototype.i = Array.prototype.indexOf

Array.prototype.int = function () {
  return this.map((x) => x.int())
}

Object.defineProperty(Array.prototype, "last", {
  configurable: true,
  get() {
    if (this.length == 0) warn`Getting '.last' of empty array.`
    return this[this.length - 1]
  },
  set(v) {
    if (this.length == 0) warn`Getting '.last' of empty array.`
    this[this.length - 1] = v
  },
})

Array.prototype.count = function (f) {
  if (f == null) {
    return this.length
  } else {
    let count = 0
    for (const [i, v] of this.entries()) {
      if (f.fnfilter(v, i)) {
        count++
      }
    }
    return count
  }
}

Array.prototype.sum = function <T>(
  this: T[],
  f?: (x: T, i: number, a: T[]) => number,
) {
  if (f) {
    return this.reduce((a, b, i, x) => a + f(b, i, x), 0)
  } else {
    return this.reduce((a, b) => a + +(b as number), 0)
  }
} as any

Array.prototype.prod = function <T>(
  this: T[],
  f?: (x: T, i: number, a: T[]) => number,
) {
  if (f) {
    return this.reduce((a, b, i, x) => a * f(b, i, x), 1)
  } else {
    return this.reduce((a, b) => a * +(b as number), 1)
  }
} as any

Array.prototype.by = function (other) {
  other = other.toArray()
  return this.flatMap((x) => other.map((y) => [x, y] as [any, any]))
}

Array.prototype.toArray = function () {
  return this.slice()
}

Array.prototype.sws = function () {
  return this.map((x) => x.sws())
}

Array.prototype.c = function () {
  return this.map((x) => x.c())
}

Array.prototype.on = function (...on) {
  return this.map((x) => x.on(...on))
}

Array.prototype.tx = function () {
  return Array.from(
    { length: this.reduce((a, b) => Math.max(a, b.length), 0) },
    (_, i) => this.map((x) => x[i]!),
  )
}

Array.prototype.w = function <T>(this: T[], n: number) {
  return Array.from({ length: Math.max(0, this.length - n + 1) }, (_, i) =>
    this.slice(i, i + n),
  )
} as any

Array.prototype.sd = function () {
  return this.w(2).map(([a, b]) => a.sd(b))
}

Array.prototype.ud = function () {
  return this.w(2).map(([a, b]) => a.ud(b))
}

Array.prototype.mid = function () {
  if (this.length % 2 != 1) {
    warn`Middle element of even-lengthed array does not exist.`
  }
  return this[(this.length - 1) / 2]
}

Array.prototype.key = function (key) {
  return this.map((x) => x[key])
}

Array.prototype.wo = function (index) {
  return this.toSpliced(index, 1)
}

Array.prototype.woall = function* () {
  for (let i = 0; i < this.length; i++) {
    if (!(i in this)) continue
    yield this.wo(i)
  }
}

Array.prototype.xy = function () {
  return this.map(([x, y]) => pt(x, y))
}

Array.prototype.ij = function () {
  return this.map(([i, j]) => ij(i, j))
}

Array.prototype.all = function (f) {
  return this.every((x, i, a) => f.fnfilter(x, i))
}

Array.prototype.allany = function (...fs) {
  return fs.some((f) => this.all(f))
}

Array.prototype.unique = function (key) {
  if (key == null) {
    return this.filter((x, i, a) => a.indexOf(x) == i)
  } else {
    const map = new Map()
    for (let i = 0; i < this.length; i++) {
      const k = key(this[i]!, i, this)
      if (map.has(k)) continue
      map.set(k, this[i]!)
    }
    return map.values().toArray()
  }
}

Array.prototype.fnfilter = function (...args) {
  return this.some((f) => f.fnfilter(...args))
}

Array.prototype.choose2 = Array.prototype.c2 = function* () {
  for (let i = 0; i < this.length; i++) {
    if (!(i in this)) continue
    for (let j = i + 1; j < this.length; j++) {
      if (!(j in this)) continue
      yield [this[i]!, this[j]!, i, j]
    }
  }
}

Array.prototype.perms = function* () {
  if (this.length == 0) {
    return
  }

  if (this.length == 1) {
    yield [this[0]!]
  }

  for (const rest of this.slice(1).perms()) {
    for (let i = 0; i < this.length; i++) {
      yield rest.toSpliced(i, 0, this[0]!)
    }
  }
}

Array.prototype.s = function () {
  return this.sort((a, b) => a - b)
}

// The polyfills work equally well because of .reduce().
Iterator.prototype.sum = Array.prototype.sum as any
Iterator.prototype.prod = Array.prototype.prod as any

Iterator.prototype.count = function (f) {
  if (!f) {
    return this.reduce((a) => a + 1, 0)
  } else {
    return this.reduce((a, v, i) => a + +!!f.fnfilter(v, i), 0)
  }
}

Iterator.prototype.acc = function* (f, initial) {
  let i = 0
  for (const v of this) {
    initial = f(initial, v, i)
    yield initial
    i++
  }
}

Iterator.prototype.enum = function* (f) {
  if (!f) {
    let v = 0
    for (const x of this) {
      v++
      yield [v, x]
    }
    return v
  } else {
    let v = 0
    let i = 0
    for (const x of this) {
      if (f.fnfilter(x, i)) {
        v++
      }
      i++
      yield [v, x]
    }
    return v
  }
}

Iterator.prototype.i = function (f) {
  let i = 0
  for (const v of this) {
    if (f.fnfilter(v, i)) {
      return i
    }
    i++
  }
  return -1
}

Iterator.prototype.f = function* (f) {
  let i = 0
  for (const v of this) {
    if (f.fnfilter(v, i)) yield v
    i++
  }
}

Iterator.prototype.arr = function () {
  return this.toArray()
}

Iterator.prototype.by = function (other) {
  other = other.toArray()
  return this.flatMap((x) => other.map((y) => [x, y]))
}

Iterator.prototype.key = function (key) {
  return this.map((x) => x[key])
}

Iterator.prototype.xy = function () {
  return this.map(([x, y]) => pt(x, y))
}

Iterator.prototype.ij = function () {
  return this.map(([i, j]) => ij(i, j))
}

Iterator.prototype.mu = function* (f) {
  let i = 0
  for (const v of this) {
    const n = f(v, i)
    if (n === none) return
    yield n as any
    i++
  }
}

Iterator.prototype.mnn = function* (f) {
  let i = 0
  for (const v of this) {
    const n = f(v, i)
    if (n == null) return
    yield n as any
    i++
  }
}

Iterator.prototype.run = function () {
  for (const _ of this);
}

Object.prototype.do = function (f) {
  return f(this)
}

Object.prototype.r = function (n) {
  return Array.from({ length: n }, () => this.c())
}

Boolean.prototype.c = function () {
  return Boolean(this)
}

Boolean.prototype.s = function () {
  if (this) {
    return -1
  } else {
    return 1
  }
}

function rangeTo(a: number, b: number) {
  if (b < a) {
    warn`range constructed with improperly ordered arguments`
  }

  function has(x: number) {
    return Number.isSafeInteger(x) && a <= x && x < b
  }

  return Object.assign(
    (function* () {
      for (let i = a; i < b; i++) {
        yield i
      }
    })(),
    { has, fnfilter: has },
  )
}

type Range = ReturnType<typeof rangeTo>

globalThis.ri = function ri(min, max) {
  if (max == null) {
    return rangeTo(0, min + 1)
  } else {
    return rangeTo(min, max + 1)
  }
}

globalThis.rx = function rx(min, max) {
  if (max == null) {
    return rangeTo(0, min)
  } else {
    return rangeTo(min, max)
  }
}

globalThis.today = function today() {
  const today = new Date(
    Date.now() + // now
      new Date().getTimezoneOffset() * 60 * 1000 - // move to UTC
      5 * 60 * 60 * 1000, // move to EST
  )

  return [today.getFullYear(), today.getDate()]
}

globalThis.today = today

function cache(key: string, getValue: () => string): string

function cache(
  key: string,
  getValue: () => string | Promise<string>,
): string | Promise<string>

function cache(
  key: string,
  getValue: () => string | Promise<string>,
): string | Promise<string> {
  if (typeof process == "object") {
    const file = new URL(
      "./.aoc/" + key,
      new URL("file://" + process.env.HOME + "/"),
    ).pathname
    if (fs.existsSync(file)) {
      return fs.readFileSync(file, "utf8")
    }
    return Promise.resolve(getValue()).then(async (value) => {
      await fs.promises.mkdir(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, value)
      return value
    })
  }

  if (!(localStorage && typeof localStorage == "object")) {
    throw new Error(
      "No way to persist data; throwing to avoid hundreds of API calls which will get you blocked.",
    )
  }

  const item = localStorage.getItem(".aoc/" + key)
  if (item != null) {
    return item
  }
  const val = getValue()
  if (val instanceof Promise) {
    throw new Error("Asynchronous loading is only supported in Node.JS.")
  }
  localStorage.setItem(".aoc/" + key, val)
  return val
}

globalThis.checkInput = async function (year, day) {
  if (
    typeof year != "number" ||
    !ri(2015, 20000).has(year) ||
    !ri(1, 25).has(day)
  ) {
    throw new Error("Invalid year or day.")
  }

  const code = `${year}/${day}/input`
  const url = `https://adventofcode.com/${year}/day/${day}/input`

  await cache(code, () => {
    warn`Fetching new input...`
    if (typeof XMLHttpRequest == "undefined") {
      return fetch(url, {
        headers: { cookie: process.env.ILOWI_AOC_COOKIE! },
      })
        .then((response) => {
          if (response.ok) return response.text()
          throw new Error(`Failed to fetch input for ${year}/${day}.`)
        })
        .then((text) => text.trim())
    }
    const req = new XMLHttpRequest()
    req.open("GET", url, false)
    req.send()
    if (req.status == 200) {
      const resp = req.response.trim()
      localStorage.setItem(code, resp)
      return resp as string
    } else {
      throw new Error("getting input failed", req.response)
    }
  })
}

globalThis.input = function input(year = today()[0], day = today()[1]) {
  if (
    typeof year != "number" ||
    !ri(2015, 20000).has(year) ||
    !ri(1, 25).has(day)
  ) {
    throw new Error("Invalid year or day.")
  }

  const code = `${year}/${day}/input`
  const url = `https://adventofcode.com/${year}/day/${day}/input`

  if (typeof process == "object" && arguments.length != 2) {
    warn`Implicitly using today's input; this will break tomorrow.`
  }

  return cache(code, () => {
    if (typeof XMLHttpRequest == "undefined") {
      throw new Error("Cannot get input synchronously in Node.JS.")
    }
    const req = new XMLHttpRequest()
    req.open("GET", url, false)
    req.send()
    if (req.status == 200) {
      const resp = req.response.trim()
      localStorage.setItem(code, resp)
      return resp as string
    } else {
      throw new Error("getting input failed", req.response)
    }
  })
}

globalThis.t = globalThis.tuple = function (...args) {
  return args
}

globalThis.nn = function (value) {
  if (value == null) {
    throw new Error("Non-null assertion failed.")
  }
  return value
}

globalThis.mx = function (value) {
  if (Array.isArray(value)) {
    return String.raw({ raw: value }).mx()
  } else {
    return (value as string).mx()
  }
}

class Point<T = unknown> {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly z: number | undefined,
    readonly g: Grid<T> | undefined,
  ) {}

  addIn(set: PointSet<T>) {
    set.add(this)
    return this
  }

  delIn(set: PointSet<T>) {
    set.del(this)
    return this
  }

  scale(n: number) {
    return new Point(this.x * n, this.y * n, this.z, this.g)
  }

  c90() {
    return new Point(-this.y, this.x, this.z, this.g)
  }

  exists() {
    if (!this.g) {
      throw new Error("Cannot check for an unowned point's existence.")
    }

    return this.g.has(this)
  }

  xq() {
    if (this.exists()) {
      return this
    }
  }

  fnfilter(pt: Point) {
    return this.is(pt)
  }

  diag(x: number, y: number) {
    if (!this.g) {
      throw new Error(
        "Cannot get points along a diagonal from a `Point` without an owner.",
      )
    }

    return this.g.diag(this, x, y)
  }

  drb(s: number) {
    return this.diag(s, s)
  }

  drt(s: number) {
    return this.diag(s, -s)
  }

  dlb(s: number) {
    return this.diag(-s, s)
  }

  c() {
    return new Point(this.x, this.y, this.z, this.g)
  }

  get t() {
    return new Point(this.x, this.y - 1, this.z, this.g)
  }

  get l() {
    return new Point(this.x - 1, this.y, this.z, this.g)
  }

  get b() {
    return new Point(this.x, this.y + 1, this.z, this.g)
  }

  get r() {
    return new Point(this.x + 1, this.y, this.z, this.g)
  }

  get lt() {
    return new Point(this.x - 1, this.y - 1, this.z, this.g)
  }

  get rt() {
    return new Point(this.x + 1, this.y - 1, this.z, this.g)
  }

  get lb() {
    return new Point(this.x - 1, this.y + 1, this.z, this.g)
  }

  get rb() {
    return new Point(this.x + 1, this.y + 1, this.z, this.g)
  }

  n() {
    return [this.t, this.r, this.b, this.l]
  }

  nf() {
    if (!this.g) {
      warn`Getting filtered neighbors of unowned point; will throw`
    }
    return this.n().filter((pt) => this.g!.has(pt))
  }

  add(other: Point, from?: Point) {
    return new Point(
      this.x + other.x - (from ? from.x : 0),
      this.y + other.y - (from ? from.y : 0),
      this.z == null ? undefined : this.z + other.z! - (from ? from.z! : 0),
      this.g,
    )
  }

  sub(other: Point, from?: Point) {
    return new Point(
      this.x - other.x + (from ? from.x : 0),
      this.y - other.y + (from ? from.y : 0),
      this.z == null ? undefined : this.z - other.z! + (from ? from.z! : 0),
      this.g,
    )
  }

  get i() {
    return this.y
  }

  get j() {
    return this.x
  }

  is(other: Point) {
    return this.x == other.x && this.y == other.y && this.z == other.z
  }

  id() {
    return `${this.x},${this.y},${this.z}`
  }

  /**
   * Index in a grid like
   *
   *     1 3 6 10
   *     2 5 9
   *     4 8
   *     7
   */
  idxbrbrbr() {
    return ((this.y + this.x - 1) * (this.y + this.x - 2)) / 2 + this.x
  }

  get v(): T | X {
    return this.g!.at(this)
  }

  set v(v: T) {
    this.g!.set(this, v)
  }
}

class PointSet<T = unknown> {
  pts = new Map<string, Point<T>>()

  constructor(input?: Iterable<Point<T>>) {
    if (input != null) {
      for (const x of input) {
        this.add(x)
      }
    }
  }

  c(): PointSet<T> {
    return new PointSet(this.pts.values())
  }

  lt() {
    return this.k().reduce(
      (a, b) => (b.x < a.x || b.y < a.y ? b : a),
      pt(Infinity, Infinity),
    )
  }

  rb() {
    return this.k().reduce(
      (a, b) => (b.x > a.x || b.y > a.y ? b : a),
      pt(-Infinity, -Infinity),
    )
  }

  clear() {
    this.pts.clear()
  }

  add(pt: Point<T>) {
    if (this.pts.has(pt.id())) return
    this.pts.set(pt.id(), pt)
  }

  delete(pt: Point<T>): boolean {
    return this.pts.delete(pt.id())
  }

  del(pt: Point<T>): boolean {
    return this.pts.delete(pt.id())
  }

  has(pt: Point<T>) {
    return this.pts.has(pt.id())
  }

  k() {
    return this.pts.values()
  }

  [Symbol.iterator]() {
    return this.pts.values()
  }

  get size() {
    return this.pts.size
  }

  perim() {
    return this.k().sum((p) => {
      return (
        +!this.has(p.t) + +!this.has(p.b) + +!this.has(p.l) + +!this.has(p.r)
      )
    })
  }

  edges() {
    return this.k().sum((p) => {
      return (
        +!(this.has(p.l) || (this.has(p.t) && !this.has(p.lt))) +
        +!(this.has(p.r) || (this.has(p.t) && !this.has(p.rt))) +
        +!(this.has(p.t) || (this.has(p.l) && !this.has(p.lt))) +
        +!(this.has(p.b) || (this.has(p.l) && !this.has(p.lb)))
      )
    })
  }
}

globalThis.PointSet = globalThis.ps = function (pts: Iterable<Point>) {
  return new PointSet(pts)
} as any

globalThis.pt =
  globalThis.p =
  globalThis.point =
  globalThis.Point =
    Object.assign(function pt(...args: any[]) {
      return new (Point as any)(...args)
    }, Point) as any

globalThis.ij = Object.assign(function ij(i: any, j: any, ...args: any[]) {
  return new (Point as any)(j, i, ...args)
}, Point) as any

class Grid<T> {
  constructor(public rows: T[][]) {}

  indexOf(el: T) {
    return this.k().find((x) => x.v == el) as Point<T> | X
  }

  i(el: T) {
    return this.indexOf(el)
  }

  slice(a: Point, b: Point): Grid<T> {
    if (this.rows.length == 0) return new Grid([])
    let i1 = a.i
    let j1 = a.j
    let i2 = b.i
    let j2 = b.j
    // if (i1 < 0) i1 = this.rows.length + i1
    // if (i2 < 0) i2 = this.rows.length + i2
    // if (j1 < 0) warn`negative columns not supported`
    // if (j2 < 0) warn`negative columns not supported`
    // if (i2 < i1) [i1, i2] = [i2, i1]
    // if (j2 < j1) [j1, j2] = [j2, j1]
    return new Grid(
      this.rows.slice(i1, i2 + 1).map((row) => row.slice(j1, j2 + 1)),
    )
  }

  log() {
    console.log(this.rows.map((x) => x.j).join("\n"))
    return this
  }

  diag(pt: Point, x: number, y: number) {
    if (Math.abs(x) != Math.abs(y)) {
      throw new Error("Called .diag() with values of different sizes")
    }
    if (!this.has(pt)) {
      return []
    }
    const cells = [this.at(pt)]
    if (x < 0) {
      for (const v of ri(1, -x)) {
        const o = pt.add(point(-v, v * Math.sign(y)))
        if (this.has(o)) cells.push(this.at(o))
        else return cells
      }
    } else if (x > 0) {
      for (const v of ri(1, x)) {
        const o = pt.add(point(v, v * Math.sign(y)))
        if (this.has(o)) cells.push(this.at(o))
        else return cells
      }
    }
    return cells
  }

  has(pt: Point) {
    return pt.i in this.rows && pt.j in this.rows[pt.i]!
  }

  int<U>(this: Grid<FnInt<U>>): Grid<T extends FnInt<infer U> ? U : never>
  int<U>(this: Grid<FnInt<U>>): Grid<U> {
    return new Grid(this.rows.int())
  }

  tx(): Grid<T> {
    return new Grid(this.rows.tx())
  }

  row(i: number, start?: number, end?: number): T[] | X {
    if (start == null && end == null) {
      return this.rows[i]!
    } else {
      return this.rows[i]!?.slice(start, end)
    }
  }

  at(pt: Point): T | X {
    return this.rows[pt.y]?.[pt.x]!
  }

  set(pt: Point, value: T): T {
    this.rows[pt.i]![pt.j] = value
    return value
  }

  *k(): IteratorObject<Point<T>, undefined> {
    for (let i = 0; i < this.rows.length; i++) {
      if (!(i in this.rows)) continue
      for (let j = 0; j < this.rows[i]!.length; j++) {
        if (!(j in this.rows[i]!)) continue
        yield pt(j, i, undefined, this)
      }
    }
  }

  flat(): T[] {
    return this.rows.flat()
  }

  map<U>(f: (value: T, index: Point<T>, grid: Grid<T>) => U): Grid<U> {
    return new Grid(
      this.rows.map((row, i) =>
        row.map((col, j) => f(col, ij(i, j, undefined, this), this)),
      ),
    )
  }

  c(this: Grid<T & FnCopy>): Grid<T> {
    return new Grid(this.rows.c())
  }

  copyFrom(other: Grid<T>) {
    this.rows = other.rows.c()
  }

  draw(this: Grid<string>) {
    const rows = this.map((t) => {
      const s = document.createElement("span")
      s.textContent = t
      s.style.color =
        {
          "#": "black",
          "[": "brown",
          "]": "brown",
          ".": "#c0c0c0",
          "@": "white",
        }[t] || "currentcolor"
      s.style.backgroundColor =
        {
          "@": "blue",
        }[t] || "transparent"
      return s
    }).rows.map((row) => {
      const p = document.createElement("span")
      p.append(...row)
      return p
    })

    const el = document.createElement("pre")
    for (const [i, row] of rows.entries()) {
      if (i != 0) el.append("\n")
      el.append(row)
    }
    el.id = "grid"

    const existing = document.getElementById("grid")
    if (existing) existing.replaceWith(el)
    document.body.append(el)
  }
}

globalThis.Grid = function (rows = []) {
  return new Grid(rows)
} as any

globalThis.ints = Object.assign(
  function* () {
    for (let i = 0; ; i++) {
      yield i
    }
  },
  {
    *[Symbol.iterator]() {
      for (let i = 0; ; i++) {
        yield i
      }
    },
  },
)
;(Symbol as any).none ??= Symbol()

globalThis.none = Symbol.none

declare var __Point: typeof Point
type __Point<T> = Point<T>

declare var __Grid: typeof Grid
type __Grid<T> = Grid<T>

declare var __PointSet: typeof PointSet
type __PointSet<T> = PointSet<T>

type FnFilter<T, I = number> =
  | ((x: T, i: I) => boolean)
  | { fnfilter(this: any, x: T, i: I): boolean }
type FnRegexCapture<T> =
  | ((x: RegExpExecArray) => T)
  | { fnregexcapture(this: any, x: RegExpExecArray): T }
type FnAsNumberBase = { fnasnumberbase(): readonly string[] }
type FnInt<T> = { int(): T }
type FnStrCountTarget = { fncounttarget(source: string): number }
type FnSws<T> = { sws(): T }
type FnOn<T> = { on(source: string | TemplateStringsArray): T[] }
interface FnSd {
  sd(other: this): this
}
interface FnUd {
  ud(other: this): this
}
interface FnCopy {
  c(): this
}
type Mut<T> = { -readonly [K in keyof T]: T[K] }

declare global {
  interface Number {
    /**
     * Takes the standard modulus, where negatives are wrapped up. `divisor`
     * should be positive.
     */
    imod(divisor: number): number
    /** Returns this number. */
    int(): number
    /** Concatenates the integers `this` and `other`. */
    concat(other: number): number
    /** Returns `true` if `x` is `this` or a point with matching value. */
    fnfilter(x: number | Point<number>): boolean
    /** Checks this number against an expected value, throwing on error. */
    check(expected: number): number
    /** Returns `this + 1`. */
    inc(): number
    /** Returns `this - 1`. */
    dec(): number
    /** Returns a copied version of `this`. */
    c(): number
    /** Computes the signed difference `this - other`. */
    sd(other: number): number
    /** Computes the unsigned difference `|this - other|`. */
    ud(other: number): number
    /** Checks whether this number matches the passed filter. */
    is(x: FnFilter<number, undefined>): boolean
    /** Returns this number, clamped between `min` and `max`. */
    clamp(min: number, max: number): number
    /** Returns the minimum of `this` and its arguments. */
    min(...others: number[]): number
    /** Returns the maximum of `this` and its arguments. */
    max(...others: number[]): number
    /** Returns a list of numbers 0 to `this`. */
    fnasnumberbase(): string[]
    /** If `this == -1`, returns `f()`. Otherwise, returns `this`. */
    m1<T>(f: () => T): number | T
    /** Writes this number in a balanced base system. */
    nbal(base: FnAsNumberBase): string
    /** Returns the `this`th capture group from the passed regex. */
    fnregexcapture(x: RegExpExecArray): string | X
  }

  interface String {
    /** Parses this string as a number. */
    int(): number
    /** Returns any integers in `this`. */
    ints(): number[]
    /** Parses this string as a direction `^` `<` `>` `v`. */
    dir(): Point | undefined
    /** Returns `true` if `x` is `this` or a point with matching value. */
    fnfilter(x: string | Point<string>): boolean
    /** Counts the number of occurrences of `f` in `this`. */
    count(f: FnStrCountTarget): number
    /** Counts the number of occurrences of `this` in `source`. */
    fncounttarget(source: string): number
    /** Splits this string on every character. */
    chars(): string[]
    /** Splits this string on every newline. */
    lines(): string[]
    /** Makes a grid of characters in this string. */
    grid(): Grid<string>
    /** Splits this string on any whitespace. */
    sws(): string[]
    /** Copies this string. */
    c(): string
    /** Splits this string on every `label`. */
    on(label: string | TemplateStringsArray): string[]
    /** Checks if this string matches the passed filter. */
    is(x: FnFilter<string, undefined>): boolean
    /** Splits this string at the given index. */
    xat(i: number): [string, string]
    /** Splits this string into two strings of equal length. */
    xmid(): [string, string]
    /**
     * Parses this string in some base where the first digit means `offset`.
     *
     * For instance, `.nb("-01", -2)` parses in balanced ternary, and `.nb(5,
     * 0)` parses in base 5.
     */
    nb(digits: FnAsNumberBase, offset: number): number
    /** Returns the characters in this string. */
    fnasnumberbase(): string[]
    /**
     * Checks that this string matches `expected`, throwing on error.
     *
     * Will warn without `confirmation`, as string results are not typical of
     * AoC.
     */
    check(expected: string, confirmation: "YESIMSURE"): string
    /** Returns all matches of the given global `RegExp`. */
    mall(regex: RegExp): string[]
    /** Returns this string and its reversed counterpart. */
    mx(): [normal: string, reversed: string]
    /** Reverses this string. */
    rev(): string
    /** Reverses this string. */
    reverse(): string
    /** Transposes this string's lines and character columns. */
    tx(): string
    /**
     * Matches `this` against `regex`, returning the capturing groups of the
     * first match.
     */
    cap(regex: RegExp): string[] | X
    /** Matches `this` against `regex`, returning the result specified by `cap`. */
    cap<T>(regex: RegExp, cap: FnRegexCapture<T>): T | X
    /** Matches `this` against `regex`, returning all capturing groups. */
    caps(regex: RegExp): string[][]
    /**
     * Matches `this` against `regex`, passing all match results to `cap` and
     * forwarding the return values.
     */
    caps<T>(regex: RegExp, cap: FnRegexCapture<T>): T[]
    /**
     * If `this` is `zero`, `one`, or another lowercase number digit, returns
     * that value. Otherwise, parses `this` as a number.
     */
    digitname(): number
    /** Returns all digits in this string. */
    digits(): number[]
    /**
     * Returns all digits or digit names in this string, starting from the
     * front.
     *
     * `twone` becomes `[2]`.
     */
    digitnamesfwd(): number[]
    /**
     * Returns all digits or digit names in this string, starting from the back.
     *
     * `twone` becomes `[1]`.
     */
    digitnamesrev(): number[]
  }

  interface Function {
    /** Calls `this` with the provided arguments. */
    fnfilter<T, I>(this: (x: T, i: I) => boolean, x: T, i: I): boolean
    /** Returns `this`. */
    c<T>(this: T): T
    /**
     * Returns a new function which returns the boolean negation of `this`'s
     * return value when passed the same parameters.
     *
     *     const hi = (a) => a > 23
     *     hi(19) // false
     *     hi(35) // true
     *     const inv = hi.inv()
     *     inv(19) // true
     *     inv(35) // false
     */
    inv<F extends (...args: any[]) => any>(
      this: F,
    ): (this: ThisParameterType<F>, ...args: Parameters<F>) => boolean
    /** Calls `this` with the provided arguments. */
    fnregexcapture<T extends (x: RegExpExecArray) => any>(
      this: T,
      x: RegExpExecArray,
    ): ReturnType<T>
  }

  interface RegExp {
    /** Returns `true` if `x` matches `this`. */
    fnfilter(x: string): boolean
    /** Counts the number of instances of `this` in `source`. */
    fncounttarget(source: string): number
    /** Returns `this`. */
    c(): RegExp
  }

  interface ArrayBase<T> {
    /** Equivalent to `.map(f).filter(x => x != null)`. */
    mnn<U>(f: (value: T, index: number, array: T) => U): NonNullable<U>[]
    /** Returns a string created from `id`ing all nested objects. */
    id(this: { id(): string }[]): string
    /** Equivalent to `.join("")` */
    readonly j: string
    /** Returns `true` if any element matches `f`. */
    any(f: FnFilter<T>): boolean
    /** Calls `.fncounttarget(source)` on each element, and returns the sum. */
    fncounttarget(this: readonly FnStrCountTarget[], source: string): number
    /** Returns elements which match the filter `f`. */
    f(f: FnFilter<T>): T[]
    /**
     * Returns elements which match the filter `f`, but preserves indices by
     * creating a sparse array.
     */
    fi(f: FnFilter<T>): T[]
    /** Shorthand for `.keys()`. */
    k(): IteratorObject<number>
    /** Shorthand for `.values()`. */
    v(): IteratorObject<T>
    /** Shorthand for `.indexOf()`. */
    i(v: T): number
    /** Equivalent to `.map(x => x.int())`. */
    int(this: FnInt<any>[]): (T extends FnInt<infer U> ? U : never)[]
    /** Returns the last element of this array. */
    get last(): T | X
    /**
     * Counts the number of elements which match `f`, or returns `this.length`
     * if none match.
     */
    count(f?: FnFilter<T> | null): number
    /** Returns the sum of the values in this array. */
    sum(this: number[]): number
    /** Passes each element to `f`, and sums the results. */
    sum(f: (value: T, index: number, self: this) => number): number
    /** Returns the product of the values in this array. */
    prod(this: number[]): number
    /** Passes each element to `f`, and multiplies the results. */
    prod(f: (value: T, index: number, self: this) => number): number
    /** Takes the Cartesian product of `this` and `other`. */
    by<U>(other: IteratorObject<U> | U[]): [T, U][]
    /**
     * Equivalent to `.slice()`. Makes working with iterators easier because an
     * extra `.toArray()` call will not throw an error.
     */
    toArray(): T[]
    /** Equivalent to `.map(x => x.sws())`. */
    sws(this: FnSws<any>[]): (T extends FnSws<infer U> ? U : never)[]
    /** Equivalent to `.map(x => x.c())`. */
    c(this: FnCopy[]): T[]
    /** Equivalent to `.map(x => x.on(...arguments))` */
    on(
      this: FnOn<any>[],
      on: string | TemplateStringsArray,
    ): (T extends FnOn<infer U> ? U : never)[][]
    /** Transposes this array. */
    tx<T>(this: T[][]): T[][]
    /** Returns all subarrays of length 1 in this array. */
    w(n: 1): [T][]
    /** Returns all contiguous pairs in this array. */
    w(n: 2): [T, T][]
    /** Returns all contiguous triplets in this array. */
    w(n: 3): [T, T, T][]
    /** Returns all contiguous windows of `n` values in this array. */
    w(n: number): T[][]
    /** Takes the signed difference between each pair of numbers. */
    sd(this: FnSd[]): T[]
    /** Takes the unsigned difference between each pair of numbers. */
    ud(this: FnUd[]): T[]
    /** Returns the middle element. */
    mid(): T | X
    /** Equivalent to `.map(x => x[key])`. */
    key<K extends keyof T>(key: K): T[K][]
    /**
     * Copies this array, then removes the specified index and returns the new
     * array.
     */
    wo(index: number): T[]
    /**
     * Iterates over all indices of `this`, calling `.wo()` on each one and
     * yielding the results.
     *
     *     ;["hi", "world", "bye"].woall().forEach(console.log)
     *     // ["world", "bye"]
     *     // ["hi", "bye"]
     *     // ["hi", "world"]
     */
    woall(): IteratorObject<T[]>
    /**
     * If this is an array of `[x,y]` tuples, returns an iterator over points
     * representing those `(x,y)` pairs.
     */
    xy(
      this: IteratorObject<[x: number, y: number], any, any>,
    ): IteratorObject<Point, any, any>
    /**
     * If this is an array of `[i][j]` tuples, returns an iterator over points
     * representing those pairs.
     */
    ij(
      this: IteratorObject<[i: number, j: number], any, any>,
    ): IteratorObject<Point, any, any>
    /** Returns `true` if all elements match `f`. */
    all(f: FnFilter<T>): boolean
    /** Returns `true` if for some `f` of `fs`, all elements match `f`. */
    allany(...fs: FnFilter<T>[]): boolean
    /**
     * Removes duplicates from the array, optionally using `key` as the key of
     * each element.
     */
    unique(key?: (x: T, i: number, a: T[]) => any): T[]
    /** Returns `true` if any element returns `true`. */
    fnfilter<T, I>(this: FnFilter<T, I>[], value: T, index: I): boolean
    /** Generates all combinations of two elements. */
    choose2(): Generator<[x: T, y: T, xi: number, yi: number]>
    /** Generates all combinations of two elements. */
    c2(): Generator<[x: T, y: T, xi: number, yi: number]>
    /** Generates all permutations of this array. */
    perms(): Generator<{ [K in keyof this]: this[keyof this & number] }>
  }

  interface ReadonlyArray<T> extends ArrayBase<T> {}

  interface Array<T> extends ArrayBase<T> {
    /** Sets the last element of this array. */
    set last(v: T)
    /** Sorts this array numerically. */
    s(this: number[]): number[]
  }

  interface IteratorObject<T, TReturn = unknown, TNext = unknown> {
    /** Sums the elements of this iterator. */
    sum(this: IteratorObject<number | boolean>): number
    /** Passes each element of this iterator to `f` and sums the results. */
    sum(f: (value: T, index: number, self: this) => number | boolean): number
    /** Takes the product the elements of this iterator. */
    prod(this: IteratorObject<number | boolean>): number
    /** Passes each element of this iterator to `f` and multiplies the results. */
    prod(f: (value: T, index: number, self: this) => number | boolean): number
    /**
     * Counts the number of elements which match `f`, or the number of elements
     * at all if `f == null`.
     */
    count(f?: FnFilter<T> | null): number
    /**
     * Like .reduce(), but yields every intermediate value (excluding
     * `initial`).
     */
    acc<U>(f: (a: U, b: T, index: number) => U, initial: U): IteratorObject<U>
    /**
     * Yields `[index, value]` tuples, optionally filtering by `f`. `f` is
     * passed the original index, not the index after filtering.
     */
    enum(
      f?: FnFilter<T> | null,
    ): IteratorObject<[index: number, value: T], number, unknown>
    /** Finds the first index whose value matches `f`. */
    i(f: FnFilter<T>): number
    /** Filters by `f`. */
    f(f: FnFilter<T>): IteratorObject<T>
    /** Collects this iterator's values into an array. */
    arr(): T[]
    /** Iterates over the Cartesian product of `this` and `other`. */
    by<U>(other: IteratorObject<U> | U[]): IteratorObject<[T, U]>
    /** Equivalent to `.map(x => x[key])`. */
    key<K extends keyof T>(key: K): IteratorObject<T[K], undefined, unknown>
    /**
     * If this is an array of `[x,y]` tuples, returns an iterator over points
     * representing those `(x,y)` pairs.
     */
    xy(
      this: IteratorObject<[x: number, y: number], any, any>,
    ): IteratorObject<Point, any, any>
    /**
     * If this is an array of `[i][j]` tuples, returns an iterator over points
     * representing those pairs.
     */
    ij(
      this: IteratorObject<[i: number, j: number], any, any>,
    ): IteratorObject<Point, any, any>
    /**
     * A combination of `.filter()` and `.map()`, where the global `none` value
     * (alias: `Symbol.none`) is used to skip the value in output.
     */
    mu<U>(
      f: (value: T, index: number) => U | typeof none,
    ): Generator<Exclude<U, typeof none>, unknown, unknown>
    /**
     * A combination of `.filter()` and `.map()`, where `null` and `undefined`
     * values are skipped in the output.
     */
    mnn<U>(
      f: (value: T, index: number) => U | null | undefined,
    ): Generator<U & {}, unknown, unknown>
    /** Runs this iterator to completion. */
    run(): void
  }

  interface Object {
    /** Equivalent to `f(this)`. Useful for binding complex operations. */
    do<T, U>(this: T, f: (x: T) => U): U
    /** Repeats `this` in an array `n` times. */
    r<T>(this: Extract<T, FnCopy>, n: number): T[]
  }

  interface Boolean {
    /** Returns `this`. */
    c(): boolean
    /**
     * Returns `-1` if `false`. Otherwise, `1`. Useful for custom sorting
     * functions, as in `.sort((a, b) => (a < b).s())`.
     */
    s(): -1 | 1
  }

  /** Creates an inclusive range `0..=max`. */
  function ri(max: number, _?: undefined): Range
  /** Creates an inclusive range `min..=max`. */
  function ri(min: number, max: number): Range
  /** Creates an inclusive range `0..=min` or `min..=max`. */
  function ri(min: number, max?: number): Range

  /** Creates an exclusive range `0..max`. */
  function rx(max: number, _?: undefined): Range
  /** Creates an exclusive range `min..max`. */
  function rx(min: number, max: number): Range
  /** Creates an exclusive range `0..min` or `min..max`. */
  function rx(min: number, max?: number): Range

  /** Gets today's year and date in AoC time. */
  function today(): [year: number, date: number]
  /** Ensures the input for the specified date is cached. */
  function checkInput(year: number, date: number): Promise<void>
  /** Gets the input for the specified date. */
  function input(year: number, date: number): string

  /**
   * Helper for creating tuples, as this usually requires `as const`, which
   * isn't available in JS code.
   */
  function t<T extends readonly any[]>(...args: T): Mut<T>
  /**
   * Helper for creating tuples, as this usually requires `as const`, which
   * isn't available in JS code.
   */
  function tuple<T extends readonly any[]>(...args: T): Mut<T>

  /** Throws if `value` is `null` or `undefined`. Else, returns `value`. */
  function nn<T>(value: T): NonNullable<T>

  /** Equivalent to x.mx(), but shorter for template strings. */
  function mx(
    x: string | TemplateStringsArray,
  ): [normal: string, reversed: string]

  /** A set of points. */
  var PointSet: typeof __PointSet & {
    <T>(init?: Iterable<Point<T>>): PointSet<T>
  }
  /** A set of points. */
  var ps: typeof PointSet

  /** Creates a point. */
  var Point: typeof __Point & {
    <T>(x: number, y: number, z?: number | undefined, g?: Grid<T>): Point<T>
  }
  /** Creates a point. */
  var point: typeof Point
  /** Creates a point. */
  var pt: typeof Point
  /** Creates a point. */
  var p: typeof Point
  /** Creates a point. */
  var ij: typeof Point
  /** A point. */
  type Point<T = unknown> = __Point<T>

  /** Creates a grid. */
  var Grid: typeof __Grid & {
    <T>(rows?: T[][]): Grid<T>
    new <T>(rows?: T[][]): Grid<T>
  }
  /** A grid. */
  type Grid<T> = __Grid<T>

  /** An iterator over all positive integers. */
  var ints: {
    (): Generator<number, never, unknown>
    [Symbol.iterator](): Generator<number, never, unknown>
  }
  interface SymbolConstructor {
    /** Represents the absence of a value. Used in `Iterator.prototype.mu`. */
    readonly none: unique symbol
  }
  /** Represents the absence of a value. Used in `Iterator.prototype.mu`. */
  var none: typeof Symbol.none
}

// sbyRawUnsafe sby sum prod tx num bigint nums ints uints digits digitnamesfwd digitnamesrev sws s filterByFnRaw count w ud sd abs ispos isneg everyAny everyany everyFn someFn none wo indexes idxs all any check counttarget gcd lcm by toArray rbr grid stringis asnumberbase on fm xon noempty i reject mid wi ins k perms u uniq unique fncopy r rf
