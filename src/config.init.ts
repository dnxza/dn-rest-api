// config.ts

import { env } from 'process'

export const config = {
	app: {
		host: env.HOST || 'localhost',
		port: env.PORT || 3000 as number,
	},
	jwt: {
		key: env.JWT_KEY || '<JWT_KEY>'
	},
	db: {
		url: env.DB || 'mongodb://<USER>:<PASS>@localhost:27017/<DB>'
	},
	oauth2: {
		google: {
			id: '<CLIENT_ID>',
			secret: '<CLIENT_SECRET>'
		}
	}
};