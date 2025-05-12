/**
 * @type Represents a payload to be signed and assigned a JWT
 * and also intercepted by other middlewares
 *
 */
export type JwtPayload = {
  sub: string;
  email: string;
  username: string;
  roles: number[];
  iat: number;
};
/**Return type for refresh token strategy, with a refresh token attached */
export type JwtPayloadWithTokens = {
  payload: JwtPayload;
  accessToken: string | undefined;
  refreshToken: string | undefined;
};
/**Return type for signToken*/
export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};
export type PassportValidatedPayload = {
  user: JwtPayload;
};
