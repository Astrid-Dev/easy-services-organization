import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Organization} from "../models/Organization";
import {HttpClient} from "@angular/common/http";
import {NewEmployee} from "../models/Employee";

const ORGANIZATION_URL = `${environment.BACKEND_API_URL}organizations`;
const ORGANIZATION_REQUESTS_URL = `${environment.BACKEND_API_URL}enquiries`;
const ORGANIZATION_DASHBOARD_URL = `${environment.BACKEND_API_URL}dashboard/organization`;
const ORGANIZATION_EMPLOYEES_URL = `${environment.BACKEND_API_URL}service_providers`;
const ORGANIZATION_EMPLOYEES_GESTURE_URL = `${environment.BACKEND_API_URL}organization_employees`;
const SEARCH_USER_URL = `${ORGANIZATION_EMPLOYEES_GESTURE_URL}/search_for_user`;
const SEARCH_SOME_PROVIDERS_URL = `${ORGANIZATION_EMPLOYEES_GESTURE_URL}/search_some_providers_for_request`;
const EMPLOYEE_REGISTRATION_URL = `${ORGANIZATION_EMPLOYEES_GESTURE_URL}/register_new_employee`;

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private http: HttpClient) { }

  // Organization

  registerAnOrganization(organizationData: FormData){
    return new Promise((resolve, reject) =>{
      this.http.post(ORGANIZATION_URL, organizationData)
        .subscribe({
          next: (res) =>{
            resolve(res);
          },
          error: (err) =>{
            reject(err);
          }
        });
    });
  }

  getAnOrganizationInfos(organizationId: number){
    return new Promise((resolve, reject) =>{
      this.http.get(`${ORGANIZATION_URL}/${organizationId}`)
        .subscribe({
          next: (res) =>{
            resolve(res);
          },
          error: (err) =>{
            reject(err);
          }
        });
    });
  }

  UpdateAnOrganization(organizationId: number, newOrganizationData: Organization){
    return new Promise((resolve, reject) =>{
      this.http.put(`${ORGANIZATION_URL}/${organizationId}`, newOrganizationData)
        .subscribe({
          next: (res) =>{
            resolve(res);
          },
          error: (err) =>{
            reject(err);
          }
        });
    });
  }

  //Requests

  getAnOrganizationRequests(organization_id: number, params: ({key: string, value: string | number}[] | null) = null){

    let requestParams = '?organization_id=' + organization_id;
    if(params){
      params.forEach((elt) =>{
        requestParams += '&'+elt.key+'='+elt.value;
      });
    }
    return new Promise(((resolve, reject) => {
      this.http.get(ORGANIZATION_REQUESTS_URL+requestParams)
        .subscribe({
          next: (res) =>{
            resolve(res);
          },
          error: (err) =>{
            reject(err);
          }
        });
    }));
  }

  getARequestWithCode(requestCode: string)
  {
    return new Promise(((resolve, reject) => {
      if(requestCode === '') {
        reject('No code provide!!!');
      }
      this.http.get(ORGANIZATION_REQUESTS_URL+'/'+requestCode+'?is_code=true')
        .subscribe({
          next: (res) =>{
            resolve(res);
          },
          error: (err) =>{
            reject(err);
          }
        });
    }));
  }

  updateARequest(requestId: number, newRequestData: any)
  {
    return new Promise(((resolve, reject) => {
      this.http.put(ORGANIZATION_REQUESTS_URL+'/'+requestId, {...newRequestData, author: 'organization'})
        .subscribe({
          next: (res) =>{
            resolve(res);
          },
          error: (err) =>{
            reject(err);
          }
        });
    }));
  }

  // Employees

  getAnOrganizationEmployees(organizationId: number, searchedName: string | null = null){
    return new Promise(((resolve, reject) => {
      this.http.get(`${ORGANIZATION_EMPLOYEES_URL}?organization_id=${organizationId}${searchedName ? ('&provider_name='+searchedName) : ''}`)
        .subscribe({
          next: (res) =>{
            resolve(res);
          },
          error: (err) =>{
            reject(err);
          }
        });
    }));
  }

  searchForAnUser(key: string, value: string){
    return new Promise(((resolve, reject) => {
      this.http.get(`${SEARCH_USER_URL}?${key}=${value}`)
        .subscribe({
          next: (res) =>{
            resolve(res);
          },
          error: (err) =>{
            reject(err);
          }
        });
    }));
  }

  searchSomeProvidersForRequest(organizationId: number, requestId: number){
    return new Promise(((resolve, reject) => {
      this.http.get(`${SEARCH_SOME_PROVIDERS_URL}/${organizationId}?enquiry_id=${requestId}`)
        .subscribe({
          next: (res) =>{
            resolve(res);
          },
          error: (err) =>{
            reject(err);
          }
        });
    }));
  }

  registerNewEmployee(employee: NewEmployee){
    return new Promise(((resolve, reject) => {
      this.http.post(`${EMPLOYEE_REGISTRATION_URL}`, employee)
        .subscribe({
          next: (res) =>{
            resolve(res);
          },
          error: (err) =>{
            reject(err);
          }
        });
    }));
  }

  //Dashboard

  getAnOrganizationDashboard(organizationId: number){
    return new Promise(((resolve, reject) => {
      this.http.get(`${ORGANIZATION_DASHBOARD_URL}/${organizationId}`)
        .subscribe({
          next: (res) =>{
            resolve(res);
          },
          error: (err) =>{
            reject(err);
          }
        });
    }));
  }

}
