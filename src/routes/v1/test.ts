// routes/v1/test.ts

import { FastifyInstance, RegisterOptions } from 'fastify'

export default function (fastify: FastifyInstance, options: RegisterOptions, done: Function) {

    fastify.get('/ping', async (request, reply) => {
        reply.status(200).send({ success: true, msg: 'pong' })
    })

    done()
}
