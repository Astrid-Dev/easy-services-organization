import { Component } from '@angular/core';
import {Organization} from "../../models/Organization";
import {TranslationService} from "../../services/translation.service";
import {Router} from "@angular/router";
import {OrganizationService} from "../../services/organization.service";
import {User} from "../../models/User";
import {AuthStateService} from "../../services/auth-state.service";
import {getARemoteResourcePath} from "../../helpers/helpers.functions";

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent {

  hasLoadedOrganizationData: boolean | null = null;
  hasLoadedUserData: boolean | null = null;

  organization!: Organization;
  user!: User;

  constructor(
    private translationService: TranslationService,
    private router: Router,
    private organizationService: OrganizationService,
    private authStateService: AuthStateService
  ){

  }

  get employeesNumber(){
    return this.organization.employees_number ?? 0;
  }

  get isLoadingLocalData(){
    return this.hasLoadedUserData === null;
  }

  get hasFailedLocalDataLoading(){
    return this.hasLoadedUserData === false;
  }

  get organizationLogo(){
    return (this.organization?.logo && this.organization.logo !== '') ? getARemoteResourcePath(this.organization.logo) : null;
  }

  ngOnInit(){
    this.loadUser();
    this.loadOrganizationData();
  }

  loadUser(){
    this.hasLoadedUserData = null;
    this.authStateService.userData.subscribe({
      next: (user) =>{
        if(user){
          this.user = user;
          this.organization = user?.organization as Organization;
          this.hasLoadedUserData = true;
        }
        else{
          this.hasLoadedUserData = false;
        }
      },
      error: (err) =>{
        console.error(err);
        this.hasLoadedUserData = false;
      }
    });
  }

  loadOrganizationData(){
    this.hasLoadedOrganizationData = null;
    this.organizationService.getAnOrganizationInfos(this.organization.id as number)
      .then((organization: any) =>{
        this.organization = organization;
        console.log(this.organization)
        this.user = {
          ...this.user,
          organization: {
            ...this.organization
          }
        }

        this.authStateService.setUserData(this.user);
        this.hasLoadedOrganizationData = true;
      })
      .catch((err) =>{
        console.error(err);
        this.hasLoadedOrganizationData = false;
      });
  }

  getAFieldValue(fieldName: string){
    let result = '-';
    let temp = Object.entries(this.organization);
    for(let i = 0; i < temp.length; i++){
      if(temp[i][0] === fieldName){
        let value = temp[i][1];
        result = (value && value !== '' && value !== 'null') ? value : '-';
        break;
      }
    }

    return result;
  }
}
