// @types/mongo.d.ts

import * as fastify from 'fastify'
import * as mongodb from 'mongodb';

interface FastifyMongoObject {
  /**
   * Mongo client instance
   */
  client: mongodb.MongoClient;
  /**
   * DB instance
   */
  db?: mongodb.Db;
  /**
   * Mongo ObjectId class
   */
  ObjectId: typeof mongodb.ObjectId;
}

interface FastifyMongoNestedObject {
  [name: string]: FastifyMongoObject;
}

interface FastifyMongodbOptions {
  /**
   * Force to close the mongodb connection when app stopped
   * @default false
   */
  forceClose?: boolean;
  /**
   * Database name to connect
   */
  database?: string;
  name?: string;
  /**
   * Pre-configured instance of MongoClient
   */
  client?: mongodb.MongoClient;
  /**
   * Connection url
   */
  url?: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    mongo: FastifyMongoObject & FastifyMongoNestedObject;
  }
}

export const fastifyMongodb: fastify.FastifyPluginCallback<FastifyMongodbOptions>;

export default fastifyMongodb;
