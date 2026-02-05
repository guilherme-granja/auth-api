export class ResetPasswordDTO {
    readonly token: string;
    readonly password: string;

    constructor(data: { token: string; password: string }) {
        this.token = data.token;
        this.password = data.password;
    }

    static fromRequest(body: { token: string; password: string }): ResetPasswordDTO {
        return new ResetPasswordDTO({
            token: body.token,
            password: body.password,
        });
    }
}