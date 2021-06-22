// index.ts

import f, { FastifyInstance } from 'fastify'
import jwt from 'fastify-jwt'
import mongo from 'fastify-mongodb'
import pino from 'pino';
import { randomBytes } from 'crypto';
import { env } from 'process'
import { config } from './config';
import error from './error'

const log = pino({
    prettyPrint: { colorize: true, translateTime: 'SYS:standard', singleLine: true }
})

var opt = {}
if (env.NODE_ENV === 'development')
    opt = { logger: log }

const fastify = error(f(opt))

const host = env.HOST || config.app.host || '127.0.0.1' as string
const port = env.PORT || config.app.port || 3000 as number
const db = env.DB || config.db.url || 'mongodb://127.0.0.1:27017/api' as string
const jwt_key = env.JWT_KEY || config.jwt.key || randomBytes(256).toString() as string

fastify.register(mongo, {
    forceClose: true,
    url: db
})

fastify.register(jwt, {
    secret: jwt_key,
    decode: { complete: true },
    sign: {
        algorithm: 'HS256',
        issuer: 'api.dnratthee.me',
        expiresIn: "7d"
    },
    verify: { issuer: 'api.dnratthee.me' }
})

fastify.register(require('./routes'), {})

fastify.listen(port, host, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
})
