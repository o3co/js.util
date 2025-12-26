```js
const storage = StorageHelper.createAdapter({"protocols": ["s3", "local"]})

const uri = storageHelper.createUri("file://xxxxxxxx") // or "./xxxxxxx" or "s3://xxxxxxxxxxx"

await storage.save(uri, data)

await storage.loadAsString(uri)

```
