export class NodeModel{
    constructor(
        id:number,
        name:string,
        nodeType:string,
        parrentId:number,
        childs:NodeModel[],
    ){
        this.id = id;
        this.name = name;
        this.nodeType = nodeType;
        this.parrentId = parrentId;
        this.childs = childs;
    }
    public id:number;
    public name:string;
    public nodeType: string;
    public parrentId:number;
    public childs:NodeModel[];
}