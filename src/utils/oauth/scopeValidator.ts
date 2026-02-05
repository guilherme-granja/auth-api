export class ScopeValidatorUtils {
    private static readonly AVAILABLE_SCOPES = [
        'read',
        'write',
        'profile',
        'email',
        'offline_access',
    ];

    static validate(requested: string[]): string[] {
        return requested.filter(scope =>
            this.AVAILABLE_SCOPES.includes(scope)
        );
    }

    static isValid(scope: string): boolean {
        return this.AVAILABLE_SCOPES.includes(scope);
    }

    static parse(scopeString: string): string[] {
        if (!scopeString) return [];
        return scopeString.split(' ').filter(Boolean);
    }

    static toString(scopes: string[]): string {
        return scopes.join(' ');
    }

    static hasScope(tokenScopes: string[], requiredScope: string): boolean {
        return tokenScopes.includes(requiredScope);
    }

    static hasAllScopes(tokenScopes: string[], requiredScopes: string[]): boolean {
        return requiredScopes.every(scope => tokenScopes.includes(scope));
    }
}