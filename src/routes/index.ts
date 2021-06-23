// routes/index.ts

import { FastifyInstance, RegisterOptions } from 'fastify'

export default function (fastify: FastifyInstance, options: RegisterOptions, done: Function) {

    fastify.addHook('onSend', async (request, reply, payload: string | Buffer) => {

        if (typeof payload === 'string' || payload instanceof String) {
            const data = JSON.parse(String(payload))
            let newData = JSON.parse("{}")
            if (reply.statusCode >= 200 && reply.statusCode < 300) {
                newData.status = "Success"
                newData.message = ""
                newData.data = data
            } else {
                newData.status = "error"
                if (data.message) {
                    newData.message = data.message
                    delete data.message;
                }
                newData = Object.assign(newData, data);
                newData.data = []
            }
            return JSON.stringify(newData)
        } else {
            return payload
        }
    })

    fastify.register(require('./v1/test'), { prefix: '/v1' })
    fastify.register(require('./v1/auth'), { prefix: '/v1' })
    fastify.register(require('./v1/user'), { prefix: '/v1' })

    done()
}
