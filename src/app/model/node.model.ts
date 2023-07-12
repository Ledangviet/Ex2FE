export class NodeModel {
    constructor(
        id: number,
        name: string,
        nodeType: string,
        parrentId: number,
        submissionDate: Date,
        childs: NodeModel[],
        owner: string
    ) {
        this.id = id;
        this.name = name;
        this.nodeType = nodeType;
        this.parrentId = parrentId;
        this.childs = childs;
        this.submissionDate = submissionDate;
        this.owner = owner;
    }
    public id: number;
    public name: string;
    public nodeType: string;
    public parrentId: number;
    public childs: NodeModel[];
    public submissionDate: Date;
    public owner: string;
}

export class UpdateResponseModel {
    public succeed: boolean;
    public status: string;
    public nodeModel: NodeModel;
}