export class ForgotPasswordDTO {
    readonly email: string;

    constructor(data: { email: string }) {
        this.email = data.email;
    }

    static fromRequest(body: { email: string }): ForgotPasswordDTO {
        return new ForgotPasswordDTO({
            email: body.email,
        });
    }
}