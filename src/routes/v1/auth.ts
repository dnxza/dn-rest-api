// routes/v1/auth.ts

import { FastifyInstance, RegisterOptions } from 'fastify'
import { userReq, userLogin } from '../../schemas/user'
import bcrypt from 'bcrypt'
import oauth2 from 'fastify-oauth2'
import https from '../../utils/cilent'
import { config } from '../../config'

export default function (fastify: FastifyInstance, options: RegisterOptions, done: Function) {

    const userDB = fastify.mongo.db?.collection('users')

    fastify.register(oauth2, {
        name: 'googleOAuth2',
        scope: ['profile', 'profile email'],
        credentials: {
            client: config.oauth2.google,
            auth: oauth2.GOOGLE_CONFIGURATION
        },
        startRedirectPath: '/auth/google',
        callbackUri: 'http://' + config.app.host + ':' + config.app.port + fastify.prefix + '/auth/google/callback'
    })

    fastify.get('/auth/google/callback', async function (request, reply) {

        let token = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
        if (token) {
            await https({
                host: 'www.googleapis.com',
                port: 443,
                path: '/oauth2/v2/userinfo',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token.access_token,
                    'Accept': 'application/json'
                }
            }).then(async (data) => {
                const gUser: any = data
                const user = await userDB?.findOne({ 'email': gUser.email })

                if (user === null) {
                    const nUser: any = {}
                    nUser.email = gUser.email
                    nUser.username = gUser.email
                    nUser.password = bcrypt.hashSync(Math.random().toString(36).substring(10, 25), 10)
                    nUser.name = gUser.name
                    nUser.oauth2 = { 'google': gUser }

                    const result = await userDB?.insertOne(nUser)
                    if (result) reply.status(200).send({ token: fastify.jwt.sign({ "username": nUser.username }) })
                    else throw new Error("Error !!!")
                    return
                }

                reply.status(200).send({ token: fastify.jwt.sign({ "username": user.username }) })

            }).catch((e) => {
                reply.status(401).send(e);
            })
        } else {
            reply.status(401).send({});
        }

    })

    fastify.post('/reg', { schema: { body: userReq } }, async (req, reply) => {
        try {
            const body: any = req.body
            body.password = bcrypt.hashSync(body.password, 10)
            const user = await userDB?.insertOne(body)
            if (user) reply.status(200).send({ token: fastify.jwt.sign({ "username": Object(body).username }) })

        } catch (err) {
            throw err
        }
    })

    fastify.post('/auth', { schema: { body: userLogin } }, async (req, reply) => {

        try {
            const body: any = req.body
            const result = await userDB?.findOne({
                $or: [
                    { 'email': body.username },
                    { 'username': body.username }
                ]
            })

            if (result && bcrypt.compareSync(body.password, result.password)) {
                const token = fastify.jwt.sign({ username: result.username })
                reply.status(200).send({ token })
            } else {
                reply.status(400).send({ message: "username or password is incorrect." })
            }

        } catch (err) {
            throw err
        }
    })

    done()
}
