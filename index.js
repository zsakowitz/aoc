// @ts-nocheck

import { readFileSync, writeFileSync } from "node:fs"
import { Worker, isMainThread, parentPort } from "node:worker_threads"
import "./load.js"
import "./util.js"

if (isMainThread) {
  const queued = Object.entries(JSON.parse(readFileSync("times.json", "utf8")))
    .sort(([, a], [, b]) => b - a)
    .map((x) => x[0])

  const times = Object.create(null)

  for (let i = 0; i < 4; i++) {
    let current = ""
    const worker = new Worker(new URL(import.meta.url))
    worker.addListener("message", enqueue)
    enqueue()

    function enqueue(data) {
      if (data == "err") {
        process.exitCode = 1
        return
      }
      times[current] = data
      if (queued.length === 0) {
        worker.postMessage("DONE")
      } else {
        const id = queued.pop()
        current = id
        worker.postMessage(id)
      }
    }
  }

  process.addListener("beforeExit", () => {
    writeFileSync(
      "times.json",
      JSON.stringify(
        Object.fromEntries(
          Object.entries(times).sort(([a], [b]) => (a < b).s()),
        ),
        undefined,
        2,
      ),
    )
  })
} else {
  parentPort.onmessage = async (data) => {
    if (data.data == "DONE") process.exit()
    const start = Date.now()
    try {
      await import(data.data)
    } catch (e) {
      console.error((e.stack || e.message).split("\n").slice(0, 5).join("\n"))
      process.exitCode = 1
      parentPort.postMessage("err")
    }
    parentPort.postMessage(Date.now() - start)
  }
}
