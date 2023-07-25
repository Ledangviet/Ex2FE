export class AddNodeModel{
    public id = 0;
    public name:string;
    public nodeType:number;
    public parrentId:number;
    public owner:string;
    public applicationId:number;
    public submissionDate: Date;
    public attributes = [];

    constructor(
        name:string,
        nodeType:number,
        parrentId:number,
        owner:string,
        applicationId:number,
        submissionDate:Date,        
    ){
        this.name = name;
        this.nodeType = nodeType;
        this.parrentId = parrentId;
        this.owner = owner;
        this.applicationId = applicationId;
        this.submissionDate = submissionDate;        
    }
    


    // {
    //     "id": 0,
    //     "name": "string",
    //     "nodeType": 0,
    //     "parrentId": 0,
    //     "owner": "string",
    //     "applicationId": 0,
    //     "submissionDate": "2023-07-24T07:26:55.914Z",
    //     "attributes": [
    //       {
    //         "id": 0,
    //         "name": "string",
    //         "nodeId": 0
    //       }
    //     ]
    //   }
}