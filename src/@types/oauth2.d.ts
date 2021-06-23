// node_modules/fastify-oauth2/index.d.ts

import * as fastify from 'fastify'

interface FastifyOAuth2 {
  APPLE_CONFIGURATION: ProviderConfiguration;
  DISCORD_CONFIGURATION: ProviderConfiguration;
  FACEBOOK_CONFIGURATION: ProviderConfiguration;
  GITHUB_CONFIGURATION: ProviderConfiguration;
  LINKEDIN_CONFIGURATION: ProviderConfiguration;
  GOOGLE_CONFIGURATION: ProviderConfiguration;
  MICROSOFT_CONFIGURATION: ProviderConfiguration;
  SPOTIFY_CONFIGURATION: ProviderConfiguration;
  VKONTAKTE_CONFIGURATION: ProviderConfiguration;
}

interface FastifyOAuth2Options {
  name: string;
  scope: string[];
  credentials: Credentials;
  callbackUri: string;
  callbackUriParams?: Object;
  generateStateFunction?: Function;
  checkStateFunction?: Function;
  startRedirectPath: string;
  tags?: string[];
  schema?: object;
}

export interface OAuth2Token {
  token_type: 'bearer';
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface ProviderConfiguration {
  authorizeHost: string;
  authorizePath: string;
  tokenHost: string;
  tokenPath: string;
}

export interface Credentials {
  client: {
    id: string;
    secret: string;
  };
  auth: ProviderConfiguration;
}

export interface OAuth2Namespace {
  getAccessTokenFromAuthorizationCodeFlow(
    request: fastify.FastifyRequest,
  ): Promise<OAuth2Token>;

  getAccessTokenFromAuthorizationCodeFlow(
    request: fastify.FastifyRequest,
    callback: (err: any, token: OAuth2Token) => void,
  ): void;

  getNewAccessTokenUsingRefreshToken(
    refreshToken: string,
    params: Object,
    callback: (err: any, token: OAuth2Token) => void,
  ): void;

  getNewAccessTokenUsingRefreshToken(refreshToken: string, params: Object): Promise<OAuth2Token>;

  generateAuthorizationUri(
    request: fastify.FastifyRequest,
  ): string;
}

export const fastifyOauth2: fastify.FastifyPluginCallback<FastifyOAuth2Options> & FastifyOAuth2;

export default fastifyOauth2;

declare module 'fastify' {
  interface FastifyInstance {
    oauth2: Credentials
    googleOAuth2: OAuth2Namespace;
  }
}