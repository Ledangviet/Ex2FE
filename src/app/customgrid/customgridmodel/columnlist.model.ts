export class ColumnList{
    public field:string;
    public title:string;
    public width:number;
    constructor(
        field:string,
        title:string,
        width:number
    ){
        this.field = field;
        this.title = title;
        this.width = width;
    }
}