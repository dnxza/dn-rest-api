// index.ts

import fastify from 'fastify'
import { env } from 'process'

const pino = require('pino')

const log = pino({
  prettyPrint: { colorize: true, translateTime: 'SYS:standard' }
})

var opt = { logger: false }

if (env.NODE_ENV === 'development')
    opt.logger = log   

const server = fastify(opt)

const port = env.PORT || 3000 as number
const host = env.HOST || '127.0.0.1' as string

server.register(require('./routes'), {})

server.setNotFoundHandler(function (request, reply) {
    reply.status(404).send({ success: false, msg: 'not found' })
})

server.listen(port, host, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
})
