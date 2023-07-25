export class AddApplicationModel{
    public name:string;
    public submissionDate:Date;
    public owner:string;
    constructor(
        name:string,
        submissionDate:Date,
        owner:string,
    ){
        this.name = name;
        this.submissionDate = submissionDate;
        this.owner = owner;
    }
}