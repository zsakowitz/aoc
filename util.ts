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

Number.prototype.int = function () {
  return this
}

Number.prototype.fnfilter = function (n) {
  return n === this
}

Number.prototype.check = function (expected) {
  if (this !== expected) {
    throw new Error(
      `${colors.red}FAILED: expected ${expected} but got ${this}${colors.reset}`,
    )
  } else {
    console.log(`${colors.green}PASSED: ${expected}${colors.reset}`)
  }
  return this
}

Number.prototype.inc = function (this: number) {
  return this + 1
}

Number.prototype.dec = function (this: number) {
  return this - 1
}

Number.prototype.c = function () {
  return this
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

String.prototype.int = function () {
  return +this
}

String.prototype.ints = function () {
  return this.match(/\d+/g)?.map((x) => +x) ?? []
}

String.prototype.fnfilter = function (n) {
  return n === this
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
  return this
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

RegExp.prototype.fnfilter = function (x) {
  return this.test(x)
}

RegExp.prototype.fncounttarget = function (source) {
  return source.matchAll(this).count()
}

RegExp.prototype.c = function () {
  return this
}

Array.prototype.fncounttarget = function (source) {
  return this.sum((target) => target.counttarget(source))
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

Array.prototype.s = function () {
  return this.sort((a, b) => a - b)
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

Iterator.prototype.counts = function* (f) {
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

Iterator.prototype.fi = function (f) {
  let i = 0
  for (const v of this) {
    if (f.fnfilter(v, i)) {
      return i
    }
    i++
  }
  return -1
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

Object.prototype.do = function (f) {
  return f(this)
}

Object.prototype.r = function (n) {
  return Array.from({ length: n }, () => this.c())
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

globalThis.checkInput = async function (year, day) {
  if (
    typeof year != "number" ||
    !ri(2015, 20000).has(year) ||
    !ri(1, 25).has(day)
  ) {
    throw new Error("Invalid year or day.")
  }

  const code = `ilowi/${year}/${day}/input`
  const url = `https://adventofcode.com/${year}/day/${day}/input`

  if (typeof process == "object") {
    if (arguments.length != 2) {
      warn`Implicitly using today's input; this will break tomorrow.`
    }
    const file = new URL(
      "./.aoc/" + code,
      new URL("file://" + process.env.PWD + "/"),
    ).pathname
    if (fs.existsSync(file)) {
      return
    }

    warn`Fetching new input...`
    await fetch(url, {
      headers: { cookie: process.env.ILOWI_AOC_COOKIE! },
    })
      .then((response) => {
        if (response.ok) return response.text()
        throw new Error(`Failed to fetch input for ${year}/${day}.`)
      })
      .then(async (text) => {
        if (text.endsWith("\n")) text = text.slice(0, -1)
        await fs.promises.mkdir(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, text)
        return text
      })
    return
  }

  if (typeof localStorage == "object" && localStorage.getItem(code)) {
    return
  }

  const req = new XMLHttpRequest()

  console.log(url)
  req.open("GET", url, false)
  req.send()
  if (req.status == 200) {
    let text = req.response
    if (text.endsWith("\n")) text = text.slice(0, -1)
    localStorage.setItem(code, text)
  }
}

globalThis.input = function input(year = today()[0], day = today()[1]) {
  if (
    typeof year != "number" ||
    !ri(2015, 20000).has(year) ||
    !ri(1, 25).has(day)
  ) {
    throw new Error("Invalid year or day.")
  }

  const code = `ilowi/${year}/${day}/input`
  const url = `https://adventofcode.com/${year}/day/${day}/input`

  if (typeof process == "object") {
    if (arguments.length != 2) {
      warn`Implicitly using today's input; this will break tomorrow.`
    }
    const file = new URL(
      "./.aoc/" + code,
      new URL("file://" + process.env.PWD + "/"),
    ).pathname
    if (fs.existsSync(file)) {
      return fs.readFileSync(file, "utf8")
    }

    throw new Error(
      "Attempted to fetch input synchronously in an environment without synchronous HTTP requests.",
    )
  }

  if (typeof localStorage == "object") {
    const value = localStorage.getItem(code)
    if (value) {
      return value
    }
  }

  const req = new XMLHttpRequest()

  console.log(url)
  req.open("GET", url, false)
  req.send()
  if (req.status == 200) {
    localStorage.setItem(code, req.response)
    return req.response
  } else {
    throw new Error("getting input failed", req.response)
  }
}

global.t = globalThis.tuple = function (...args) {
  return args
}

class Point<T = unknown> {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly z: number | undefined,
    readonly g: Grid<T> | undefined,
  ) {}

  c() {
    return new Point(this.x, this.y, this.z, this.g)
  }

  t() {
    return new Point(this.x, this.y - 1, this.z, this.g)
  }

  l() {
    return new Point(this.x - 1, this.y, this.z, this.g)
  }

  b() {
    return new Point(this.x, this.y + 1, this.z, this.g)
  }

  r() {
    return new Point(this.x + 1, this.y, this.z, this.g)
  }

  lt() {
    return new Point(this.x - 1, this.y - 1, this.z, this.g)
  }

  rt() {
    return new Point(this.x + 1, this.y - 1, this.z, this.g)
  }

  lb() {
    return new Point(this.x - 1, this.y + 1, this.z, this.g)
  }

  rb() {
    return new Point(this.x + 1, this.y + 1, this.z, this.g)
  }

  add(other: Point) {
    return new Point(
      this.x + other.x,
      this.y + other.y,
      this.z == null ? undefined : this.z + other.z!,
      this.g,
    )
  }

  sub(other: Point) {
    return new Point(
      this.x - other.x,
      this.y - other.y,
      this.z == null ? undefined : this.z - other.z!,
      this.g,
    )
  }

  get i() {
    return this.y
  }

  get j() {
    return this.x
  }

  /** Index in a grid like
   *
   * ```
   * 1 3 6 10
   * 2 5 9
   * 4 8
   * 7
   * ```
   */
  idxbrbrbr() {
    return ((this.y + this.x - 1) * (this.y + this.x - 2)) / 2 + this.x
  }

  get v(): T | X {
    return this.g!.at(this)
  }
}

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
  constructor(readonly rows: T[][]) {}

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
}

declare var __Point: typeof Point
type __Point<T> = Point<T>

type FnFilter<T, I = number> =
  | ((x: T, i: I) => boolean)
  | { fnfilter(this: any, x: T, i: I): boolean }
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

declare global {
  interface Number {
    int(): this
    fnfilter(x: number): boolean
    check(expected: number): this
    inc(): number
    dec(): number
    c(): this
    sd(other: number): number
    ud(other: number): number
    is(x: FnFilter<number, undefined>): boolean
    clamp(min: number, max: number): number
    min(...others: number[]): number
    max(...others: number[]): number
  }

  interface String {
    int(): number
    ints(): number[]
    fnfilter(x: string): boolean
    count(f: FnStrCountTarget): number
    fncounttarget(source: string): number
    chars(): string[]
    lines(): string[]
    grid(): Grid<string>
    sws(): string[]
    c(): this
    on(label: string | TemplateStringsArray): string[]
    is(x: FnFilter<string, undefined>): boolean
    xat(i: number): [string, string]
    xmid(): [string, string]
  }

  interface Function {
    fnfilter<T, I>(this: (x: T, i: I) => boolean, x: T, i: I): boolean
    c(): this
    inv<F extends (...args: any[]) => any>(
      this: F,
    ): (this: ThisParameterType<F>, ...args: Parameters<F>) => boolean
  }

  interface RegExp {
    fnfilter(x: string): boolean
    fncounttarget(source: string): number
    c(): this
  }

  interface Array<T> {
    fncounttarget(source: string): number
    f(f: FnFilter<T>): T[]
    fi(f: FnFilter<T>): T[]
    k(): IteratorObject<number>
    v(): IteratorObject<T>
    i(v: T): number
    int(this: FnInt<any>[]): (T extends FnInt<infer U> ? U : never)[]
    get last(): T | X
    set last(v: T)
    count(f?: FnFilter<T> | null): number
    sum(this: number[]): number
    sum(f: (value: T, index: number, self: this) => number): number
    prod(this: number[]): number
    prod(f: (value: T, index: number, self: this) => number): number
    by<U>(other: IteratorObject<U> | U[]): [T, U][]
    toArray(): T[]
    sws(this: FnSws<any>[]): (T extends FnSws<infer U> ? U : never)[]
    c(this: FnCopy[]): T[]
    on(
      this: FnOn<any>[],
      on: string | TemplateStringsArray,
    ): (T extends FnOn<infer U> ? U : never)[][]
    tx<T>(this: T[][]): T[][]
    w(n: 1): [T][]
    w(n: 2): [T, T][]
    w(n: 3): [T, T, T][]
    w(n: number): T[][]
    sd(this: FnSd[]): T[]
    ud(this: FnUd[]): T[]
    s(this: number[]): number[]
    mid(): T | X
    key<K extends keyof T>(key: K): T[K][]
    wo(index: number): T[]
    woall(): IteratorObject<T[]>
    xy(
      this: IteratorObject<[x: number, y: number], any, any>,
    ): IteratorObject<Point, any, any>
    ij(
      this: IteratorObject<[i: number, j: number], any, any>,
    ): IteratorObject<Point, any, any>
    all(f: FnFilter<T>): boolean
    allany(...fs: FnFilter<T>[]): boolean
  }

  interface IteratorObject<T, TReturn = unknown, TNext = unknown> {
    sum(this: IteratorObject<number>): number
    sum(f: (value: T, index: number, self: this) => number): number
    prod(this: IteratorObject<number>): number
    prod(f: (value: T, index: number, self: this) => number): number
    count(f?: FnFilter<T> | null): number
    acc<U>(f: (a: U, b: T, index: number) => U, initial: U): IteratorObject<U>
    counts(f?: FnFilter<T> | null): IteratorObject<[number, T], number, unknown>
    fi(f: FnFilter<T>): number
    by<U>(other: IteratorObject<U> | U[]): IteratorObject<[T, U]>
    key<K extends keyof T>(key: K): IteratorObject<T[K], undefined, unknown>
    xy(
      this: IteratorObject<[x: number, y: number], any, any>,
    ): IteratorObject<Point, any, any>
    ij(
      this: IteratorObject<[i: number, j: number], any, any>,
    ): IteratorObject<Point, any, any>
  }

  interface Object {
    do<T, U>(this: T, f: (x: T) => U): U
    r<T extends FnCopy>(this: T, n: number): T[]
  }

  function ri(min: number, max?: number): Range
  function rx(min: number, max?: number): Range

  function today(): [year: number, date: number]
  function checkInput(year: number, date: number): Promise<void>
  function input(year: number, date: number): string
  function t<T extends any[]>(...args: T): T
  function tuple<T extends any[]>(...args: T): T

  var Point: typeof __Point & {
    <T>(x: number, y: number, z?: number | undefined, g?: Grid<T>): Point<T>
  }
  var point: typeof Point
  var pt: typeof Point
  var p: typeof Point
  var ij: typeof Point
  type Point<T = unknown> = __Point<T>
}

// sbyRawUnsafe sby sum prod tx num bigint nums ints uints digits digitnamesfwd digitnamesrev sws s filterByFnRaw count w ud sd abs ispos isneg everyAny everyany everyFn someFn none wo indexes idxs all any check counttarget gcd lcm by toArray rbr grid stringis asnumberbase on fm xon noempty i reject mid wi ins k perms u uniq unique fncopy r rf
