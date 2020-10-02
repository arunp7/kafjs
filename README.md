# KafJS

An embedded event store for Javascript heavily inspired by [Kaf](https://github.com/theproductiveprogrammer/kaf).

## QuickStart

1. Install **KafJS**: `npm i @tpp/kafjs`

2. Start the embedded server: 

   ```js
   const kaf = require("@tpp/kafjs")
   kaf.startServer(PORT, DBFOLDER)
   ```

3. POST messages to your logfile (auto-created):

   ```sh
   $> curl localhost:7749/put/mylog -d '{"data":"Put JSON Record"}'
   ```

4. GET messages from your log file:

   ```sh
   $> curl localhost:7749/get/mylog?from=1
   ```

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

