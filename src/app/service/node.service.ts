import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NodeModel } from '../model/NodeModel';
import { NodeAttributeModel } from '../model/NodeAttributeModel';
import { UpdateNodeModel } from '../model/UpdateNodeModel';
import { Observable } from 'rxjs';

const CREATE_ACTION = "create";
const UPDATE_ACTION = "update";
const REMOVE_ACTION = "destroy";

@Injectable({
    providedIn: 'root'
  })

export class NodeService{
    private url = 'https://localhost:7277/api/Node'; 
    public idEmit = new EventEmitter();
    public reloadTreeEmit = new EventEmitter();

    constructor(private httpClient: HttpClient) { }
    
    //format data form enum to string / reserve
    public FormatData(node:NodeModel): NodeModel{
      if(node.nodeType == "0"){
        node.nodeType = "Folder"
        return node;
      }
      if(node.nodeType == "1"){
        node.nodeType = "File"; 
        return node;
      }
            
      if(node.nodeType == "File"){
        node.nodeType = "1";  
        return node;
      }
      if(node.nodeType == "Folder"){
        node.nodeType = "0";  
        return node;
      }
      return node;      
    }

    //get all node data
    getNodeData(): Observable<NodeModel[]>{
      return this.httpClient.get<NodeModel[]>(this.url);
    }  
  
    //Get node by Id
    getNodeDataById(id:string): Observable<NodeModel>{      
      return this.httpClient.get<NodeModel>(this.url+"/id",{
        headers: new HttpHeaders({ 
          'id':id
        })
      })
    }

    //update node data with UpdateNodeModel
    updateNodeData(nodemodel:UpdateNodeModel): Observable<NodeModel>{
      return this.httpClient.put<NodeModel>(
        this.url,JSON.stringify(nodemodel),{
          headers: new HttpHeaders({ 
            'Content-Type': 'application/json'
          })
        })
    }




    //Get all node attribute by node id
    getNodeAttributeByNodeId(id:string): Observable<NodeAttributeModel[]>{
     return this.httpClient.get<NodeAttributeModel[]>(this.url+"Attribute/id?nodeId="+id);
    }

    //update node attribute
    updateNodeAttribute(model:NodeAttributeModel): Observable<NodeAttributeModel>{
      return this.httpClient.put<NodeAttributeModel>(this.url+"Attribute",model);
    }
    
    //add node attribute
    addNodeAttribute(model:NodeAttributeModel): Observable<NodeAttributeModel[]>{
      return this.httpClient.post<NodeAttributeModel[]>(this.url+"Attribute",model);
    }

    // add new or update node attribute
    public save(id: number , data: string, nodeId: number , isNew?: boolean){
      const action = isNew ? CREATE_ACTION : UPDATE_ACTION;     
      //this one will add new attribute 
      if(action == "create"){
        console.log('create service!');
        var model = new NodeAttributeModel(0,data,nodeId);
        return this.httpClient.post<NodeAttributeModel[]>(this.url+"Attribute",model);      
      }
      //this one will update node attribute
      if(action == "update"){  
        var model = new NodeAttributeModel(id,data,nodeId);
        console.log(model);             
        return this.httpClient.put<NodeAttributeModel>(this.url+"Attribute",model);
      }
      return new Observable;
    }  

    //call delete api
    public remove(dataItem: any){
      return this.httpClient.delete<NodeAttributeModel>(this.url+"Attribute?id="+dataItem.id);     
    }     
}

