[util.ts](util.ts) is the utility library. It is built into [util.js](util.js), and has type declarations available in [util.d.ts](util.d.ts).

[index.js](index.js) runs each file in parallel. The list of files it runs are in [times.json](times.json), which also includes the last time in milliseconds it took to run the test cases.

**Do not use an individual day's test case as a standard for comparison unless
it is in the `times.json` file.**

The `.check()` function from `util.ts` ensures a result is correct. The answers
are hardcoded to my inputs, and will likely fail on your inputs, as inputs may
be different for each person.

My inputs are not saved here. Run [load.js](load.js) with the `ILOWI_AOC_COOKIE`
environment variable set to `session=...` (your `Cookie` header as sent to your
browser) to download all inputs. Inputs are downloaded asynchronously on
Node.JS, synchronously in the browser, and are cached in both.
