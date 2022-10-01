
let wpb = require('webpack');
let path = require('path')

/**@type {import('webpack/types').Configuration} */
module.exports = {
    "entry": {
        // "queue": path.resolve(__dirname, "dist/tsc/queue.js"),
        "test": path.resolve(__dirname, "dist/tsc/test.js"),
        "worker": path.resolve(__dirname, "dist/tsc/worker.js")
        // "worker": path.resolve(__dirname, "dist/tsc/worker.js"),
        // "workerprotocal": path.resolve(__dirname, "dist/tsc/workerprotocal.js")
    },
    "output": {
        "filename": "[name].bundle.js",
        "path": path.resolve(__dirname, "dist/bundle")
    },
    "mode" : "production"
}