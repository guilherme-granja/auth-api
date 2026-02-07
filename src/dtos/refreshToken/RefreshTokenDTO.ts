export class RefreshTokenDTO {
  readonly refreshToken: string;
  readonly accessToken: string | null;

  constructor(data: { refreshToken: string; accessToken: string | null }) {
    this.refreshToken = data.refreshToken;
    this.accessToken = data.accessToken;
  }

  static fromRequest(body: { refreshToken: string; accessToken: string | null }): RefreshTokenDTO {
    return new RefreshTokenDTO({
      refreshToken: body.refreshToken,
      accessToken: body.accessToken,
    });
  }
}
