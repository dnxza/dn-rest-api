// error.ts

import { FastifyInstance } from 'fastify'

export default function (fastify: FastifyInstance & PromiseLike<FastifyInstance>) {

    fastify.setNotFoundHandler(function (request, reply) {
        reply.status(404).send({ status: 'error', message: 'not found', data: [] })
    })

    fastify.addHook('onError', (request, reply, error: any, done) => {
        if (error.code === 11000) {
            reply.status(400)
            error.message = "This " + Object.keys(error.keyPattern)[0] + " '" + error.keyValue.email + "' has already been used."
        }
        done()
    })

    return fastify
}
