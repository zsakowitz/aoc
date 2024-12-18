import "../util.js"

const i = input(2024, 18) // get 2024-18 input
  .lxy() // parse as newline-separated list of `x,y`-notation points

function go(/** @type {number} */ limit) {
  const g = Grid.of(true, 71) // create 71x71 grid where all values are `true`
  i.take(limit) // take first `limit` points
    .map((x) => g.set(x, false)) // set each point's value in `g` to `false`

  const gr = new Graph() // create a new graph (node & edge collection)
  const go = g // `go` will be a new grid
    .map((x) => (x ? gr.add(0) : null)) // add and return a node to `gr` if the original cell in `g` was true; otherwise `null`
    .linkn() // link neighbors (by grid coordinates) in the graph `gr`

  return gr
    .djikstra(go.tl.vnn) // run djikstra's algorithm starting from the `.TopLeft` node (which is .NotNull)
    .gn(go.br.vnn) // get the Nonnull value at `go`'s .BottomRight.NonNull node
}

go(1024).check(372) // check the result (372 is my hardcoded value)

const idx = rx(i.length) // exclusive range from 0 up to number of input points
  .search(
    // start binary search on that range
    (n) =>
      go(n) // run `go()` with the given number of steps
        .f() // is the result is finite? (it will be infinite if the endpoint is unreachable)
        .s(), // .s() returns -1 if true, otherwise 1 (to create a proper order for binary search)
  )

i[idx] // `idx` is the correct index; get the actual item
  .xy() // parse as `x,y` point
  .check("25,6", "YESIMSURE") // check; answers are typically numbers so YESIMSURE is required; otherwise a warning is generated
