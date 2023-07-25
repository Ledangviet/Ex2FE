export class NodeAttributeModel {
    constructor(
        id: number,
        name: string,
        nodeId: number,

    ) {
        this.id = id;
        this.name = name;
        this.nodeId = nodeId;
    }
    public id: number;
    public name: string;
    public nodeId: number;
}