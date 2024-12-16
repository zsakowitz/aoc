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
Number.prototype.imod = function (divisor) {
    if (divisor <= 0) {
        warn `.imod(${divisor}) divides by a nonpositive number.`;
    }
    return ((this % divisor) + divisor) % divisor;
};
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
String.prototype.dir = function () {
    return {
        "^": pt(0, -1),
        "<": pt(-1, 0),
        ">": pt(+1, 0),
        v: pt(0, 1),
    }[this];
};
String.prototype.dirs = function () {
    return this.chars().mnn((x) => x.dir());
};
String.prototype.ra = function (s, r) {
    return this.replaceAll(s, r);
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
Array.prototype.mnn = function (f) {
    return this.map(f).filter((x) => x != null);
};
Array.prototype.id = function () {
    const inner = this.map((x) => x.id());
    if (inner.some((x) => x.includes(";;;"))) {
        return inner.join(";;;;");
    }
    else if (inner.some((x) => x.includes(";;"))) {
        return inner.join(";;;");
    }
    else if (inner.some((x) => x.includes(";"))) {
        return inner.join(";;");
    }
    else {
        return inner.join(";");
    }
};
Object.defineProperty(Array.prototype, "j", {
    configurable: true,
    get() {
        return this.join("");
    },
});
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
Array.prototype.choose2 = Array.prototype.c2 = function* () {
    for (let i = 0; i < this.length; i++) {
        if (!(i in this))
            continue;
        for (let j = i + 1; j < this.length; j++) {
            if (!(j in this))
                continue;
            yield [this[i], this[j], i, j];
        }
    }
};
Array.prototype.perms = function* () {
    if (this.length == 0) {
        return;
    }
    if (this.length == 1) {
        yield [this[0]];
    }
    for (const rest of this.slice(1).perms()) {
        for (let i = 0; i < this.length; i++) {
            yield rest.toSpliced(i, 0, this[0]);
        }
    }
};
Array.prototype.min = function () {
    return Math.min(...this);
};
Array.prototype.max = function () {
    return Math.max(...this);
};
Array.prototype.enum = function () {
    return this.values().enum().toArray();
};
Array.prototype.s = function () {
    return this.sort((a, b) => a - b);
};
Array.prototype.add = function (el) {
    if (!this.includes(el))
        this.push(el);
    return el;
};
Array.prototype.remove = function (el) {
    const idx = this.indexOf(el);
    if (idx != -1)
        this.splice(idx, 1);
    return el;
};
Array.prototype.clear = function () {
    this.length = 0;
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
Iterator.prototype.enum = function* (f) {
    if (!f) {
        let v = 0;
        for (const x of this) {
            yield [v, x];
            v++;
        }
        return v;
    }
    else {
        let v = 0;
        let i = 0;
        for (const x of this) {
            if (f.fnfilter(x, i)) {
                yield [v, x];
                v++;
            }
            i++;
        }
        return v;
    }
};
Iterator.prototype.i = function (f) {
    let i = 0;
    for (const v of this) {
        if (f.fnfilter(v, i)) {
            return i;
        }
        i++;
    }
    return -1;
};
Iterator.prototype.f = function* (f) {
    let i = 0;
    for (const v of this) {
        if (f.fnfilter(v, i))
            yield v;
        i++;
    }
};
Iterator.prototype.arr = function () {
    return this.toArray();
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
Iterator.prototype.mu = function* (f) {
    let i = 0;
    for (const v of this) {
        const n = f(v, i);
        if (n === none)
            return;
        yield n;
        i++;
    }
};
Iterator.prototype.mnn = function* (f) {
    let i = 0;
    for (const v of this) {
        const n = f(v, i);
        if (n == null)
            return;
        yield n;
        i++;
    }
};
Iterator.prototype.run = function () {
    for (const _ of this)
        ;
};
Object.prototype.do = function (f) {
    return f(this);
};
Object.prototype.r = function (n) {
    return Array.from({ length: n }, () => this.c());
};
Object.prototype.log = function (...args) {
    console.log(this, ...args);
    return this;
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
globalThis.mx = function (value) {
    if (Array.isArray(value)) {
        return String.raw({ raw: value }).mx();
    }
    else {
        return value.mx();
    }
};
class Point {
    x;
    y;
    z;
    g;
    static ring(val) {
        const t = [val(pt(0, -1)), pt(0, -1)];
        const l = [val(pt(-1, 0)), pt(-1, 0)];
        const b = [val(pt(0, 1)), pt(0, 1)];
        const r = [val(pt(1, 0)), pt(1, 0)];
        t[2] = b[3] = l;
        t[3] = b[2] = r;
        l[2] = r[3] = b;
        l[3] = r[2] = t;
        return [t, r, b, l];
    }
    constructor(x, y, z, g) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.g = g;
    }
    get gg() {
        if (!this.g) {
            throw new Error("Cannot access .gg on unowned point.");
        }
        return this.g;
    }
    in(grid) {
        return new Point(this.x, this.y, this.z, grid);
    }
    addIn(set) {
        set.add(this);
        return this;
    }
    delIn(set) {
        set.del(this);
        return this;
    }
    scale(n) {
        return new Point(this.x * n, this.y * n, this.z, this.g);
    }
    c90() {
        return new Point(-this.y, this.x, this.z, this.g);
    }
    cc90() {
        return new Point(this.y, -this.x, this.z, this.g);
    }
    exists() {
        if (!this.g) {
            throw new Error("Cannot check for an unowned point's existence.");
        }
        return this.g.has(this);
    }
    xq() {
        if (this.exists()) {
            return this;
        }
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
    drb(s) {
        return this.diag(s, s);
    }
    drt(s) {
        return this.diag(s, -s);
    }
    dlb(s) {
        return this.diag(-s, s);
    }
    c() {
        return new Point(this.x, this.y, this.z, this.g);
    }
    get t() {
        return new Point(this.x, this.y - 1, this.z, this.g);
    }
    get l() {
        return new Point(this.x - 1, this.y, this.z, this.g);
    }
    get b() {
        return new Point(this.x, this.y + 1, this.z, this.g);
    }
    get r() {
        return new Point(this.x + 1, this.y, this.z, this.g);
    }
    get lt() {
        return new Point(this.x - 1, this.y - 1, this.z, this.g);
    }
    get rt() {
        return new Point(this.x + 1, this.y - 1, this.z, this.g);
    }
    get lb() {
        return new Point(this.x - 1, this.y + 1, this.z, this.g);
    }
    get rb() {
        return new Point(this.x + 1, this.y + 1, this.z, this.g);
    }
    n() {
        return [this.t, this.r, this.b, this.l];
    }
    nf() {
        if (!this.g) {
            warn `Getting filtered neighbors of unowned point; will throw`;
        }
        return this.n().filter((pt) => this.g.has(pt));
    }
    add(other, from) {
        return new Point(this.x + other.x - (from ? from.x : 0), this.y + other.y - (from ? from.y : 0), this.z == null ? undefined : this.z + other.z - (from ? from.z : 0), this.g);
    }
    sub(other, from) {
        return new Point(this.x - other.x + (from ? from.x : 0), this.y - other.y + (from ? from.y : 0), this.z == null ? undefined : this.z - other.z + (from ? from.z : 0), this.g);
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
    neg() {
        return new Point(-this.x, -this.y, this.z == null ? undefined : -this.z, this.g);
    }
    inv() {
        return this.neg();
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
        return ((this.y + this.x - 1) * (this.y + this.x - 2)) / 2 + this.x;
    }
    get v() {
        return this.g.at(this);
    }
    set v(v) {
        this.g.set(this, v);
    }
}
class PointSet {
    pts = new Map();
    constructor(input) {
        if (input != null) {
            for (const x of input) {
                this.add(x);
            }
        }
    }
    c() {
        return new PointSet(this.pts.values());
    }
    lt() {
        return this.k().reduce((a, b) => (b.x < a.x || b.y < a.y ? b : a), pt(Infinity, Infinity));
    }
    rb() {
        return this.k().reduce((a, b) => (b.x > a.x || b.y > a.y ? b : a), pt(-Infinity, -Infinity));
    }
    clear() {
        this.pts.clear();
    }
    add(pt) {
        if (this.pts.has(pt.id()))
            return;
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
            return (+!this.has(p.t) + +!this.has(p.b) + +!this.has(p.l) + +!this.has(p.r));
        });
    }
    edges() {
        return this.k().sum((p) => {
            return (+!(this.has(p.l) || (this.has(p.t) && !this.has(p.lt))) +
                +!(this.has(p.r) || (this.has(p.t) && !this.has(p.rt))) +
                +!(this.has(p.t) || (this.has(p.l) && !this.has(p.lt))) +
                +!(this.has(p.b) || (this.has(p.l) && !this.has(p.lb))));
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
                }, { ring: Point.ring });
globalThis.ij = Object.assign(function ij(i, j, ...args) {
    return new Point(j, i, ...args);
}, { ring: Point.ring });
class Grid {
    rows;
    constructor(rows) {
        this.rows = rows;
    }
    indexOf(el) {
        return this.k().find((x) => x.v == el);
    }
    i(el) {
        return this.indexOf(el);
    }
    slice(a, b) {
        if (this.rows.length == 0)
            return new Grid([]);
        let i1 = a.i;
        let j1 = a.j;
        let i2 = b.i;
        let j2 = b.j;
        // if (i1 < 0) i1 = this.rows.length + i1
        // if (i2 < 0) i2 = this.rows.length + i2
        // if (j1 < 0) warn`negative columns not supported`
        // if (j2 < 0) warn`negative columns not supported`
        // if (i2 < i1) [i1, i2] = [i2, i1]
        // if (j2 < j1) [j1, j2] = [j2, j1]
        return new Grid(this.rows.slice(i1, i2 + 1).map((row) => row.slice(j1, j2 + 1)));
    }
    log() {
        console.log(this.rows.map((x) => x.j).join("\n"));
        return this;
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
    set(pt, value) {
        this.rows[pt.i][pt.j] = value;
        return value;
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
    [Symbol.iterator]() {
        return this.k();
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
    copyFrom(other) {
        this.rows = other.rows.c();
    }
    draw() {
        const rows = this.map((t) => {
            const s = document.createElement("span");
            s.textContent = t;
            s.style.color =
                {
                    "#": "black",
                    "[": "brown",
                    "]": "brown",
                    ".": "#c0c0c0",
                    "@": "white",
                }[t] || "currentcolor";
            s.style.backgroundColor =
                {
                    "@": "blue",
                }[t] || "transparent";
            return s;
        }).rows.map((row) => {
            const p = document.createElement("span");
            p.append(...row);
            return p;
        });
        const el = document.createElement("pre");
        for (const [i, row] of rows.entries()) {
            if (i != 0)
                el.append("\n");
            el.append(row);
        }
        el.id = "grid";
        const existing = document.getElementById("grid");
        if (existing)
            existing.replaceWith(el);
        document.body.append(el);
    }
}
globalThis.Grid = function (rows = []) {
    return new Grid(rows);
};
class Graph {
    v;
    constructor(v = []) {
        this.v = v;
    }
    /**
     * Clones the graph, its nodes, and its edges, but does not clone the node
     * values.
     */
    sc(clone = (v) => v) {
        const graph = new Graph();
        const map = new Map();
        for (const prev of this.v) {
            const node = graph.add(clone(prev.v));
            map.set(prev, node);
        }
        for (const prev of this.v) {
            const a = map.get(prev);
            for (const { b: bPrev, w } of prev.o) {
                const b = map.get(bPrev);
                a.link(b, w);
            }
        }
        return graph;
    }
    /** Same as `.sc()`, but reverses all edges. */
    screv(clone = (v) => v) {
        const graph = new Graph();
        const map = new Map();
        for (const prev of this.v) {
            const node = graph.add(clone(prev.v));
            map.set(prev, node);
        }
        for (const prev of this.v) {
            const a = map.get(prev);
            for (const { b: bPrev, w } of prev.o) {
                const b = map.get(bPrev);
                b.link(a, w);
            }
        }
        return graph;
    }
    k() {
        return this.v.values();
    }
    add(value) {
        const node = new GraphNode(value, this);
        this.v.push(node);
        return node;
    }
    djikstra(start) {
        const shortest = new Map(this.k().map((x) => [x, Infinity]));
        const unvisited = new Set(this.k());
        for (const zeroed of Array.isArray(start) ? start : [start]) {
            shortest.set(zeroed, 0);
        }
        while (unvisited.size) {
            let min = null;
            for (const node of unvisited) {
                if (min == null) {
                    min = node;
                }
                else if (shortest.get(node) < shortest.get(min)) {
                    min = node;
                }
            }
            const a = min;
            for (const edge of a.o) {
                const { w, b } = edge;
                if (w + shortest.get(a) < shortest.get(b)) {
                    shortest.set(b, w + shortest.get(a));
                }
            }
            unvisited.delete(a);
        }
        return shortest;
    }
}
globalThis.Graph = Graph;
class GraphNode {
    v;
    g;
    /** Outgoing links. */
    o = [];
    /** Incoming links. */
    i = [];
    constructor(v, g) {
        this.v = v;
        this.g = g;
    }
    link(node, weight = 1) {
        const edge = new GraphEdge(this, node, weight);
        this.o.push(edge);
        node.i.push(edge);
        return edge;
    }
    remove() {
        for (const o of this.o) {
            o.b.i.remove(o);
        }
        for (const i of this.i) {
            i.a.o.remove(i);
        }
        this.o.clear();
        this.i.clear();
        this.g.v.remove(this);
    }
    log() {
        log(this.v);
    }
}
function log(v) {
    if (v == null) {
        console.log(v);
    }
    else if (typeof v.log == "function") {
        v.log();
    }
    else {
        console.log(v);
    }
}
globalThis.GraphNode = GraphNode;
class GraphEdge {
    a;
    b;
    w;
    constructor(a, b, w) {
        this.a = a;
        this.b = b;
        this.w = w;
    }
    unlink() {
        this.a.o.remove(this);
        this.b.i.remove(this);
    }
}
globalThis.GraphEdge = GraphEdge;
class DLL {
    v;
    l;
    r;
    constructor(v) {
        this.v = v;
        this.l = this;
        this.r = this;
    }
    /** Inserts a new value to this node's right. */
    irv(value) {
        const next = new DLL(value);
        next.l = this;
        next.r = this.r;
        this.r = next;
        return next;
    }
    /** Removes this node. */
    rm() {
        this.l.r = this.r;
        this.r.l = this.l;
        this.l = this.r = this;
    }
}
globalThis.DLL = DLL;
class FibHeap {
    lt;
    size = 0;
    min;
    root;
    constructor(lt = (a, b) => a < b) {
        this.lt = lt;
    }
    insert(value) {
        const node = new FibNode(value, this);
        this.mergeWithRootList(node);
        if (this.min == null || this.lt(value, this.min.vr)) {
            this.min = node;
        }
        this.size++;
        return node;
    }
    insertRecursive(value) {
        const node = new FibNode(null, this);
        node.vr = value(node);
        this.mergeWithRootList(node);
        if (this.min == null || this.lt(node.vr, this.min.vr)) {
            this.min = node;
        }
        this.size++;
        return node;
    }
    mergeWithRootList(node) {
        if (this.root) {
            node.r = this.root;
            node.l = this.root.l;
            this.root.l.r = node;
            this.root.l = node;
        }
        else {
            this.root = node;
        }
    }
    union(other) {
        if (!other.root) {
            return this;
        }
        if (!this.root) {
            return other;
        }
        const ret = new FibHeap(this.lt);
        ret.root = this.root;
        ret.min = this.lt(this.min.vr, other.min.vr) ? this.min : other.min;
        const last = other.root.l;
        other.root.l = ret.root.l;
        ret.root.l.r = other.root;
        ret.root.l = last;
        ret.root.l.r = ret.root;
        ret.size = this.size + other.size;
        return ret;
    }
    extractMin() {
        const z = this.min;
        if (!z)
            return z;
        if (z.child) {
            const children = z.child.siblings();
            for (const c of children) {
                this.mergeWithRootList(c);
                c.parent = undefined;
            }
        }
        this.removeFromRootList(z);
        if (z == z.r) {
            this.min = undefined;
            this.root = undefined;
        }
        else {
            this.min = z.r;
            this.consolidate();
        }
        this.size--;
        return z;
    }
    removeFromRootList(node) {
        if (node == this.root) {
            this.root = node.r;
        }
        node.l.r = node.r;
        node.r.l = node.l;
    }
    consolidate() {
        const A = Array.from({ length: Math.floor(Math.log(this.size) * 2) }, () => undefined);
        const nodes = this.root.siblings();
        for (const w of rx(nodes.length)) {
            let x = nodes[w];
            let d = x.degree;
            while (A[d]) {
                let y = A[d];
                if (this.lt(y.vr, x.vr)) {
                    const temp = x;
                    x = y;
                    y = temp;
                }
                this.heapLink(y, x);
                A[d] = undefined;
                d++;
            }
            A[d] = x;
        }
        for (const i of rx(A.length)) {
            if (A[i]) {
                if (this.lt(A[i].vr, this.min.vr)) {
                    this.min = A[i];
                }
            }
        }
    }
    heapLink(y, x) {
        this.removeFromRootList(y);
        y.l = y.r = y;
        this.mergeWithChildList(x, y);
        x.degree += 1;
        y.parent = x;
        y.mark = false;
    }
    mergeWithChildList(parent, node) {
        if (!parent.child) {
            parent.child = node;
        }
        else {
            node.r = parent.child.r;
            node.l = parent.child;
            parent.child.r.l = node;
            parent.child.r = node;
        }
    }
    cut(x, y) {
        this.removeFromChildList(y, x);
        y.degree -= 1;
        this.mergeWithRootList(x);
        x.parent = undefined;
        x.mark = false;
    }
    cascadingCut(y) {
        const z = y.parent;
        if (z) {
            if (y.mark) {
                this.cut(y, z);
                this.cascadingCut(z);
            }
            else {
                y.mark = true;
            }
        }
    }
    removeFromChildList(parent, node) {
        if (parent.child == parent.child.r) {
            parent.child = undefined;
        }
        else if (parent.child == node) {
            parent.child = node.r;
            node.r.parent = parent;
        }
        node.l.r = node.r;
        node.r.l = node.l;
    }
    log() {
        console.group("<tree>");
        try {
            if (this.root) {
                for (const node of this.root.siblings()) {
                    node.log();
                }
            }
        }
        finally {
            console.groupEnd();
        }
    }
}
globalThis.FibHeap = FibHeap;
class FibNode {
    vr;
    heap;
    degree = 0;
    mark = false;
    parent;
    child;
    l;
    r;
    constructor(vr, heap) {
        this.vr = vr;
        this.heap = heap;
        this.l = this.r = this;
    }
    get v() {
        return this.vr;
    }
    set v(k) {
        const { heap } = this;
        if (heap.lt(this.vr, k)) {
            return;
        }
        this.vr = k;
        const y = this.parent;
        if (y && heap.lt(this.vr, y.vr)) {
            heap.cut(this, y);
            heap.cascadingCut(y);
        }
        if (heap.lt(this.vr, heap.min.vr)) {
            heap.min = this;
        }
    }
    siblings() {
        const ret = [this];
        while (true) {
            const next = ret.last.r;
            if (next == this)
                return ret;
            ret.push(next);
        }
    }
    log() {
        if (this.child) {
            console.group(this.vr);
            try {
                for (const c of this.child.siblings()) {
                    c.log();
                }
            }
            finally {
                console.groupEnd();
            }
        }
        else if (this.vr == null) {
            console.log(this.vr);
        }
        else {
            this.vr.log();
        }
    }
}
globalThis.FibNode = FibNode;
globalThis.ints = Object.assign(function* () {
    for (let i = 0;; i++) {
        yield i;
    }
}, {
    *[Symbol.iterator]() {
        for (let i = 0;; i++) {
            yield i;
        }
    },
});
Symbol.none ??= Symbol();
globalThis.none = Symbol.none;
export {};
