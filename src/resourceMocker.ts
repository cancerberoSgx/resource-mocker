// TODO:   move serviceMocker and its test to a separate project

import http, { Server } from 'http'

export interface File {
  name: string
  content: string
  contentType?: string
  responseTime?: number
  statusCode?: number,
  /** force a custom conten type response */
  mime?: string
}

export interface ServerConfig {
  port: number
}

/**
 * utility to serve mocked resources (.js, .css, .html files). Usage
 * 
```
const serverResources = [
  { name: '/file1.js', content: 'window.file1 = "file1"', responseTime: 100 },
  {
    name: '/file1.html', content: `
<html>
<head><title>hello world1</title></head>
<body><script src="file1.js"></script><script>debugger;</script></body>
</html>`
  },
]
const mocker = new ServerMocker(serverResources)
mocker.createServer({
  port: 3000
})
```

 */
export class ServerMocker {
  constructor(protected resources: File[]) {
  }

  protected server: http.Server | undefined

  public createServer(config: ServerConfig) {
    // console.log('starting server')
    this.server = http.createServer(
      (request, response) => {
        const file = this.getResource({ url: request.url, method: request.method })
        if (!file || !file.contentType) {
          response.writeHead(404, { "Content-Type": "text/html" })
          response.end('')
        }
        else {
          response.writeHead(200, { "Content-Type": file.contentType })
          response.end(file.content)
        }
      }).listen(config.port)
    // console.log(`Server listening at http://localhost:${config.port}`);
    // return server
  }
  closeServer() {
    if (this.server) {
      this.server.close()
    }
  }

  protected getMime(f: File | undefined): string | undefined {
    if (!f) { return }
    return Object.keys(this.mime).find(extension => f.name.endsWith(extension))
  }

  protected mime = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'text/json',
    '.html': 'text/html'
  }

  getResource(request: Request): File | undefined {
    const file = this.resources.find(f => f.name === request.url)
    if (!file) {
      return
    }
    file.contentType = this.getMime(file)
    return file
  }

}

export interface Request {
  url?: string
  method?: string
}
