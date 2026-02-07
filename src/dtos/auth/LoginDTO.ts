export class LoginDTO {
  email: string;
  password: string;

  constructor(data: { email: string; password: string }) {
    this.email = data.email;
    this.password = data.password;
  }

  static fromRequest(data: { email: string; password: string }): LoginDTO {
    return new LoginDTO({
      email: data.email,
      password: data.password,
    });
  }
}
