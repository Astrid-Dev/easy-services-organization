import { Component } from '@angular/core';
import {Organization} from "../../models/Organization";
import {TranslationService} from "../../services/translation.service";
import {Router} from "@angular/router";
import {OrganizationService} from "../../services/organization.service";
import {User} from "../../models/User";
import {AuthStateService} from "../../services/auth-state.service";
import {formatNewServicesGroup, getARemoteResourcePath, initializeServicesGroup} from "../../helpers/helpers.functions";
import {Service, ServiceSelection} from "../../models/Service";
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent {

  hasLoadedOrganizationData: boolean | null = null;
  hasLoadedUserData: boolean | null = null;
  hasLoadedServices: boolean | null = null;

  organization!: Organization;
  user!: User;

  servicesList: ServiceSelection[] = [];
  allServices: Service[] = [];

  constructor(
    private translationService: TranslationService,
    private router: Router,
    private organizationService: OrganizationService,
    private authStateService: AuthStateService,
    private categoryService: CategoryService,
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
    this.loadServices();
    this.loadOrganizationData();
  }

  loadUser(){
    this.hasLoadedUserData = null;
    this.authStateService.userData.subscribe({
      next: (user) =>{
        if(user){
          this.user = user;
          this.organization = user?.organization as Organization;
          this.syncServices();
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

  loadServices(){
    this.hasLoadedServices = null;

    this.categoryService.getAllServices()
      .then((res: any) =>{
        this.allServices = res;
        this.syncServices();
        this.hasLoadedServices = true;
      })
      .catch((err) =>{
        console.error(err);
        this.hasLoadedServices = false;
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
        this.syncServices();

        this.authStateService.setUserData(this.user);
        this.hasLoadedOrganizationData = true;
      })
      .catch((err) =>{
        console.error(err);
        this.hasLoadedOrganizationData = false;
      });
  }

  syncServices(){
    let temp: number[] = this.organization?.applications?.map(elt => elt.service_id) ?? [];
    this.servicesList = formatNewServicesGroup(temp, this.allServices, true);
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
