export class SignInModel {
    constructor(email: string, password: string) {
        this.email = email
        this.password = password
    }
    public email: string;
    public password: string;
}
export class SignUpModel {
    constructor(username: string, email: string, phonenumber: string, password: string) {
        this.password = password
        this.email = email
        this.username = username
        this.phonenumber = phonenumber
    }
    public username: string;
    public email: string;
    public phonenumber: string;
    public password: string;
}
export class SignUpResponseModel {
    public succeeded: string;
    public status: string | undefined;
}
export class TokenModel {
    public userName: string;
    public accessToken: string;
    public refreshToken: string;
}
export class SignInResponseModel {
    public succeeded: boolean;
    public status: string;
    public token: TokenModel;
}

export class GetTokenResponse{
    public status:boolean;
    public statusMessage:string;
    public token:string;
}