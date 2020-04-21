const Hapi = require('@hapi/hapi')
const fs = require('fs')

const handleFileUpload = file => {
  return new Promise((resolve, reject) => {
    const { filename } = file.hapi
    const outFile = fs.createWriteStream(`./uploads/${filename}`)
    file
      .pipe(outFile)
      .on('error', err => {
        console.error(err)
        reject(err)
      })
      .on('close', () => {
        console.log('done')
        resolve({
          message: 'uploaded'
        })
      })
  })
}
;(async () => {
  const server = Hapi.server({
    port: 3000
  })
  server.route({
    path: '/upload',
    method: 'POST',
    options: {
      payload: {
        maxBytes: 1024 * 1024 * 100, // max 100MB
        parse: true,
        output: 'stream',
        allow: 'multipart/form-data',
        multipart: true
      }
    },
    handler (request) {
      return handleFileUpload(request.payload.file)
    }
  })
  await server.start()
  console.log('start started at %s', server.info.uri)
})()
