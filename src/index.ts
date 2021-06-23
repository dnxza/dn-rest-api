// index.ts

import f from 'fastify'
import jwt from 'fastify-jwt'
import mongo from 'fastify-mongodb'
import pino from 'pino';
import { env } from 'process'
import { config } from './config'
import error from './error'

const log = pino({
    prettyPrint: { colorize: true, translateTime: 'SYS:standard', singleLine: true }
})

var opt = {}
if (env.NODE_ENV === 'development')
    opt = { logger: log }

const fastify = error(f(opt))

const host = config.app.host
const port = config.app.port
const db = config.db.url
const jwt_key = config.jwt.key

fastify.register(mongo, {
    forceClose: true,
    url: db
})

fastify.register(jwt, {
    secret: jwt_key,
    decode: { complete: true },
    sign: {
        algorithm: 'HS256',
        issuer: host,
        expiresIn: "7d"
    },
    verify: { issuer: host }
})

fastify.register(require('./routes'), {})

fastify.listen(port, host, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
})
