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
  /**  */
  resources: File[]
}

export interface Request {
  url?: string
  method?: string
}


/**
 * Utility to serve mocked resources (.js, .css, .html files). See README.
 */
export class ServerMocker {
  constructor(protected config: ServerConfig) {
  }

  protected server: http.Server | undefined

  public createServer() {
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
      }).listen(this.config.port)
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

  protected _mime: { [k: string]: string } = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'text/json',
    '.html': 'text/html'
  }

  public get mime(): { [k: string]: string } {
    return this._mime
  }
  public addMime(extension: string, mime: string) {
    this._mime[extension] = mime
  }

  getResource(request: Request): File | undefined {
    const file = this.config.resources.find(f => f.name === request.url)
    if (!file) {
      return
    }
    file.contentType = this.getMime(file)
    return file
  }

}
