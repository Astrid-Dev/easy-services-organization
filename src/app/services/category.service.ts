import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Service} from "../models/Service";

const SERVICES_URL = `${environment.BACKEND_API_URL}services`;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  hasLoadedServices: boolean = false;
  services: Service[] = [];

  constructor(private http: HttpClient) { }

  getAllServices(retrieveAll: boolean = true){
    return new Promise((resolve, reject) =>{
      if(this.hasLoadedServices){
        resolve(this.services);
      }
      else{
        this.http.get(SERVICES_URL+'?retrieve_all='+retrieveAll)
          .subscribe({
            next: (res: any) =>{
              this.services = res;
              this.hasLoadedServices = true;
              resolve(res);
            },
            error: (err) =>{
              this.hasLoadedServices = false;
              reject(err);
            }
          });
      }
    });
  }

  getOneService(serviceId: number){
    let service = this.services.find(elt => elt.id === serviceId);
    return new Promise((resolve, reject) =>{
      if(service){
        resolve(service);
      }
      else{
        this.http.get(SERVICES_URL+'/'+serviceId)
          .subscribe({
            next: (res) =>{
              resolve(res);
            },
            error: (err) =>{
              reject(err);
            }
          });
      }
    });
  }
}
