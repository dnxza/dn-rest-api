// routes/v1/test.ts

import { FastifyInstance, RegisterOptions } from 'fastify'

export default function(app: FastifyInstance, options: RegisterOptions, done: Function) {

    app.get('/ping', async (request, reply) => {
        reply.status(200).send({ success: true, msg: 'pong' })
    })

    done()
}
