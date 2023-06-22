import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NodeModel } from '../model/NodeModel';
import { NodeAttributeModel } from '../model/NodeAttributeModel';

@Injectable({
    providedIn: 'root'
  })

export class NodeService{
    private url = 'https://localhost:7277/api/Node';
      
    public idEmit = new EventEmitter();

    constructor(private httpClient: HttpClient) { }
    
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



    getNodeData(){
      return this.httpClient.get<NodeModel[]>(this.url);
    }  
  
    getNodeDataById(id:string){      
      return this.httpClient.get<NodeModel>(this.url+"/id",{
        headers: new HttpHeaders({ 
          'id':id
        })
      })
    }

    data = "https://localhost:7277/api/NodeAttribute/id?nodeId=1";
    getNodeAttributeByNodeId(id:string){
     return this.httpClient.get<NodeAttributeModel[]>(this.url+"Attribute/id?nodeId="+id);
    }
}

