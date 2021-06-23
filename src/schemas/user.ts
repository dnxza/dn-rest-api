// schemas/user.ts

export const userReq = {
    type: 'object',
    properties: {
        email: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' }
    },
    required: ['email', 'username', 'password'],
    additionalProperties: false
}

export const userLogin = {
    type: 'object',
    properties: {
        username: { type: 'string' },
        password: { type: 'string' }
    },
    required: ['username', 'password'],
    additionalProperties: false
}

export const userReply = {
    type: 'object',
    properties: {
        email: { type: 'string' },
        username: { type: 'string' }
    },
    additionalProperties: false
}