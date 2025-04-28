export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  iat: number;
}
export interface JwtValidateReturn {
  id: string;
  email: string;
  username: string;
}
