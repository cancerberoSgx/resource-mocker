import { ServerMocker } from '../resourceMocker'
import { get } from 'hyperquest-promise'

describe('serverMocker works', () => {

  it('should serve html openable with puppeteer', async done => {

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
    mocker.shutdown()
    try {
      data = (await get('http://localhost:3000/file1.html')).data
      fail('should throw on server closed')
    } catch (ex) {
      // OK: should throw 
    }
    done()
  })


})



