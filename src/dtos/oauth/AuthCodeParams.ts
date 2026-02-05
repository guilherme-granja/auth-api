export interface AuthCodeParams {
    code: string;
    redirect_uri: string;
    code_verifier?: string;
}