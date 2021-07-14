'use strict'
const path = require('path')
const kaf = require('../kaf.js')

const port = 7749
const dbfolder = path.join(__dirname, "logs")

function main() {
  kaf.startServer({
    port,
    dbfolder,
    ignore_errors: false
  }, err => {
    if(err) console.error(err)
    else msg()
  })
}

function msg() {
  console.log(`
Serving from: ${dbfolder}
Started on port: ${port}

Use:
  $> curl localhost:${port}/put/mylog -d '{"data":"Put JSON Record"}'
  (to add logs)
and
  $> curl localhost:${port}/get/mylog?from=1
  (to get logs)
`)
}

main()
