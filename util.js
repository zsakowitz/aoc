"use strict";
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
    return this;
};
Number.prototype.fnfilter = function (n) {
    return n === this;
};
Number.prototype.check = function (expected) {
    if (this !== expected) {
        throw new Error(`${colors.red}FAILED: expected ${expected} but got ${this}${colors.reset}`);
    }
    else {
        console.log(`${colors.green}PASSED: ${expected}${colors.reset}`);
    }
    return this;
};
Number.prototype.inc = function () {
    return this + 1;
};
Number.prototype.dec = function () {
    return this - 1;
};
Number.prototype.c = function () {
    return this;
};
String.prototype.int = function () {
    return this;
};
String.prototype.ints = function () {
    return this.match(/\d+/g)?.map((x) => +x) ?? [];
};
String.prototype.fnfilter = function (n) {
    return n === this;
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
    return this;
};
String.prototype.on = function (label) {
    const l = Array.isArray(label)
        ? String.raw({ raw: label }, ...[].slice.call(arguments, 1))
        : label;
    return this.split(l);
};
Function.prototype.fnfilter = function (x, i) {
    return this(x, i);
};
Function.prototype.c = function () {
    return this;
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
Array.prototype.fncounttarget = function (source) {
    return this.sum((target) => target.counttarget(source));
};
Array.prototype.f = function (f) {
    return this.filter((x, i) => f.fnfilter(x, i));
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
        for (const [i, v] of this) {
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
Object.prototype.do = function (f) {
    return f(this);
};
Object.prototype.r = function (n) {
    return Array.from({ length: n }, () => this.c());
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
globalThis.checkInput = async function (year, day) {
    if (typeof year != "number" ||
        !ri(2015, 20000).has(year) ||
        !ri(1, 25).has(day)) {
        throw new Error("Invalid year or day.");
    }
    const code = `ilowi/${year}/${day}/input`;
    const url = `https://adventofcode.com/${year}/day/${day}/input`;
    if (typeof process == "object") {
        if (arguments.length != 2) {
            warn `Implicitly using today's input; this will break tomorrow.`;
        }
        const file = new URL("./.aoc/" + code, new URL("file://" + process.env.PWD + "/")).pathname;
        if (fs.existsSync(file)) {
            return;
        }
        warn `Fetching new input...`;
        await fetch(url, {
            headers: { cookie: process.env.ILOWI_AOC_COOKIE },
        })
            .then((response) => {
            if (response.ok)
                return response.text();
            throw new Error(`Failed to fetch input for ${year}/${day}.`);
        })
            .then(async (text) => {
            if (text.endsWith("\n"))
                text = text.slice(0, -1);
            await fs.promises.mkdir(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, text);
            return text;
        });
        return;
    }
    if (typeof localStorage == "object" && localStorage.getItem(code)) {
        return;
    }
    const req = new XMLHttpRequest();
    console.log(url);
    req.open("GET", url, false);
    req.send();
    if (req.status == 200) {
        let text = req.response;
        if (text.endsWith("\n"))
            text = text.slice(0, -1);
        localStorage.setItem(code, text);
    }
};
globalThis.input = function input(year = today()[0], day = today()[1]) {
    if (typeof year != "number" ||
        !ri(2015, 20000).has(year) ||
        !ri(1, 25).has(day)) {
        throw new Error("Invalid year or day.");
    }
    const code = `ilowi/${year}/${day}/input`;
    const url = `https://adventofcode.com/${year}/day/${day}/input`;
    if (typeof process == "object") {
        if (arguments.length != 2) {
            warn `Implicitly using today's input; this will break tomorrow.`;
        }
        const file = new URL("./.aoc/" + code, new URL("file://" + process.env.PWD + "/")).pathname;
        if (fs.existsSync(file)) {
            return fs.readFileSync(file, "utf8");
        }
        throw new Error("Attempted to fetch input synchronously in an environment without synchronous HTTP requests.");
    }
    if (typeof localStorage == "object") {
        const value = localStorage.getItem(code);
        if (value) {
            return value;
        }
    }
    const req = new XMLHttpRequest();
    console.log(url);
    req.open("GET", url, false);
    req.send();
    if (req.status == 200) {
        localStorage.setItem(code, req.response);
        return req.response;
    }
    else {
        throw new Error("getting input failed", req.response);
    }
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
        return this.g.a[this.y][this.x];
    }
}
globalThis.pt =
    globalThis.p =
        globalThis.point =
            globalThis.Point =
                Object.assign(function pt(...args) {
                    return new Point(...args);
                }, Point);
class Grid {
    a;
    constructor(a) {
        this.a = a;
    }
    *k() {
        for (let i = 0; i < this.a.length; i++) {
            for (let j = 0; j < this.a[i].length; j++) {
                yield pt(j, i, undefined, this);
            }
        }
    }
}
export {};
