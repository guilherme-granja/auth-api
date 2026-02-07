export class RefreshTokenDTO {
  readonly refreshToken: string;

  constructor(data: { refreshToken: string }) {
    this.refreshToken = data.refreshToken;
  }

  static fromRequest(body: { refreshToken: string }): RefreshTokenDTO {
    return new RefreshTokenDTO({
      refreshToken: body.refreshToken,
    });
  }
}
