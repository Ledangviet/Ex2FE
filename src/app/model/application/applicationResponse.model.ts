import { AddApplicationModel } from './addapplication.model';
import { ApplicationModel } from './application.model';
export class AddApplicationResponseModel{
    public status:boolean;
    public statusMessage: string;
    public model: ApplicationModel[];
    constructor(
    ){

    }
}