export class UpdateNodeModel{
    constructor(
        id:number,
        name:string,
        nodeType:number,
        parrentId:number,
    ){
        this.id = id;
        this.name = name;
        this.nodeType = nodeType;
        this.parrentId = parrentId;
    }
    public id:number;
    public name:string;
    public nodeType:number;
    public parrentId:number;
}