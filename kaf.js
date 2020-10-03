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
    else serve(port, { dbfolder, data }, cb)
  })
}

/*    way/
 * start a http server on the port serving and updating
 * the given data
 */
function serve(port, db, cb) {
  const server = http.createServer((req, res) => {
    let u = req.url
    if(u.startsWith("/put/")) return put(req, res, db)
    if(u.startsWith("/get/")) return get(req, res, db)
    res.writeHead(404)
    res.end()
  })
  server.listen(port, "127.0.0.1", cb)
}

/*    way/
 * get the logfile and the JSON object to put and append
 * it to the log file
 */
function put(req, res, db) {
  let logfile = req.url.substring("/put/".length)
  let body = []
  req.on("data", chunk => body.push(chunk))
  req.on("end", () => {
    if(body.length == 0) return resp_1(400, "Nothing to do")
    body.push(Buffer.from("\n"))
    body = Buffer.concat(body)
    try {
      let rec = JSON.parse(body.subarray(0, body.length-1))
      let loc = db.dbfolder
      fs.appendFile(path.join(loc, logfile), body, err => {
        if(err) resp_1(500, err)
        else {
          if(db.data[logfile]) db.data[logfile].push(rec)
          else db.data[logfile] = [rec]
          resp_1(200)
        }
      })
    } catch(e) {
      resp_1(400, e)
    }
  })
  req.on("error", err => resp_1(500, err))

  let sent
  function resp_1(status, msg) {
    if(sent) return
    sent = true
    res.writeHead(status)
    if(msg && typeof msg !== 'string') msg = "" + msg
    res.end(msg)
  }
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

  const NL=10
  const CR=13
  const SP=32
  const TAB=9

  function load_ndx_1(files, ndx) {
    if(ndx >= files.length) return cb(null, DB)
    let curr = files[ndx]
    if(isHidden(curr)) return load_ndx_1(files, ndx+1)
    fs.readFile(path.join(dbfolder, curr), (err, data) => {
      let recs = []
      if(err) cb(err)
      else {
        let s = 0
        for(let i = 0;i < data.length;i++) {
          if(data[i] == NL || data[i] == CR) {
            add_rec_1(s, i)
            s = i
          }
        }
        add_rec_1(s, data.length)
        DB[curr] = recs
        load_ndx_1(files, ndx+1)
      }

      function add_rec_1(s, e) {
        while(data[s] == NL || data[s] == CR
          || data[s] == SP || data[s] == TAB) {
          if(s == e) return
          s++
        }
        if(s == e) return
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
