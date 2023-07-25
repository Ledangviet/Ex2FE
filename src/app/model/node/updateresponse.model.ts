import { NodeModel } from "./node.model";

export class UpdateResponseModel {
    public succeed: boolean;
    public status: string;
    public nodeModel: NodeModel;
}