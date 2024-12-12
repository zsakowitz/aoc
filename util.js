"use strict";
const _ = [][0];
let fs;
let path;
if (typeof process != "undefined") {
    fs = await import("node:fs");
    path = await import("node:path");
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
};
const warn = (() => {
    let ACTIVE_WARNINGS = new WeakSet();
    let warningTimeout = false;
    return function warn(strings, ...interps) {
        if (ACTIVE_WARNINGS.has(strings))
            return;
        ACTIVE_WARNINGS.add(strings);
        if (!warningTimeout) {
            queueMicrotask(() => {
                ACTIVE_WARNINGS = new WeakSet();
                warningTimeout = false;
            });
            warningTimeout = true;
        }
        const arr = [
            colors.yellow + strings[0],
            ...strings.slice(1).flatMap((string, index) => [interps[index], string]),
        ];
        arr.last += colors.reset;
        if (typeof process == "undefined") {
            console.warn(...arr);
        }
        else {
            console.warn(...arr);
            console.warn(colors.yellow +
                colors.dim +
                new Error("").stack.split("\n").slice(1).join("\n") +
                colors.reset);
        }
    };
})();
Number.prototype.int = function () {
    return +this;
};
Number.prototype.concat = function (other) {
    if (!Number.isSafeInteger(this) || !Number.isSafeInteger(other)) {
        warn `Concatenating numbers which aren't safe integers.`;
    }
    return +(this.toString() + other);
};
Number.prototype.fnfilter = function (n) {
    return n === this || (n instanceof Point && !!n.g && n.v === this);
};
Number.prototype.check = function (expected) {
    if (this !== expected) {
        throw new Error(`${colors.red}FAILED: expected ${expected} but got ${this}${colors.reset}`);
    }
    else {
        console.log(`${colors.green}PASSED: ${expected}${colors.reset}`);
    }
    return +this;
};
Number.prototype.inc = function () {
    return this + 1;
};
Number.prototype.dec = function () {
    return this - 1;
};
Number.prototype.c = function () {
    return +this;
};
Number.prototype.sd = function (other) {
    return this - other;
};
Number.prototype.ud = function (other) {
    return Math.abs(this - other);
};
Number.prototype.is = function (x) {
    return x.fnfilter(this, undefined);
};
Number.prototype.clamp = function (min, max) {
    return Math.max(min, Math.min(max, this));
};
Number.prototype.min = function (...args) {
    return Math.min(this, ...args);
};
Number.prototype.max = function (...args) {
    return Math.max(this, ...args);
};
Number.prototype.fnasnumberbase = function () {
    return rx(+this)
        .map((x) => "" + x)
        .toArray();
};
Number.prototype.m1 = function (f) {
    if (this == -1)
        return f();
    return this;
};
Number.prototype.nbal = function (base) {
    const digits = base.fnasnumberbase();
    if (!Number.isSafeInteger(digits.length) || !(digits.length % 2)) {
        warn `.nbal() expects an odd numbered base; operation may fail.`;
    }
    const offset = (1 - digits.length) / 2;
    let o = "";
    let n = +this;
    while (n != 0) {
        const m5 = Math.round(n / digits.length) * digits.length;
        const diff = n - m5;
        o = digits[diff - offset] + o;
        n = m5 / digits.length;
    }
    return o;
};
Number.prototype.fnregexcapture = function (array) {
    return array[+this];
};
String.prototype.int = function () {
    return +this;
};
String.prototype.ints = function () {
    return this.match(/\d+/g)?.map((x) => +x) ?? [];
};
String.prototype.fnfilter = function (n) {
    return n === this || (n instanceof Point && !!n.g && n.v === this);
};
String.prototype.count = function (f) {
    return f.fncounttarget("" + this);
};
String.prototype.fncounttarget = function (source) {
    return (source.length - source.replaceAll(this, "").length) / this.length;
};
String.prototype.chars = function () {
    return this.split("");
};
String.prototype.lines = function () {
    return this.split("\n");
};
String.prototype.grid = function () {
    return new Grid(this.lines().map((x) => x.chars()));
};
String.prototype.sws = function () {
    return this.split(/\s+/g);
};
String.prototype.c = function () {
    return "" + this;
};
String.prototype.on = function (label) {
    const l = Array.isArray(label)
        ? String.raw({ raw: label }, ...[].slice.call(arguments, 1))
        : label;
    return this.split(l);
};
String.prototype.is = function (f) {
    return f.fnfilter(this, undefined);
};
String.prototype.xat = function (idx) {
    return [this.slice(0, idx), this.slice(idx)];
};
String.prototype.xmid = function () {
    if (this.length % 2 != 0) {
        warn `Splitting an odd-length string in half.`;
    }
    return this.xat(this.length / 2);
};
String.prototype.nb = function (base, offset) {
    if (offset === undefined) {
        warn `No offset passed; implicitly using offset zero.`;
        offset = 0;
    }
    const digits = base.fnasnumberbase();
    return this.chars()
        .map((char) => digits.indexOf(char).m1(() => {
        warn `Digit not listed in digits list when converting number in .nb(); skipping.`;
        return false;
    }))
        .filter((x) => x !== false)
        .map((x) => x + offset)
        .reduce((a, b) => digits.length * a + b, 0);
};
String.prototype.fnasnumberbase = function () {
    return this.chars();
};
String.prototype.check = function (expected, confirmation) {
    if (confirmation !== "YESIMSURE") {
        warn `Calling .check() on a string; pass "YESIMSURE" as 2nd arg to disable warning.`;
    }
    if (this !== expected) {
        throw new Error(`${colors.red}FAILED: expected ${expected} but got ${this}${colors.reset}`);
    }
    else {
        console.log(`${colors.green}PASSED: ${expected}${colors.reset}`);
    }
    return this;
};
String.prototype.mall = function (regex) {
    return (this.matchAll(regex)
        .map((x) => x[0])
        .toArray() || []);
};
String.prototype.mx = function () {
    return [this, this.reverse()];
};
String.prototype.rev = String.prototype.reverse = function () {
    return this.chars().reverse().join("");
};
String.prototype.tx = function () {
    return this.lines()
        .map((x) => x.chars())
        .tx()
        .map((x) => x.join(""))
        .join("\n");
};
String.prototype.cap = function (regex, cap) {
    if (regex.global) {
        warn `Used a global RegExp in .cap(); switching to non-global`;
        regex = new RegExp(regex.source, regex.flags.replace("g", ""));
    }
    if (!cap) {
        return (this.match(regex) ?? []).slice(1);
    }
    const m = regex.exec(this);
    if (m) {
        return cap.fnregexcapture(m);
    }
    else {
        return undefined;
    }
};
String.prototype.caps = function (regex, cap) {
    if (!regex.global) {
        warn `Used a non-global RegExp in .caps(); switching to global`;
        regex = new RegExp(regex.source, regex.flags + "g");
    }
    if (!cap) {
        return this.matchAll(regex)
            .map((x) => x.slice(1))
            .toArray();
    }
    return this.matchAll(regex)
        .map((x) => cap.fnregexcapture(x))
        .toArray();
};
String.prototype.digitname = function () {
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
    ].indexOf(this);
};
String.prototype.digits = function () {
    return this.mall(/\d/g).map((x) => +x);
};
String.prototype.digitnamesfwd = function () {
    return this.mall(/\d|one|two|three|four|five|six|seven|eight|nine/g).map((x) => x.digitname().m1(() => +x));
};
String.prototype.digitnamesrev = function () {
    return this.reverse()
        .mall(/\d|thgie|neves|eerht|enin|evif|ruof|xis|owt|eno/g)
        .map((x) => x
        .reverse()
        .digitname()
        .m1(() => +x));
};
Function.prototype.fnfilter = function (x, i) {
    return this(x, i);
};
Function.prototype.c = function () {
    return this;
};
Function.prototype.inv = function () {
    const self = this;
    return function (...args) {
        return !self.apply(this, args);
    };
};
Function.prototype.fnregexcapture = function (arr) {
    return this(arr);
};
RegExp.prototype.fnfilter = function (x) {
    return this.test(x);
};
RegExp.prototype.fncounttarget = function (source) {
    return source.matchAll(this).count();
};
RegExp.prototype.c = function () {
    return this;
};
Array.prototype.any = function (f) {
    return this.some((x, i) => f.fnfilter(x, i));
};
Array.prototype.fncounttarget = function (source) {
    return this.sum((target) => target.fncounttarget(source));
};
Array.prototype.f = function (f) {
    return this.filter((x, i) => f.fnfilter(x, i));
};
Array.prototype.fi = function (f) {
    const output = Array(this.length);
    for (let i = 0; i < this.length; i++) {
        if (!(i in this))
            continue;
        if (f.fnfilter(this[i], i)) {
            output[i] = this[i];
        }
    }
    return output;
};
Array.prototype.k = Array.prototype.keys;
Array.prototype.v = Array.prototype.values;
Array.prototype.i = Array.prototype.indexOf;
Array.prototype.int = function () {
    return this.map((x) => x.int());
};
Object.defineProperty(Array.prototype, "last", {
    configurable: true,
    get() {
        if (this.length == 0)
            warn `Getting '.last' of empty array.`;
        return this[this.length - 1];
    },
    set(v) {
        if (this.length == 0)
            warn `Getting '.last' of empty array.`;
        this[this.length - 1] = v;
    },
});
Array.prototype.count = function (f) {
    if (f == null) {
        return this.length;
    }
    else {
        let count = 0;
        for (const [i, v] of this.entries()) {
            if (f.fnfilter(v, i)) {
                count++;
            }
        }
        return count;
    }
};
Array.prototype.sum = function (f) {
    if (f) {
        return this.reduce((a, b, i, x) => a + f(b, i, x), 0);
    }
    else {
        return this.reduce((a, b) => a + +b, 0);
    }
};
Array.prototype.prod = function (f) {
    if (f) {
        return this.reduce((a, b, i, x) => a * f(b, i, x), 1);
    }
    else {
        return this.reduce((a, b) => a * +b, 1);
    }
};
Array.prototype.by = function (other) {
    other = other.toArray();
    return this.flatMap((x) => other.map((y) => [x, y]));
};
Array.prototype.toArray = function () {
    return this.slice();
};
Array.prototype.sws = function () {
    return this.map((x) => x.sws());
};
Array.prototype.c = function () {
    return this.map((x) => x.c());
};
Array.prototype.on = function (...on) {
    return this.map((x) => x.on(...on));
};
Array.prototype.tx = function () {
    return Array.from({ length: this.reduce((a, b) => Math.max(a, b.length), 0) }, (_, i) => this.map((x) => x[i]));
};
Array.prototype.w = function (n) {
    return Array.from({ length: Math.max(0, this.length - n + 1) }, (_, i) => this.slice(i, i + n));
};
Array.prototype.sd = function () {
    return this.w(2).map(([a, b]) => a.sd(b));
};
Array.prototype.ud = function () {
    return this.w(2).map(([a, b]) => a.ud(b));
};
Array.prototype.s = function () {
    return this.sort((a, b) => a - b);
};
Array.prototype.mid = function () {
    if (this.length % 2 != 1) {
        warn `Middle element of even-lengthed array does not exist.`;
    }
    return this[(this.length - 1) / 2];
};
Array.prototype.key = function (key) {
    return this.map((x) => x[key]);
};
Array.prototype.wo = function (index) {
    return this.toSpliced(index, 1);
};
Array.prototype.woall = function* () {
    for (let i = 0; i < this.length; i++) {
        if (!(i in this))
            continue;
        yield this.wo(i);
    }
};
Array.prototype.xy = function () {
    return this.map(([x, y]) => pt(x, y));
};
Array.prototype.ij = function () {
    return this.map(([i, j]) => ij(i, j));
};
Array.prototype.all = function (f) {
    return this.every((x, i, a) => f.fnfilter(x, i));
};
Array.prototype.allany = function (...fs) {
    return fs.some((f) => this.all(f));
};
Array.prototype.unique = function (key) {
    if (key == null) {
        return this.filter((x, i, a) => a.indexOf(x) == i);
    }
    else {
        const map = new Map();
        for (let i = 0; i < this.length; i++) {
            const k = key(this[i], i, this);
            if (map.has(k))
                continue;
            map.set(k, this[i]);
        }
        return map.values().toArray();
    }
};
Array.prototype.fnfilter = function (...args) {
    return this.some((f) => f.fnfilter(...args));
};
// The polyfills work equally well because of .reduce().
Iterator.prototype.sum = Array.prototype.sum;
Iterator.prototype.prod = Array.prototype.prod;
Iterator.prototype.count = function (f) {
    if (!f) {
        return this.reduce((a) => a + 1, 0);
    }
    else {
        return this.reduce((a, v, i) => a + +!!f.fnfilter(v, i), 0);
    }
};
Iterator.prototype.acc = function* (f, initial) {
    let i = 0;
    for (const v of this) {
        initial = f(initial, v, i);
        yield initial;
        i++;
    }
};
Iterator.prototype.counts = function* (f) {
    if (!f) {
        let v = 0;
        for (const x of this) {
            v++;
            yield [v, x];
        }
        return v;
    }
    else {
        let v = 0;
        let i = 0;
        for (const x of this) {
            if (f.fnfilter(x, i)) {
                v++;
            }
            i++;
            yield [v, x];
        }
        return v;
    }
};
Iterator.prototype.fi = function (f) {
    let i = 0;
    for (const v of this) {
        if (f.fnfilter(v, i)) {
            return i;
        }
        i++;
    }
    return -1;
};
Iterator.prototype.by = function (other) {
    other = other.toArray();
    return this.flatMap((x) => other.map((y) => [x, y]));
};
Iterator.prototype.key = function (key) {
    return this.map((x) => x[key]);
};
Iterator.prototype.xy = function () {
    return this.map(([x, y]) => pt(x, y));
};
Iterator.prototype.ij = function () {
    return this.map(([i, j]) => ij(i, j));
};
Object.prototype.do = function (f) {
    return f(this);
};
Object.prototype.r = function (n) {
    return Array.from({ length: n }, () => this.c());
};
Boolean.prototype.c = function () {
    return Boolean(this);
};
Boolean.prototype.s = function () {
    if (this) {
        return -1;
    }
    else {
        return 1;
    }
};
function rangeTo(a, b) {
    if (b < a) {
        warn `range constructed with improperly ordered arguments`;
    }
    function has(x) {
        return Number.isSafeInteger(x) && a <= x && x < b;
    }
    return Object.assign((function* () {
        for (let i = a; i < b; i++) {
            yield i;
        }
    })(), { has, fnfilter: has });
}
globalThis.ri = function ri(min, max) {
    if (max == null) {
        return rangeTo(0, min + 1);
    }
    else {
        return rangeTo(min, max + 1);
    }
};
globalThis.rx = function rx(min, max) {
    if (max == null) {
        return rangeTo(0, min);
    }
    else {
        return rangeTo(min, max);
    }
};
globalThis.today = function today() {
    const today = new Date(Date.now() + // now
        new Date().getTimezoneOffset() * 60 * 1000 - // move to UTC
        5 * 60 * 60 * 1000);
    return [today.getFullYear(), today.getDate()];
};
globalThis.today = today;
function cache(key, getValue) {
    if (typeof process == "object") {
        const file = new URL("./.aoc/" + key, new URL("file://" + process.env.HOME + "/")).pathname;
        if (fs.existsSync(file)) {
            return fs.readFileSync(file, "utf8");
        }
        return Promise.resolve(getValue()).then(async (value) => {
            await fs.promises.mkdir(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, value);
            return value;
        });
    }
    if (!(localStorage && typeof localStorage == "object")) {
        throw new Error("No way to persist data; throwing to avoid hundreds of API calls which will get you blocked.");
    }
    const item = localStorage.getItem(".aoc/" + key);
    if (item != null) {
        return item;
    }
    const val = getValue();
    if (val instanceof Promise) {
        throw new Error("Asynchronous loading is only supported in Node.JS.");
    }
    localStorage.setItem(".aoc/" + key, val);
    return val;
}
globalThis.checkInput = async function (year, day) {
    if (typeof year != "number" ||
        !ri(2015, 20000).has(year) ||
        !ri(1, 25).has(day)) {
        throw new Error("Invalid year or day.");
    }
    const code = `${year}/${day}/input`;
    const url = `https://adventofcode.com/${year}/day/${day}/input`;
    await cache(code, () => {
        warn `Fetching new input...`;
        if (typeof XMLHttpRequest == "undefined") {
            return fetch(url, {
                headers: { cookie: process.env.ILOWI_AOC_COOKIE },
            })
                .then((response) => {
                if (response.ok)
                    return response.text();
                throw new Error(`Failed to fetch input for ${year}/${day}.`);
            })
                .then((text) => text.trim());
        }
        const req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.send();
        if (req.status == 200) {
            const resp = req.response.trim();
            localStorage.setItem(code, resp);
            return resp;
        }
        else {
            throw new Error("getting input failed", req.response);
        }
    });
};
globalThis.input = function input(year = today()[0], day = today()[1]) {
    if (typeof year != "number" ||
        !ri(2015, 20000).has(year) ||
        !ri(1, 25).has(day)) {
        throw new Error("Invalid year or day.");
    }
    const code = `${year}/${day}/input`;
    const url = `https://adventofcode.com/${year}/day/${day}/input`;
    if (typeof process == "object" && arguments.length != 2) {
        warn `Implicitly using today's input; this will break tomorrow.`;
    }
    return cache(code, () => {
        if (typeof XMLHttpRequest == "undefined") {
            throw new Error("Cannot get input synchronously in Node.JS.");
        }
        const req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.send();
        if (req.status == 200) {
            const resp = req.response.trim();
            localStorage.setItem(code, resp);
            return resp;
        }
        else {
            throw new Error("getting input failed", req.response);
        }
    });
};
globalThis.t = globalThis.tuple = function (...args) {
    return args;
};
globalThis.nn = function (value) {
    if (value == null) {
        throw new Error("Non-null assertion failed.");
    }
    return value;
};
class Point {
    x;
    y;
    z;
    g;
    constructor(x, y, z, g) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.g = g;
    }
    c90() {
        return new Point(-this.y, this.x, this.z, this.g);
    }
    exists() {
        if (!this.g) {
            throw new Error("Cannot check for an unowned point's existence.");
        }
        return this.g.has(this);
    }
    fnfilter(pt) {
        return this.is(pt);
    }
    diag(x, y) {
        if (!this.g) {
            throw new Error("Cannot get points along a diagonal from a `Point` without an owner.");
        }
        return this.g.diag(this, x, y);
    }
    c() {
        return new Point(this.x, this.y, this.z, this.g);
    }
    t() {
        return new Point(this.x, this.y - 1, this.z, this.g);
    }
    l() {
        return new Point(this.x - 1, this.y, this.z, this.g);
    }
    b() {
        return new Point(this.x, this.y + 1, this.z, this.g);
    }
    r() {
        return new Point(this.x + 1, this.y, this.z, this.g);
    }
    lt() {
        return new Point(this.x - 1, this.y - 1, this.z, this.g);
    }
    rt() {
        return new Point(this.x + 1, this.y - 1, this.z, this.g);
    }
    lb() {
        return new Point(this.x - 1, this.y + 1, this.z, this.g);
    }
    rb() {
        return new Point(this.x + 1, this.y + 1, this.z, this.g);
    }
    n() {
        return [this.t(), this.r(), this.b(), this.l()];
    }
    nf() {
        if (!this.g) {
            warn `Getting filtered neighbors of unowned point; will throw`;
        }
        return this.n().filter((pt) => this.g.has(pt));
    }
    add(other) {
        return new Point(this.x + other.x, this.y + other.y, this.z == null ? undefined : this.z + other.z, this.g);
    }
    sub(other) {
        return new Point(this.x - other.x, this.y - other.y, this.z == null ? undefined : this.z - other.z, this.g);
    }
    get i() {
        return this.y;
    }
    get j() {
        return this.x;
    }
    is(other) {
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }
    id() {
        return `${this.x},${this.y},${this.z}`;
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
        return ((this.y + this.x - 1) * (this.y + this.x - 2)) / 2 + this.x;
    }
    get v() {
        return this.g.at(this);
    }
}
class PointSet {
    pts = new Map();
    constructor(input) {
        if (input != null) {
            for (const x of input) {
                this.pts.set(x.id(), x);
            }
        }
    }
    clear() {
        this.pts.clear();
    }
    add(pt) {
        this.pts.set(pt.id(), pt);
    }
    delete(pt) {
        return this.pts.delete(pt.id());
    }
    del(pt) {
        return this.pts.delete(pt.id());
    }
    has(pt) {
        return this.pts.has(pt.id());
    }
    k() {
        return this.pts.values();
    }
    [Symbol.iterator]() {
        return this.pts.values();
    }
    get size() {
        return this.pts.size;
    }
    perim() {
        return this.k().sum((p) => {
            return (+!this.has(p.t()) +
                +!this.has(p.b()) +
                +!this.has(p.l()) +
                +!this.has(p.r()));
        });
    }
    edges() {
        return this.k().sum((p) => {
            return (+!(this.has(p.l()) || (this.has(p.t()) && !this.has(p.lt()))) +
                +!(this.has(p.r()) || (this.has(p.t()) && !this.has(p.rt()))) +
                +!(this.has(p.t()) || (this.has(p.l()) && !this.has(p.lt()))) +
                +!(this.has(p.b()) || (this.has(p.l()) && !this.has(p.lb()))));
        });
    }
}
globalThis.PointSet = globalThis.ps = function (pts) {
    return new PointSet(pts);
};
globalThis.pt =
    globalThis.p =
        globalThis.point =
            globalThis.Point =
                Object.assign(function pt(...args) {
                    return new Point(...args);
                }, Point);
globalThis.ij = Object.assign(function ij(i, j, ...args) {
    return new Point(j, i, ...args);
}, Point);
class Grid {
    rows;
    constructor(rows) {
        this.rows = rows;
    }
    diag(pt, x, y) {
        if (Math.abs(x) != Math.abs(y)) {
            throw new Error("Called .diag() with values of different sizes");
        }
        if (!this.has(pt)) {
            return [];
        }
        const cells = [this.at(pt)];
        if (x < 0) {
            for (const v of ri(1, -x)) {
                const o = pt.add(point(-v, v * Math.sign(y)));
                if (this.has(o))
                    cells.push(this.at(o));
                else
                    return cells;
            }
        }
        else if (x > 0) {
            for (const v of ri(1, x)) {
                const o = pt.add(point(v, v * Math.sign(y)));
                if (this.has(o))
                    cells.push(this.at(o));
                else
                    return cells;
            }
        }
        return cells;
    }
    has(pt) {
        return pt.i in this.rows && pt.j in this.rows[pt.i];
    }
    int() {
        return new Grid(this.rows.int());
    }
    tx() {
        return new Grid(this.rows.tx());
    }
    row(i, start, end) {
        if (start == null && end == null) {
            return this.rows[i];
        }
        else {
            return this.rows[i]?.slice(start, end);
        }
    }
    at(pt) {
        return this.rows[pt.y]?.[pt.x];
    }
    *k() {
        for (let i = 0; i < this.rows.length; i++) {
            if (!(i in this.rows))
                continue;
            for (let j = 0; j < this.rows[i].length; j++) {
                if (!(j in this.rows[i]))
                    continue;
                yield pt(j, i, undefined, this);
            }
        }
    }
    flat() {
        return this.rows.flat();
    }
    map(f) {
        return new Grid(this.rows.map((row, i) => row.map((col, j) => f(col, ij(i, j, undefined, this), this))));
    }
    c() {
        return new Grid(this.rows.c());
    }
}
export {};
