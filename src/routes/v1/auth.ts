// routes/v1/auth.ts

import { FastifyInstance, RegisterOptions } from 'fastify'
import { userReq, userLogin } from '../../schemas/user'
import bcrypt from 'bcrypt'

export default function (fastify: FastifyInstance, options: RegisterOptions, done: Function) {

    const userDB = fastify.mongo.db?.collection('users')

    fastify.post('/reg', { schema: { body: userReq } }, async (req, reply) => {
        try {
            const body: any = req.body
            body.password = bcrypt.hashSync(body.password, 10)
            const result = await userDB?.insertOne(body)
            if (result) reply.status(200).send({ token: fastify.jwt.sign({ "username": Object(body).username }) })

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
