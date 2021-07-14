# KafJS

An embedded event store for Javascript heavily inspired by [Kaf](https://github.com/theproductiveprogrammer/kaf).

## QuickStart

1. Install **KafJS**: `npm i kafjs`

2. Start the embedded server: 

   ```js
   const kaf = require("kafjs")
   kaf.startServer(PORT, DBFOLDER, err => {
     if(err.code === "EADDRINUSE") ...
   })
   ```

3. POST messages to your logfile (auto-created):

   ```sh
   $> curl localhost:7749/put/mylog -d '{"data":"Put JSON Record"}'
   ```

4. GET messages from your log file:

   ```sh
   $> curl localhost:7749/get/mylog?from=1
   ```

## Options

You can also start **KafJS** by passing in an option object instead:

```js
kaf.startServer({
  port: port,
  dbfolder: dbfolder,
  ignore_errors: false,
}, err => {
  if(err.code === "LOADFAILED") console.error(err.errors)
  ...
})
```

If you set `ignore_errors` parameter to `true`, **KafJS** will not fail when it encounters errors while reading the existing db logs. This mimics legacy behaviour where it would ignore parse errors and try it’s best to continue.

## Architecture

**KafJS** stores JSON data in [NDJSON](http://ndjson.org) formatted records and loads and sends them back. With every `GET` request it also sends the `X-KAFJS-LASTMSGSENT` header so users can request the next page of records.

## Errors

**KafJS** stores it’s own logs and errors in a log file called `_kafjs`. The message format is simple:

```json
[{"t":"2020-11-21T23:32:44.876Z","err":"error message", "stack":"optional"},
 {"t":"2020-11-21T23:32:44.876Z","log":"message"}
]
```

---

