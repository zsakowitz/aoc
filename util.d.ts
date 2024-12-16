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
    get gg(): Grid<T>;
    addIn(set: PointSet<T>): this;
    delIn(set: PointSet<T>): this;
    scale(n: number): Point<T>;
    c90(): Point<T>;
    cc90(): Point<T>;
    exists(): boolean;
    xq(): this | undefined;
    fnfilter(pt: Point): boolean;
    diag(x: number, y: number): (T | undefined)[];
    drb(s: number): (T | undefined)[];
    drt(s: number): (T | undefined)[];
    dlb(s: number): (T | undefined)[];
    c(): Point<T>;
    get t(): Point<T>;
    get l(): Point<T>;
    get b(): Point<T>;
    get r(): Point<T>;
    get lt(): Point<T>;
    get rt(): Point<T>;
    get lb(): Point<T>;
    get rb(): Point<T>;
    n(): Point<T>[];
    nf(): Point<T>[];
    add(other: Point, from?: Point): Point<T>;
    sub(other: Point, from?: Point): Point<T>;
    get i(): number;
    get j(): number;
    is(other: Point): boolean;
    id(): string;
    neg(): Point<T>;
    inv(): Point<T>;
    /**
     * Index in a grid like
     *
     *     1 3 6 10
     *     2 5 9
     *     4 8
     *     7
     */
    idxbrbrbr(): number;
    get v(): T | X;
    set v(v: T);
}
declare class PointSet<T = unknown> {
    pts: Map<string, Point<T>>;
    constructor(input?: Iterable<Point<T>>);
    c(): PointSet<T>;
    lt(): Point<T>;
    rb(): Point<T>;
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
    rows: T[][];
    constructor(rows: T[][]);
    indexOf(el: T): Point<T> | X;
    i(el: T): Point<T> | undefined;
    slice(a: Point, b: Point): Grid<T>;
    log(): this;
    diag(pt: Point, x: number, y: number): (T | undefined)[];
    has(pt: Point): boolean;
    int<U>(this: Grid<FnInt<U>>): Grid<T extends FnInt<infer U> ? U : never>;
    tx(): Grid<T>;
    row(i: number, start?: number, end?: number): T[] | X;
    at(pt: Point): T | X;
    set(pt: Point, value: T): T;
    k(): IteratorObject<Point<T>, undefined>;
    flat(): T[];
    map<U>(f: (value: T, index: Point<T>, grid: Grid<T>) => U): Grid<U>;
    c(this: Grid<T & FnCopy>): Grid<T>;
    copyFrom(other: Grid<T>): void;
    draw(this: Grid<string>): void;
}
declare var __Point: typeof Point;
type __Point<T> = Point<T>;
declare var __Grid: typeof Grid;
type __Grid<T> = Grid<T>;
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
        /**
         * Takes the standard modulus, where negatives are wrapped up. `divisor`
         * should be positive.
         */
        imod(divisor: number): number;
        /** Returns this number. */
        int(): number;
        /** Concatenates the integers `this` and `other`. */
        concat(other: number): number;
        /** Returns `true` if `x` is `this` or a point with matching value. */
        fnfilter(x: number | Point<number>): boolean;
        /** Checks this number against an expected value, throwing on error. */
        check(expected: number): number;
        /** Returns `this + 1`. */
        inc(): number;
        /** Returns `this - 1`. */
        dec(): number;
        /** Returns a copied version of `this`. */
        c(): number;
        /** Computes the signed difference `this - other`. */
        sd(other: number): number;
        /** Computes the unsigned difference `|this - other|`. */
        ud(other: number): number;
        /** Checks whether this number matches the passed filter. */
        is(x: FnFilter<number, undefined>): boolean;
        /** Returns this number, clamped between `min` and `max`. */
        clamp(min: number, max: number): number;
        /** Returns the minimum of `this` and its arguments. */
        min(...others: number[]): number;
        /** Returns the maximum of `this` and its arguments. */
        max(...others: number[]): number;
        /** Returns a list of numbers 0 to `this`. */
        fnasnumberbase(): string[];
        /** If `this == -1`, returns `f()`. Otherwise, returns `this`. */
        m1<T>(f: () => T): number | T;
        /** Writes this number in a balanced base system. */
        nbal(base: FnAsNumberBase): string;
        /** Returns the `this`th capture group from the passed regex. */
        fnregexcapture(x: RegExpExecArray): string | X;
    }
    interface String {
        /** Parses this string as a number. */
        int(): number;
        /** Returns any integers in `this`. */
        ints(): number[];
        /** Parses this string as a direction `^` `<` `>` `v`. */
        dir(): Point | undefined;
        /**
         * Returns `.dir()` called on all instances of `^` `<` `>` `v` in this
         * string.
         */
        dirs(): Point[];
        /** Alias for `.replaceAll()`. */
        ra(searchValue: string | RegExp, replacer: string | ((source: string, ...args: any[]) => string)): string;
        /** Returns `true` if `x` is `this` or a point with matching value. */
        fnfilter(x: string | Point<string>): boolean;
        /** Counts the number of occurrences of `f` in `this`. */
        count(f: FnStrCountTarget): number;
        /** Counts the number of occurrences of `this` in `source`. */
        fncounttarget(source: string): number;
        /** Splits this string on every character. */
        chars(): string[];
        /** Splits this string on every newline. */
        lines(): string[];
        /** Makes a grid of characters in this string. */
        grid(): Grid<string>;
        /** Splits this string on any whitespace. */
        sws(): string[];
        /** Copies this string. */
        c(): string;
        /** Splits this string on every `label`. */
        on(label: string | TemplateStringsArray): string[];
        /** Checks if this string matches the passed filter. */
        is(x: FnFilter<string, undefined>): boolean;
        /** Splits this string at the given index. */
        xat(i: number): [string, string];
        /** Splits this string into two strings of equal length. */
        xmid(): [string, string];
        /**
         * Parses this string in some base where the first digit means `offset`.
         *
         * For instance, `.nb("-01", -2)` parses in balanced ternary, and `.nb(5,
         * 0)` parses in base 5.
         */
        nb(digits: FnAsNumberBase, offset: number): number;
        /** Returns the characters in this string. */
        fnasnumberbase(): string[];
        /**
         * Checks that this string matches `expected`, throwing on error.
         *
         * Will warn without `confirmation`, as string results are not typical of
         * AoC.
         */
        check(expected: string, confirmation: "YESIMSURE"): string;
        /** Returns all matches of the given global `RegExp`. */
        mall(regex: RegExp): string[];
        /** Returns this string and its reversed counterpart. */
        mx(): [normal: string, reversed: string];
        /** Reverses this string. */
        rev(): string;
        /** Reverses this string. */
        reverse(): string;
        /** Transposes this string's lines and character columns. */
        tx(): string;
        /**
         * Matches `this` against `regex`, returning the capturing groups of the
         * first match.
         */
        cap(regex: RegExp): string[] | X;
        /** Matches `this` against `regex`, returning the result specified by `cap`. */
        cap<T>(regex: RegExp, cap: FnRegexCapture<T>): T | X;
        /** Matches `this` against `regex`, returning all capturing groups. */
        caps(regex: RegExp): string[][];
        /**
         * Matches `this` against `regex`, passing all match results to `cap` and
         * forwarding the return values.
         */
        caps<T>(regex: RegExp, cap: FnRegexCapture<T>): T[];
        /**
         * If `this` is `zero`, `one`, or another lowercase number digit, returns
         * that value. Otherwise, parses `this` as a number.
         */
        digitname(): number;
        /** Returns all digits in this string. */
        digits(): number[];
        /**
         * Returns all digits or digit names in this string, starting from the
         * front.
         *
         * `twone` becomes `[2]`.
         */
        digitnamesfwd(): number[];
        /**
         * Returns all digits or digit names in this string, starting from the back.
         *
         * `twone` becomes `[1]`.
         */
        digitnamesrev(): number[];
    }
    interface Function {
        /** Calls `this` with the provided arguments. */
        fnfilter<T, I>(this: (x: T, i: I) => boolean, x: T, i: I): boolean;
        /** Returns `this`. */
        c<T>(this: T): T;
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
         *
         * Note that the type definition is incorrect. `tsc` doesn't properly infer
         * the arguments type, so I can't make a proper new `(...args: params) =>
         * boolean` type. Thus, calling `(() => true).inv()` might mistakenly output
         * a type of `() => true`. Be aware of this.
         */
        inv<A extends (...args: any) => boolean>(this: A): A;
        /** Calls `this` with the provided arguments. */
        fnregexcapture<T extends (x: RegExpExecArray) => any>(this: T, x: RegExpExecArray): ReturnType<T>;
    }
    interface RegExp {
        /** Returns `true` if `x` matches `this`. */
        fnfilter(x: string): boolean;
        /** Counts the number of instances of `this` in `source`. */
        fncounttarget(source: string): number;
        /** Returns `this`. */
        c(): RegExp;
    }
    interface ArrayBase<T> {
        /** Equivalent to `.map(f).filter(x => x != null)`. */
        mnn<U>(f: (value: T, index: number, array: T) => U): NonNullable<U>[];
        /** Returns a string created from `id`ing all nested objects. */
        id(this: {
            id(): string;
        }[]): string;
        /** Equivalent to `.join("")` */
        readonly j: string;
        /** Returns `true` if any element matches `f`. */
        any(f: FnFilter<T>): boolean;
        /** Calls `.fncounttarget(source)` on each element, and returns the sum. */
        fncounttarget(this: readonly FnStrCountTarget[], source: string): number;
        /** Returns elements which match the filter `f`. */
        f(f: FnFilter<T>): T[];
        /**
         * Returns elements which match the filter `f`, but preserves indices by
         * creating a sparse array.
         */
        fi(f: FnFilter<T>): T[];
        /** Shorthand for `.keys()`. */
        k(): IteratorObject<number>;
        /** Shorthand for `.values()`. */
        v(): IteratorObject<T>;
        /** Shorthand for `.indexOf()`. */
        i(v: T): number;
        /** Equivalent to `.map(x => x.int())`. */
        int(this: FnInt<any>[]): (T extends FnInt<infer U> ? U : never)[];
        /** Returns the last element of this array. */
        get last(): T | X;
        /**
         * Counts the number of elements which match `f`, or returns `this.length`
         * if none match.
         */
        count(f?: FnFilter<T> | null): number;
        /** Returns the sum of the values in this array. */
        sum(this: number[]): number;
        /** Passes each element to `f`, and sums the results. */
        sum(f: (value: T, index: number, self: this) => number): number;
        /** Returns the product of the values in this array. */
        prod(this: number[]): number;
        /** Passes each element to `f`, and multiplies the results. */
        prod(f: (value: T, index: number, self: this) => number): number;
        /** Takes the Cartesian product of `this` and `other`. */
        by<U>(other: IteratorObject<U> | U[]): [T, U][];
        /**
         * Equivalent to `.slice()`. Makes working with iterators easier because an
         * extra `.toArray()` call will not throw an error.
         */
        toArray(): T[];
        /** Equivalent to `.map(x => x.sws())`. */
        sws(this: FnSws<any>[]): (T extends FnSws<infer U> ? U : never)[];
        /** Equivalent to `.map(x => x.c())`. */
        c(this: FnCopy[]): T[];
        /** Equivalent to `.map(x => x.on(...arguments))` */
        on(this: FnOn<any>[], on: string | TemplateStringsArray): (T extends FnOn<infer U> ? U : never)[][];
        /** Transposes this array. */
        tx<T>(this: T[][]): T[][];
        /** Returns all subarrays of length 1 in this array. */
        w(n: 1): [T][];
        /** Returns all contiguous pairs in this array. */
        w(n: 2): [T, T][];
        /** Returns all contiguous triplets in this array. */
        w(n: 3): [T, T, T][];
        /** Returns all contiguous windows of `n` values in this array. */
        w(n: number): T[][];
        /** Takes the signed difference between each pair of numbers. */
        sd(this: FnSd[]): T[];
        /** Takes the unsigned difference between each pair of numbers. */
        ud(this: FnUd[]): T[];
        /** Returns the middle element. */
        mid(): T | X;
        /** Equivalent to `.map(x => x[key])`. */
        key<K extends keyof T>(key: K): T[K][];
        /**
         * Copies this array, then removes the specified index and returns the new
         * array.
         */
        wo(index: number): T[];
        /**
         * Iterates over all indices of `this`, calling `.wo()` on each one and
         * yielding the results.
         *
         *     ;["hi", "world", "bye"].woall().forEach(console.log)
         *     // ["world", "bye"]
         *     // ["hi", "bye"]
         *     // ["hi", "world"]
         */
        woall(): IteratorObject<T[]>;
        /**
         * If this is an array of `[x,y]` tuples, returns an iterator over points
         * representing those `(x,y)` pairs.
         */
        xy(this: IteratorObject<[x: number, y: number], any, any>): IteratorObject<Point, any, any>;
        /**
         * If this is an array of `[i][j]` tuples, returns an iterator over points
         * representing those pairs.
         */
        ij(this: IteratorObject<[i: number, j: number], any, any>): IteratorObject<Point, any, any>;
        /** Returns `true` if all elements match `f`. */
        all(f: FnFilter<T>): boolean;
        /** Returns `true` if for some `f` of `fs`, all elements match `f`. */
        allany(...fs: FnFilter<T>[]): boolean;
        /**
         * Removes duplicates from the array, optionally using `key` as the key of
         * each element.
         */
        unique(key?: (x: T, i: number, a: T[]) => any): T[];
        /** Returns `true` if any element returns `true`. */
        fnfilter<T, I>(this: FnFilter<T, I>[], value: T, index: I): boolean;
        /** Generates all combinations of two elements. */
        choose2(): Generator<[x: T, y: T, xi: number, yi: number]>;
        /** Generates all combinations of two elements. */
        c2(): Generator<[x: T, y: T, xi: number, yi: number]>;
        /** Generates all permutations of this array. */
        perms(): Generator<{
            [K in keyof this]: this[keyof this & number];
        }>;
    }
    interface ReadonlyArray<T> extends ArrayBase<T> {
    }
    interface Array<T> extends ArrayBase<T> {
        /** Sets the last element of this array. */
        set last(v: T);
        /** Sorts this array numerically. */
        s(this: number[]): number[];
    }
    interface IteratorObject<T, TReturn = unknown, TNext = unknown> {
        /** Sums the elements of this iterator. */
        sum(this: IteratorObject<number | boolean>): number;
        /** Passes each element of this iterator to `f` and sums the results. */
        sum(f: (value: T, index: number, self: this) => number | boolean): number;
        /** Takes the product the elements of this iterator. */
        prod(this: IteratorObject<number | boolean>): number;
        /** Passes each element of this iterator to `f` and multiplies the results. */
        prod(f: (value: T, index: number, self: this) => number | boolean): number;
        /**
         * Counts the number of elements which match `f`, or the number of elements
         * at all if `f == null`.
         */
        count(f?: FnFilter<T> | null): number;
        /**
         * Like .reduce(), but yields every intermediate value (excluding
         * `initial`).
         */
        acc<U>(f: (a: U, b: T, index: number) => U, initial: U): IteratorObject<U>;
        /**
         * Yields `[index, value]` tuples, optionally filtering by `f`. `f` is
         * passed the original index, not the index after filtering.
         */
        enum(f?: FnFilter<T> | null): IteratorObject<[index: number, value: T], number, unknown>;
        /** Finds the first index whose value matches `f`. */
        i(f: FnFilter<T>): number;
        /** Filters by `f`. */
        f(f: FnFilter<T>): IteratorObject<T>;
        /** Collects this iterator's values into an array. */
        arr(): T[];
        /** Iterates over the Cartesian product of `this` and `other`. */
        by<U>(other: IteratorObject<U> | U[]): IteratorObject<[T, U]>;
        /** Equivalent to `.map(x => x[key])`. */
        key<K extends keyof T>(key: K): IteratorObject<T[K], undefined, unknown>;
        /**
         * If this is an array of `[x,y]` tuples, returns an iterator over points
         * representing those `(x,y)` pairs.
         */
        xy(this: IteratorObject<[x: number, y: number], any, any>): IteratorObject<Point, any, any>;
        /**
         * If this is an array of `[i][j]` tuples, returns an iterator over points
         * representing those pairs.
         */
        ij(this: IteratorObject<[i: number, j: number], any, any>): IteratorObject<Point, any, any>;
        /**
         * A combination of `.filter()` and `.map()`, where the global `none` value
         * (alias: `Symbol.none`) is used to skip the value in output.
         */
        mu<U>(f: (value: T, index: number) => U | typeof none): Generator<Exclude<U, typeof none>, unknown, unknown>;
        /**
         * A combination of `.filter()` and `.map()`, where `null` and `undefined`
         * values are skipped in the output.
         */
        mnn<U>(f: (value: T, index: number) => U | null | undefined): Generator<U & {}, unknown, unknown>;
        /** Runs this iterator to completion. */
        run(): void;
    }
    interface Object {
        /** Equivalent to `f(this)`. Useful for binding complex operations. */
        do<T, U>(this: T, f: (x: T) => U): U;
        /** Repeats `this` in an array `n` times. */
        r<T>(this: Extract<T, FnCopy>, n: number): T[];
    }
    interface Boolean {
        /** Returns `this`. */
        c(): boolean;
        /**
         * Returns `-1` if `false`. Otherwise, `1`. Useful for custom sorting
         * functions, as in `.sort((a, b) => (a < b).s())`.
         */
        s(): -1 | 1;
    }
    /** Creates an inclusive range `0..=max`. */
    function ri(max: number, _?: undefined): Range;
    /** Creates an inclusive range `min..=max`. */
    function ri(min: number, max: number): Range;
    /** Creates an inclusive range `0..=min` or `min..=max`. */
    function ri(min: number, max?: number): Range;
    /** Creates an exclusive range `0..max`. */
    function rx(max: number, _?: undefined): Range;
    /** Creates an exclusive range `min..max`. */
    function rx(min: number, max: number): Range;
    /** Creates an exclusive range `0..min` or `min..max`. */
    function rx(min: number, max?: number): Range;
    /** Gets today's year and date in AoC time. */
    function today(): [year: number, date: number];
    /** Ensures the input for the specified date is cached. */
    function checkInput(year: number, date: number): Promise<void>;
    /** Gets the input for the specified date. */
    function input(year: number, date: number): string;
    /**
     * Helper for creating tuples, as this usually requires `as const`, which
     * isn't available in JS code.
     */
    function t<T extends readonly any[]>(...args: T): Mut<T>;
    /**
     * Helper for creating tuples, as this usually requires `as const`, which
     * isn't available in JS code.
     */
    function tuple<T extends readonly any[]>(...args: T): Mut<T>;
    /** Throws if `value` is `null` or `undefined`. Else, returns `value`. */
    function nn<T>(value: T): NonNullable<T>;
    /** Equivalent to x.mx(), but shorter for template strings. */
    function mx(x: string | TemplateStringsArray): [normal: string, reversed: string];
    /** A set of points. */
    var PointSet: typeof __PointSet & {
        <T>(init?: Iterable<Point<T>>): PointSet<T>;
    };
    /** A set of points. */
    var ps: typeof PointSet;
    /** Creates a point. */
    var Point: typeof __Point & {
        <T>(x: number, y: number, z?: number | undefined, g?: Grid<T>): Point<T>;
    };
    /** Creates a point. */
    var point: typeof Point;
    /** Creates a point. */
    var pt: typeof Point;
    /** Creates a point. */
    var p: typeof Point;
    /** Creates a point. */
    var ij: typeof Point;
    /** A point. */
    type Point<T = unknown> = __Point<T>;
    /** Creates a grid. */
    var Grid: typeof __Grid & {
        <T>(rows?: T[][]): Grid<T>;
        new <T>(rows?: T[][]): Grid<T>;
    };
    /** A grid. */
    type Grid<T> = __Grid<T>;
    /** An iterator over all positive integers. */
    var ints: {
        (): Generator<number, never, unknown>;
        [Symbol.iterator](): Generator<number, never, unknown>;
    };
    interface SymbolConstructor {
        /** Represents the absence of a value. Used in `Iterator.prototype.mu`. */
        readonly none: unique symbol;
    }
    /** Represents the absence of a value. Used in `Iterator.prototype.mu`. */
    var none: typeof Symbol.none;
}
export {};
