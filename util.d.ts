declare const _: number | undefined;
type X = Exclude<typeof _, number>;
declare function rangeTo(a: number, b: number): Generator<number, void, unknown> & {
    has: (x: number) => boolean;
    fnfilter: (x: number) => boolean;
};
type Range = ReturnType<typeof rangeTo>;
declare class Point<T = unknown> {
    readonly x: number;
    readonly y: number;
    readonly z: number | undefined;
    readonly g: Grid<T> | undefined;
    constructor(x: number, y: number, z: number | undefined, g: Grid<T> | undefined);
    fnfilter(pt: Point): boolean;
    diag(x: number, y: number): (T | undefined)[];
    c(): Point<T>;
    t(): Point<T>;
    l(): Point<T>;
    b(): Point<T>;
    r(): Point<T>;
    lt(): Point<T>;
    rt(): Point<T>;
    lb(): Point<T>;
    rb(): Point<T>;
    n(): Point<T>[];
    nf(): Point<T>[];
    add(other: Point): Point<T>;
    sub(other: Point): Point<T>;
    get i(): number;
    get j(): number;
    is(other: Point): boolean;
    id(): string;
    /** Index in a grid like
     *
     * ```
     * 1 3 6 10
     * 2 5 9
     * 4 8
     * 7
     * ```
     */
    idxbrbrbr(): number;
    get v(): T | X;
}
declare class PointSet<T = unknown> {
    pts: Map<string, Point<T>>;
    constructor(input?: Iterable<Point<T>>);
    clear(): void;
    add(pt: Point<T>): void;
    delete(pt: Point<T>): boolean;
    del(pt: Point<T>): boolean;
    has(pt: Point<T>): boolean;
    k(): MapIterator<Point<T>>;
    [Symbol.iterator](): MapIterator<Point<T>>;
    get size(): number;
    perim(): number;
    edges(): number;
}
declare class Grid<T> {
    readonly rows: T[][];
    constructor(rows: T[][]);
    diag(pt: Point, x: number, y: number): (T | undefined)[];
    has(pt: Point): boolean;
    int<U>(this: Grid<FnInt<U>>): Grid<T extends FnInt<infer U> ? U : never>;
    tx(): Grid<T>;
    row(i: number, start?: number, end?: number): T[] | X;
    at(pt: Point): T | X;
    k(): IteratorObject<Point<T>, undefined>;
    flat(): T[];
    map<U>(f: (value: T, index: Point<T>, grid: Grid<T>) => U): Grid<U>;
}
declare var __Point: typeof Point;
type __Point<T> = Point<T>;
declare var __PointSet: typeof PointSet;
type __PointSet<T> = PointSet<T>;
type FnFilter<T, I = number> = ((x: T, i: I) => boolean) | {
    fnfilter(this: any, x: T, i: I): boolean;
};
type FnRegexCapture<T> = ((x: RegExpExecArray) => T) | {
    fnregexcapture(this: any, x: RegExpExecArray): T;
};
type FnAsNumberBase = {
    fnasnumberbase(): readonly string[];
};
type FnInt<T> = {
    int(): T;
};
type FnStrCountTarget = {
    fncounttarget(source: string): number;
};
type FnSws<T> = {
    sws(): T;
};
type FnOn<T> = {
    on(source: string | TemplateStringsArray): T[];
};
interface FnSd {
    sd(other: this): this;
}
interface FnUd {
    ud(other: this): this;
}
interface FnCopy {
    c(): this;
}
type Mut<T> = {
    -readonly [K in keyof T]: T[K];
};
declare global {
    interface Number {
        int(): number;
        fnfilter(x: number | Point<number>): boolean;
        check(expected: number): number;
        inc(): number;
        dec(): number;
        c(): number;
        sd(other: number): number;
        ud(other: number): number;
        is(x: FnFilter<number, undefined>): boolean;
        clamp(min: number, max: number): number;
        min(...others: number[]): number;
        max(...others: number[]): number;
        fnasnumberbase(): string[];
        m1<T>(f: () => T): number | T;
        nbal(base: FnAsNumberBase): string;
        fnregexcapture(x: RegExpExecArray): string | X;
    }
    interface String {
        int(): number;
        ints(): number[];
        fnfilter(x: string | Point<string>): boolean;
        count(f: FnStrCountTarget): number;
        fncounttarget(source: string): number;
        chars(): string[];
        lines(): string[];
        grid(): Grid<string>;
        sws(): string[];
        c(): string;
        on(label: string | TemplateStringsArray): string[];
        is(x: FnFilter<string, undefined>): boolean;
        xat(i: number): [string, string];
        xmid(): [string, string];
        nb(digits: FnAsNumberBase, offset: number): number;
        fnasnumberbase(): string[];
        check(expected: string, confirmation: "YESIMSURE"): string;
        mall(regex: RegExp): string[];
        mx(): [normal: string, reversed: string];
        rev(): string;
        reverse(): string;
        tx(): string;
        cap(regex: RegExp): string[] | X;
        cap<T>(regex: RegExp, cap: FnRegexCapture<T>): T | X;
        caps(regex: RegExp): string[][];
        caps<T>(regex: RegExp, cap: FnRegexCapture<T>): T[];
        digitname(): number;
        digits(): number[];
        digitnamesfwd(): number[];
        digitnamesrev(): number[];
    }
    interface Function {
        fnfilter<T, I>(this: (x: T, i: I) => boolean, x: T, i: I): boolean;
        c<T>(this: T): T;
        inv<F extends (...args: any[]) => any>(this: F): (this: ThisParameterType<F>, ...args: Parameters<F>) => boolean;
        fnregexcapture<T extends (x: RegExpExecArray) => any>(this: T, x: RegExpExecArray): T extends (...args: any[]) => infer T ? T : never;
    }
    interface RegExp {
        fnfilter(x: string): boolean;
        fncounttarget(source: string): number;
        c(): RegExp;
    }
    interface Array<T> {
        any(f: FnFilter<T>): boolean;
        fncounttarget(this: FnStrCountTarget[], source: string): number;
        f(f: FnFilter<T>): T[];
        fi(f: FnFilter<T>): T[];
        k(): IteratorObject<number>;
        v(): IteratorObject<T>;
        i(v: T): number;
        int(this: FnInt<any>[]): (T extends FnInt<infer U> ? U : never)[];
        get last(): T | X;
        set last(v: T);
        count(f?: FnFilter<T> | null): number;
        sum(this: number[]): number;
        sum(f: (value: T, index: number, self: this) => number): number;
        prod(this: number[]): number;
        prod(f: (value: T, index: number, self: this) => number): number;
        by<U>(other: IteratorObject<U> | U[]): [T, U][];
        toArray(): T[];
        sws(this: FnSws<any>[]): (T extends FnSws<infer U> ? U : never)[];
        c(this: FnCopy[]): T[];
        on(this: FnOn<any>[], on: string | TemplateStringsArray): (T extends FnOn<infer U> ? U : never)[][];
        tx<T>(this: T[][]): T[][];
        w(n: 1): [T][];
        w(n: 2): [T, T][];
        w(n: 3): [T, T, T][];
        w(n: number): T[][];
        sd(this: FnSd[]): T[];
        ud(this: FnUd[]): T[];
        s(this: number[]): number[];
        mid(): T | X;
        key<K extends keyof T>(key: K): T[K][];
        wo(index: number): T[];
        woall(): IteratorObject<T[]>;
        xy(this: IteratorObject<[x: number, y: number], any, any>): IteratorObject<Point, any, any>;
        ij(this: IteratorObject<[i: number, j: number], any, any>): IteratorObject<Point, any, any>;
        all(f: FnFilter<T>): boolean;
        allany(...fs: FnFilter<T>[]): boolean;
        unique(key?: (x: T, i: number, a: T[]) => any): T[];
        fnfilter<T, I>(this: FnFilter<T, I>[], value: T, index: I): boolean;
    }
    interface IteratorObject<T, TReturn = unknown, TNext = unknown> {
        sum(this: IteratorObject<number | boolean>): number;
        sum(f: (value: T, index: number, self: this) => number | boolean): number;
        prod(this: IteratorObject<number | boolean>): number;
        prod(f: (value: T, index: number, self: this) => number | boolean): number;
        count(f?: FnFilter<T> | null): number;
        acc<U>(f: (a: U, b: T, index: number) => U, initial: U): IteratorObject<U>;
        counts(f?: FnFilter<T> | null): IteratorObject<[number, T], number, unknown>;
        fi(f: FnFilter<T>): number;
        by<U>(other: IteratorObject<U> | U[]): IteratorObject<[T, U]>;
        key<K extends keyof T>(key: K): IteratorObject<T[K], undefined, unknown>;
        xy(this: IteratorObject<[x: number, y: number], any, any>): IteratorObject<Point, any, any>;
        ij(this: IteratorObject<[i: number, j: number], any, any>): IteratorObject<Point, any, any>;
    }
    interface Object {
        do<T, U>(this: T, f: (x: T) => U): U;
        r<T>(this: Extract<T, FnCopy>, n: number): T[];
    }
    interface Boolean {
        c(): boolean;
        s(): -1 | 1;
    }
    function ri(min: number, max?: number): Range;
    function rx(min: number, max?: number): Range;
    function today(): [year: number, date: number];
    function checkInput(year: number, date: number): Promise<void>;
    function input(year: number, date: number): string;
    function t<T extends readonly any[]>(...args: T): Mut<T>;
    function tuple<T extends readonly any[]>(...args: T): Mut<T>;
    var PointSet: typeof __PointSet & {
        <T>(init?: Iterable<Point<T>>): PointSet<T>;
    };
    var ps: typeof PointSet;
    var Point: typeof __Point & {
        <T>(x: number, y: number, z?: number | undefined, g?: Grid<T>): Point<T>;
    };
    var point: typeof Point;
    var pt: typeof Point;
    var p: typeof Point;
    var ij: typeof Point;
    type Point<T = unknown> = __Point<T>;
}
export {};
