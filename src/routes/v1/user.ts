// routes/v1/user.ts

import { FastifyInstance, RegisterOptions } from 'fastify'

export default function(fastify: FastifyInstance, options: RegisterOptions, done: Function) {

    fastify.addHook('onRequest', (request) => request.jwtVerify())

    fastify.get('/users', async (request, reply) => {
        reply.status(200).send({ success: true, msg: 'pong' })
    })

    done()
}
