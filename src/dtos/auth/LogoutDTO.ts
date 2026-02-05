export class LogoutDTO {
    readonly refreshToken: string;

    constructor(data: { refreshToken: string }) {
        this.refreshToken = data.refreshToken;
    }

    static fromRequest(body: { refreshToken: string }): LogoutDTO {
        return new LogoutDTO({
            refreshToken: body.refreshToken,
        });
    }
}