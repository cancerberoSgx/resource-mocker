API and CLI sto mock a static resources like .js, .css, .html files in a local server. It creates a real http local server that serves provided resources. 

# Usage

```sh
npm install --save-dev  
```

```js

import { ServerMocker } from 'resource-mocker'
import { get } from 'hyperquest-promise'

const resources = [
  { name: '/file1.js', content: 'window.file1 = "file1"', responseTime: 100 },
  {
    name: '/file1.html', content: `
<html>
<head><title>hello world1</title></head>
<body><script src="file1.js"></script></body>
</html>`, responseTime: 100
  },
]
const mocker = new ServerMocker({ port: 3000, resources })
mocker.start()

let { data } = await get('http://localhost:3000/file1.html')
expect(data).toContain('<title>hello world1</title>')
// console.log(data);
mocker.shutdown()
try {
  data = (await get('http://localhost:3000/file1.html')).data
  fail('should throw on server closed')
} catch (ex) {
  // OK: should throw 
}
```

# TODO

 * read config from .json file
 * CLI (so I can entre `resource-mocker --config test-assets/resources1.json` --port 3000)
 * suggestion: build .json of resources in folder (using my program fs-to-json)



<!-- 
<!-- ### Backup -->
<!-- move to other file : -->
<!-- Language (basic) --> -->
<!-- 
 <!-- * code is evaluated from "top to bottom" and ingeneral from right to left -->
 <!-- * variables (they are name for values) -->
 <!-- * assignments: let a = 1 -->
 <!-- * statements (console.log(3.14)) --> -->
<!--  -->
<!-- 
<!-- Data (basic) --> -->
<!-- 
 <!-- * explain -->
<!-- Behavior (basic) --> -->
<!-- 
<!-- Data + behavior (basic) --> -->
<!-- 
 <!-- * array filter, find, map -->
 <!-- * basic object manipulation (propert) -->
 <!-- * string substring, concatenation --> -->
<!--  -->
<!--  -->
