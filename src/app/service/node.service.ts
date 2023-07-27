import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NodeModel} from '../model/node/node.model';
import { NodeAttributeModel } from '../model/nodeattribute/nodeattribute.model';
import { UpdateNodeModel } from '../model/node/updatenode.model';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from './authen.service';
import { AddNodeModel } from '../model/node/addnode.model';
import { UpdateResponseModel } from '../model/node/updateresponse.model';

const CREATE_ACTION = "create";
const UPDATE_ACTION = "update";

@Injectable({
  providedIn: 'root'
})

export class NodeService {
  public token: string = this.cookieService.get('accesstoken');
  private url = 'https://localhost:7277/api/Node';

  public currentIndex: [];

  public gridEmit = new EventEmitter();
  public idEmit = new EventEmitter();
  public reloadTreeEmit = new EventEmitter();
  public closeDialogEmit = new EventEmitter();
  public nodeClickEmit = new EventEmitter();
  public lazyLoadEmit = new EventEmitter();
  public addNodeEmit = new EventEmitter();
  

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private authenService: AuthenticationService,
  ) { }

  //format data form enum to string / reserve
  public FormatData(node: NodeModel): NodeModel {
    if (node.nodeType == "0") {
      node.nodeType = "Folder"
      return node;
    }
    if (node.nodeType == "1") {
      node.nodeType = "File";
      return node;
    }

    if (node.nodeType == "File") {
      node.nodeType = "1";
      return node;
    }
    if (node.nodeType == "Folder") {
      node.nodeType = "0";
      return node;
    }
    return node;
  }

  /**
   * Get All Node Api
   * @returns 
   */
  getNodeData(): Observable<NodeModel[]> {
    return this.httpClient.get<NodeModel[]>(this.url, {
      headers: this.authenService.header
    })
  }

  /**
   * Get node by application id
   * @param id 
   * @returns 
   */
  getNodeByApplicationId(id: number): Observable<NodeModel[]> {
    return this.httpClient.get<NodeModel[]>(this.url + "/application?id=" + id, {
      headers: this.authenService.header
    })
  }

  /**
   * Add node 
   * @param model 
   * @returns 
   */
  addNode(model: AddNodeModel) : Observable<NodeModel>{
    return this.httpClient.post<NodeModel>(this.url,model,{headers: this.authenService.header})
  }

  /**
   * remove node by aplication id
   * @param id 
   * @returns 
   */
  removeNodeByApplicationId(id: number): Observable<boolean> {
    return this.httpClient.put<boolean>(this.url + "/deletenodebyappllicationid", id, {
      headers: this.authenService.header
    })
  }
  /**
   * remove node
   */
  removeNode(id:number) : Observable<NodeModel[]>{
    return this.httpClient.delete<NodeModel[]>(this.url,{
      headers:new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.cookieService.get('accesstoken'),
        'id': id,
    })
    })
  }

  /**
   * Call Get Node Data Api
   * @param id 
   * @returns 
   */
  getNodeDataById(id: string): Observable<NodeModel> {
    return this.httpClient.get<NodeModel>(this.url + "/id", {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.cookieService.get('accesstoken'),
        'id': id,
    })
    })
  }

  /**
   * update node data with UpdateNodeModel
   * @param nodemodel 
   * @returns 
   */
  updateNodeData(nodemodel: UpdateNodeModel): Observable<UpdateResponseModel> {
    return this.httpClient.put<UpdateResponseModel>(
      this.url, JSON.stringify(nodemodel), {
      headers: this.authenService.header
    })
  }

  //Get all node attribute by node id
  getNodeAttributeByNodeId(id: string): Observable<NodeAttributeModel[]> {
    return this.httpClient.get<NodeAttributeModel[]>(this.url + "Attribute/id?nodeId=" + id);
  }



  //update node attribute
  updateNodeAttribute(model: NodeAttributeModel): Observable<NodeAttributeModel> {

    return this.httpClient.put<NodeAttributeModel>(this.url + "Attribute", model);
  }

  //add node attribute
  addNodeAttribute(model: NodeAttributeModel): Observable<NodeAttributeModel[]> {
    console.log(model);
    
    return this.httpClient.post<NodeAttributeModel[]>(this.url + "Attribute", model);
  }

  // add new or update node attribute
  public save(id: number, data: string, nodeId: number, isNew?: boolean) {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;
    //this one will add new attribute 
    if (action == "create") {
      var model = new NodeAttributeModel(0, data, nodeId);
      return this.httpClient.post<NodeAttributeModel[]>(this.url + "Attribute", model);
    }
    //this one will update node attribute
    if (action == "update") {
      var model = new NodeAttributeModel(id, data, nodeId);
      return this.httpClient.put<NodeAttributeModel>(this.url + "Attribute", model);
    }
    return new Observable;
  }

  //call delete api
  public remove(dataItem: any) {
    return this.httpClient.delete<NodeAttributeModel>(this.url + "Attribute?id=" + dataItem.id);
  }
}

