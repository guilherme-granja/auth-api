export class RegisterDTO {
    email: string
    password: string

    constructor(data: { email: string, password: string }) {
        this.email = data.email;
        this.password = data.password;
    }

    static fromRequest(data: { email: string; password: string }): RegisterDTO {
        return new RegisterDTO({
            email: data.email,
            password: data.password
        });
    }

    getNormalizedEmail(): string {
        return this.email.toLowerCase().trim();
    }
}