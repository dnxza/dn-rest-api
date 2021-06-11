// routes/index.ts

import { FastifyInstance, RegisterOptions } from 'fastify'

export default function(app: FastifyInstance, options: RegisterOptions, done: Function) {

    app.register(require('./v1/test'), { prefix: '/v1' })

    done()
}
