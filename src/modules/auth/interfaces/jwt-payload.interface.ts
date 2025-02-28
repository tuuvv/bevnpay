export interface JwtPayload {
  username: string;
  sub: string;  // sub thường là user ID trong JWT
}
