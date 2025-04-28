/**Represents a payload to be signed and assigned a JWT */
export type JwtPayload = {
  sub: string;
  email: string;
  username: string;
  iat: number;
};
/**Return type for refresh token strategy, with a refresh token attached */
export type JwtPayloadWithRefreshToken = {
  payload: JwtPayload;
  refreshToken: string | undefined;
};
/**Return type for signToken*/
export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};
