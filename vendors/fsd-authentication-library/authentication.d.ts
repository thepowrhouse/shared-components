interface IToken {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}
interface IInitConfig {
    hostURL: string;
    clientId: string;
    clientSecret: string;
    hashList?: IHashUser[];
}
interface IHashUser {
    operatorId: number;
    accessPassword: string;
    groupId: number;
}

interface IParsedToken {
    role: string;
    username: string;
    scope: string[];
    store: string;
    user_name: string;
    name: string;
    client_id: string;
    exp: number;
    iat: number;
    iss: string;
    issued_at: string;
    authToken: string;
}

declare class InvalidTokenError extends Error {
}

declare class FSDAuthentication {
    _clientId: string;
    _clientSecret: string;
    _hostURL: string;
    tokenPath: string;
    usersPath: string;
    _hashList: IHashUser[];
    constructor(config: IInitConfig, token?: string);
    clientId: string;
    clientSecret: string;
    hostURL: string;
    readonly userId: string;
    readonly name: string;
    readonly user_name: string;
    readonly role: string;
    readonly scope: string[];
    readonly expireTime: string;
    readonly expired: boolean;
    readonly parsedToken: IParsedToken;
    readonly access_token: string;
    readonly token: IToken;
    userHashList: IHashUser[];
    authenticate(username: string | number, password: string, store: string | number, callback: (err?: Error) => void): void;
    authCheck(username: string | number, password: string, store: string | number, callback: (err?: Error, result?: IToken) => void): void;
    decodeToken(token: string, options?: any): IParsedToken;
    clearToken();
    refreshToken(store: number, callback: (err?: Error) => void): void;
    userList(callback: (err: Error, result?: IHashUser[]) => void): void;
    offlinePasswordCheck(username: string | number, password: string, callback: ((err: Error, result?: boolean) => void)): void;
}

declare var authModule: FSDAuthentication;

declare module 'authModule' {
    export = authModule;
}