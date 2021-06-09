// index.ts

import fastify from 'fastify'
import { env } from 'process'

var opt = { logger: false };

if (env.NODE_ENV === 'development')
    opt.logger = true;

const server = fastify(opt)

const port = env.PORT || 3000 as number;
const host = env.HOST || '127.0.0.1' as string;

server.register(require('./routes/v1/test'), { prefix: '/v1' })

server.setNotFoundHandler({
    preValidation: (req, reply, done) => {
        done()
    },
    preHandler: (req, reply, done) => {
        done()
    }
}, function (request, reply) {
    reply.status(404).send({ success: false, msg: 'not found' })
})

server.listen(port, host, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})
