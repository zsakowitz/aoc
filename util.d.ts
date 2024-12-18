declare const _: number | undefined;
type X = Exclude<typeof _, number>;
interface LinkProps {
    /** The weight to assign each created edge. Defaults to `1`. */
    weight?: number;
    /** If enabled, only creates unidirectional forward edges (in [A B C], A->B, B->C, C->A). */
    uni?: boolean;
    /** If `true`, does not connect the edges of the array. */
    noWrap?: boolean;
}
declare function rangeTo(a: number, b: number): Generator<number, void, unknown> & {
    /** Checks if this `Range` contains the given value. */
    has: (x: number) => boolean;
    /** Checks if this `Range` contains the given value. */
    fnfilter: (x: number) => boolean;
    /**
     * Performs binary search to find a number `n` in this range. The function
     * `f` is expected to:
     *
     * - Return `0` if the value of `n` matches
     * - Return `1` if the value of `n` is definitely too high
     * - Return `-1` if the value of `n` is too low, or might be fine
     *
     * If `f` exclusively returns `-1` and `1`, `.search(f)` will return the
     * value `n` such that `f(n) == -1 && f(n+1) == 1`.
     *
     * On empty or invalid ranges, returns the lower bound.
     */
    search(f: (n: number) => -1 | 0 | 1): number;
};
type Range = ReturnType<typeof rangeTo>;
type Ring<T> = [value: T, dir: Point, l: Ring<T>, r: Ring<T>];
declare class Point<T = unknown> {
    readonly x: number;
    readonly y: number;
    readonly z: number | undefined;
    readonly g: Grid<T> | undefined;
    static ring<T>(val: (dir: Point) => T): Ring<T>[];
    constructor(x: number, y: number, z: number | undefined, g: Grid<T> | undefined);
    get gg(): Grid<T>;
    in<T>(grid: Grid<T>): Point<T>;
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
    get tl(): Point<T>;
    get rt(): Point<T>;
    get tr(): Point<T>;
    get lb(): Point<T>;
    get bl(): Point<T>;
    get rb(): Point<T>;
    get br(): Point<T>;
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
    get vnn(): NonNullable<T>;
    set v(v: T);
    set vnn(v: T);
    xy(): string;
    ij(): string;
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
type Falsy = false | "" | 0 | 0n | null | undefined;
declare class Grid<T> {
    rows: T[][];
    static of<T>(f: Exclude<T, Function> | ((k: Point<T>) => T), rows?: number, cols?: number): Grid<T>;
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
    atnn(pt: Point): NonNullable<T>;
    get tl(): Point<T>;
    get lt(): Point<T>;
    get tr(): Point<T>;
    get rt(): Point<T>;
    get bl(): Point<T>;
    get lb(): Point<T>;
    get br(): Point<T>;
    get rb(): Point<T>;
    set(pt: Point, value: T): T;
    k(): IteratorObject<Point<T>, undefined>;
    [Symbol.iterator](): IteratorObject<Point<T>, undefined, unknown>;
    flat(): T[];
    map<U>(f: (value: T, index: Point<T>, grid: Grid<T>) => U): Grid<U>;
    linkn(this: Grid<GraphNode<unknown> | Falsy>, weight?: number): Grid<T>;
    c(this: Grid<T & FnCopy>): Grid<T>;
    copyFrom(other: Grid<T>): void;
    draw(this: Grid<string>): void;
}
declare class Graph<T> {
    readonly v: GraphNode<T>[];
    constructor(v?: GraphNode<T>[]);
    /**
     * Clones the graph, its nodes, and its edges, but does not clone the node
     * values.
     */
    sc(this: Graph<T>, clone?: (v: T) => T): Graph<T>;
    /** Same as `.sc()`, but reverses all edges. */
    screv(this: Graph<T>, clone?: (v: T) => T): Graph<T>;
    k(): ArrayIterator<GraphNode<T>>;
    add(value: T): GraphNode<T>;
    djikstra(start: GraphNode<T> | GraphNode<T>[]): Map<GraphNode<T>, number>;
}
declare class GraphNode<T> {
    v: T;
    readonly g: Graph<T>;
    /** Outgoing links. */
    readonly o: GraphEdge<T>[];
    /** Incoming links. */
    readonly i: GraphEdge<T>[];
    constructor(v: T, g: Graph<T>);
    link(node: GraphNode<T>, weight?: number): GraphEdge<T>;
    remove(): void;
    log(): void;
}
declare class GraphEdge<T> {
    readonly a: GraphNode<T>;
    readonly b: GraphNode<T>;
    readonly w: number;
    constructor(a: GraphNode<T>, b: GraphNode<T>, w: number);
    unlink(): void;
}
declare class DLL<T> {
    readonly v: T;
    l: DLL<T>;
    r: DLL<T>;
    constructor(v: T);
    /** Inserts a new value to this node's right. */
    irv(value: T): DLL<T>;
    /** Removes this node. */
    rm(): void;
}
declare class FibHeap<T> {
    readonly lt: (a: T, b: T) => boolean;
    size: number;
    min: FibNode<T> | undefined;
    root: FibNode<T> | undefined;
    constructor(lt?: (a: T, b: T) => boolean);
    insert(value: T): FibNode<T>;
    insertRecursive(value: (node: FibNode<T>) => T): FibNode<T>;
    mergeWithRootList(node: FibNode<T>): void;
    union(other: FibHeap<T>): FibHeap<T>;
    extractMin(): FibNode<T> | undefined;
    removeFromRootList(node: FibNode<T>): void;
    consolidate(): void;
    heapLink(y: FibNode<T>, x: FibNode<T>): void;
    mergeWithChildList(parent: FibNode<T>, node: FibNode<T>): void;
    cut(x: FibNode<T>, y: FibNode<T>): void;
    cascadingCut(y: FibNode<T>): void;
    removeFromChildList(parent: FibNode<T>, node: FibNode<T>): void;
    log(): void;
}
declare class FibNode<T> {
    vr: T;
    readonly heap: FibHeap<T>;
    degree: number;
    mark: boolean;
    parent: FibNode<T> | undefined;
    child: FibNode<T> | undefined;
    l: FibNode<T>;
    r: FibNode<T>;
    constructor(vr: T, heap: FibHeap<T>);
    get v(): T;
    set v(k: T);
    siblings(): FibNode<T>[];
    log(): void;
}
declare var __Point: typeof Point;
type __Point<T> = Point<T>;
declare var __Grid: typeof Grid;
type __Grid<T> = Grid<T>;
declare var __Graph: typeof Graph;
type __Graph<T> = Graph<T>;
declare var __GraphNode: typeof GraphNode;
type __GraphNode<T> = GraphNode<T>;
declare var __GraphEdge: typeof GraphEdge;
type __GraphEdge<T> = GraphEdge<T>;
declare var __PointSet: typeof PointSet;
type __PointSet<T> = PointSet<T>;
declare var __DLL: typeof DLL;
type __DLL<T> = DLL<T>;
declare var __FibHeap: typeof FibHeap;
type __FibHeap<T> = FibHeap<T>;
declare var __FibNode: typeof FibNode;
type __FibNode<T> = FibNode<T>;
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
        /**
         * Returns an iterator over the bits of this number, least-significant bit
         * first.
         */
        bits(): Generator<boolean, never>;
        /** Shorthand for `!Number.isFinite(this)`. */
        nf(): boolean;
        /** Shorthand for `Number.isFinite(this)`. */
        f(): boolean;
    }
    interface BigInt {
        /** Checks this bigint against an expected value, throwing on error. */
        check(expected: bigint): bigint;
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
        /** Parses all lines as points in `x,y` notation. */
        lxy(): Point[];
        /** Parses all lines as points in `i,j` notation. */
        lij(): Point[];
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
        /** Parses this string as a point in `x,y` notation. */
        xy(): Point;
        /** Parses this string as a point in `i,j` notation. */
        ij(): Point;
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
        /** Shorthand for `.slice(0, n)`. */
        take(n: number): T[];
        /** Combines the bits in this array, least-significant first, into a number. */
        bits(this: boolean[]): number;
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
        /** Finds the first element which matches the filter `f`. */
        fx(f: FnFilter<T>): T | X;
        /** Finds the first element which matches the filter `f`, and asserts it is non-null. */
        fxnn(f: FnFilter<T>): NonNullable<T>;
        /** Finds the index of the first element which matches the filter `f`. */
        fi(f: FnFilter<T>): number;
        /** Finds the index of the first element which matches the filter `f`, and asserts it is not `-1`. */
        finn(f: FnFilter<T>): number;
        /** Returns elements which match the filter `f`. */
        f(f: FnFilter<T>): T[];
        /**
         * Returns elements which match the filter `f`, but preserves indices by
         * creating a sparse array.
         */
        fp(f: FnFilter<T>): T[];
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
        /** Returns the last index of this array. */
        get li(): number | X;
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
        /** Returns all pairs in this array, wrapping to include the last element followed by the first element. */
        wc(n: 2): [T, T][];
        /** Returns all triplets in this array, wrapping such that an array [A B C D] will return [A B C] [B C D] [C D A] [D A B]. */
        wc(n: 3): [T, T, T][];
        /** Returns all windows of `n` values in this array, including wrapping around. */
        wc(n: number): T[][];
        /** Takes the signed difference between each pair of numbers. */
        sd(this: FnSd[]): T[];
        /** Takes the unsigned difference between each pair of numbers. */
        ud(this: FnUd[]): T[];
        /** Returns the middle element. */
        mid(): T | X;
        /** Equivalent to `.map(x => x[key])`. */
        key<K extends keyof T>(key: K): T[K][];
        /** Equivalent to `.map(x => x.map(y => y[key]))`. */
        mk<T extends readonly any[], K extends keyof T[number]>(this: readonly T[], key: K): {
            [L in keyof T]: T[L][K];
        }[];
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
        xy(this: [x: number, y: number][]): Point[];
        /**
         * If this is an array of `[i][j]` tuples, returns an iterator over points
         * representing those pairs.
         */
        ij(this: [i: number, j: number][]): Point[];
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
        /** Finds the minimum value. */
        min(this: readonly number[]): number;
        /** Finds the maximum value. */
        max(this: readonly number[]): number;
        /** Finds the minimum value. */
        bigmin(this: readonly bigint[]): bigint;
        /** Finds the maximum value. */
        bigmax(this: readonly bigint[]): bigint;
        /** Returns the indices of each element and their values. */
        enum(): [index: number, value: T][];
        /** Links all nodes in this array together. */
        link(this: readonly GraphNode<unknown>[], props?: LinkProps): this;
        /** Links the first elements of each element of this array together. */
        linkr(this: readonly (readonly [GraphNode<unknown>, ...unknown[]])[], props?: LinkProps): this;
        /** Zips the elements of this array with `other`, returning an array containing tuples containing one element from each array. The new array's length is that of the shorter of either array. */
        zip<A extends readonly any[][]>(...others: A): [T, ...{
            [K in keyof A]: A[K][number];
        }][];
    }
    interface ReadonlyArray<T> extends ArrayBase<T> {
    }
    interface Array<T> extends ArrayBase<T> {
        /** Sets the last element of this array. */
        set last(v: T);
        /** Sorts this array numerically. */
        s(this: number[]): number[];
        /** Adds an element if it does not exist already. */
        add(el: T): T;
        /** Removes the first instance of an element from an array. */
        remove(el: T): T;
        /** Clears the array. */
        clear(): void;
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
        /** Finds the first element which matches `f`. */
        fx(f: FnFilter<T>): T | X;
        /** Finds the first element which matches `f`, and asserts it is non-null. */
        fxnn(f: FnFilter<T>): NonNullable<T>;
        /** Finds the index of the first element which matches the filter `f`. */
        fi(f: FnFilter<T>): number;
        /** Finds the index of the first element which matches the filter `f`, and asserts it is not `-1`. */
        finn(f: FnFilter<T>): number;
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
        /** Logs this value and returns it. */
        log<T>(this: T, ...args: any[]): T;
    }
    interface MapBase<K, V> {
        /** Equivalent to `.get(key)`, hardcoding the assumption that `key` exists. */
        gn(key: K): V;
        /** Equivalent to `nn(this.get(key))`. */
        gnn(key: K): NonNullable<V>;
    }
    interface ReadonlyMap<K, V> extends MapBase<K, V> {
    }
    interface Map<K, V> extends MapBase<K, V> {
    }
    interface Boolean {
        /** Returns `this`. */
        c(): boolean;
        /**
         * Returns `-1` if `true`. Otherwise, `1`. Useful for custom sorting
         * functions, as in `.sort((a, b) => (a < b).s())`.
         */
        s(): -1 | 1;
        /**
         * Returns `1` if `true`. Otherwise, `-1`. Useful for custom sorting
         * functions, as in `.sort((a, b) => (a > b).s())`.
         */
        z(): -1 | 1;
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
    var Grid: typeof __Grid;
    /** A grid. */
    type Grid<T> = __Grid<T>;
    /** A directed graph. */
    var Graph: typeof __Graph;
    /** A directed graph. */
    type Graph<T> = __Graph<T>;
    /** A node in a directed graph. */
    var GraphNode: typeof __GraphNode;
    /** A node in a directed graph. */
    type GraphNode<T> = __GraphNode<T>;
    /** An edge in a directed graph. */
    var GraphEdge: typeof __GraphEdge;
    /** An edge in a directed graph. */
    type GraphEdge<T> = __GraphEdge<T>;
    /** A node in a circular doubly-linked list. */
    var DLL: typeof __DLL;
    /** A node in a circular doubly-linked list. */
    type DLL<T> = __DLL<T>;
    /** A Fibonacci heap. */
    var FibHeap: typeof __FibHeap;
    /** A Fibonacci heap. */
    type FibHeap<T> = __FibHeap<T>;
    /** A node in a Fibonacci heap. */
    var FibNode: typeof __FibNode;
    /** A node in a Fibonacci heap. */
    type FibNode<T> = __FibNode<T>;
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
