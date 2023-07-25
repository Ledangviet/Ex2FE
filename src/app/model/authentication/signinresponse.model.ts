import { TokenModel } from "./token.model";

export class SignInResponseModel {
    public succeeded: boolean;
    public status: string;
    public token: TokenModel;
}