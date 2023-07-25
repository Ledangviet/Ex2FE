export class SignUpModel {
    public username: string;
    public email: string;
    public phonenumber: string;
    public password: string;
    constructor(username: string, email: string, phonenumber: string, password: string) {
        this.password = password
        this.email = email
        this.username = username
        this.phonenumber = phonenumber
    }
    
}