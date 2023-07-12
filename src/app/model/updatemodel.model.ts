export class UpdateNodeModel {
    constructor(
        id: number,
        name: string,
        nodeType: number,
        parrentId: number,
        submissionDate: Date,
        owner: string,
    ) {
        this.id = id;
        this.name = name;
        this.nodeType = nodeType;
        this.parrentId = parrentId;
        this.submissionDate = submissionDate;
        this.owner = owner;
    }
    public id: number;
    public name: string;
    public nodeType: number;
    public parrentId: number;
    public submissionDate: Date;
    public owner: string;

}