'use strict'
const fs = require('fs')
const path = require('path')
const http = require('http')

/*    way/
 * load existing data and start the server
 */
function startServer(port, dbfolder, cb) {
  loadExisting(dbfolder, (err, data) => {
    if(err) cb(err)
    else serve(port, data, cb)
  })
}

/*    way/
 * start a http server on the port serving and updating
 * the given data
 */
function serve(port, data, cb) {
  const server = http.createServer((req, res) => {
    if(req.url.startsWith("/put/")) return put(req, res)
    if(req.url.startsWith("/get/")) return get(req, res)
    res.writeHead(404)
    res.end()
  })
  server.listen(port, "127.0.0.1", cb)
}

/*    way/
 * walk all the files (ignoring hidden files) and load each one -
 * ignoring parse errors (just logging them out)
 */
function loadExisting(dbfolder, cb) {
  let DB = {}
  fs.readdir(dbfolder, (err, files) => {
    if(err) cb(err)
    else {
      load_ndx_1(files, 0)
    }
  })

  function load_ndx_1(files, ndx) {
    if(ndx >= files.length) return cb()
    let curr = files[ndx]
    if(isHidden(curr)) return load_ndx_1(files, ndx+1)
    fs.readFile(path.join(dbloc, curr), (err, data) => {
      let recs = []
      if(err) cb(err)
      else {
        let s = 0
        for(let i = 0;i < data.length;i++) {
          if(data[i] == '\n') {
            add_rec_1(s, i)
          }
        }
        add_rec_1(s, data.length)
        DB[curr] = recs
      }

      function add_rec_1(s, e) {
        let line = data.subarray(s, e)
        try {
          recs.push(JSON.parse(line))
        } catch(e) {
          console.error(e)
        }
      }
    })
  }
}

/*    understand/
 * We treat 'dot' files as hidden
 */
function isHidden(fname) { !fname || fname[0] == "." }

module.exports = {
  startServer,
}
