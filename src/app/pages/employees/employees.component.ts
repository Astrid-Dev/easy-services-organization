import { Component } from '@angular/core';
import {User} from "../../models/User";
import {AuthStateService} from "../../services/auth-state.service";
import {OrganizationService} from "../../services/organization.service";
import {TranslationService} from "../../services/translation.service";
import {Employee} from "../../models/Employee";
import {NgxSmartModalService} from "ngx-smart-modal";
import {Service} from "../../models/Service";
import {CategoryService} from "../../services/category.service";
import {getANumberWithComma} from "../../helpers/helpers.functions";

const MODAL_ID = "employeeCreation";

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent {

  hasLoadedUserData: boolean | null = null;
  hasLoadedEmployeesData: boolean | null = null;
  hasLoadedServices: boolean | null = null;
  user!: User;
  employees: Employee[] = [];
  searchedName: string | null = null;
  allServices: Service[] = [];

  employeeCreationModal: any = null;

  constructor(
    private authStateService: AuthStateService,
    private organizationService: OrganizationService,
    private TranslationService: TranslationService,
    private ngxSmartModalService: NgxSmartModalService,
    private categoryService: CategoryService
  ){}

  get isLoading(){
    return (this.hasLoadedEmployeesData === null || this.hasLoadedUserData === null || this.hasLoadedServices === null)
  }

  get hasFailedLoading(){
    return ((this.hasLoadedUserData === false && this.hasLoadedEmployeesData !== null && this.hasLoadedServices !== null) ||
      (this.hasLoadedEmployeesData === false && this.hasLoadedUserData !== null && this.hasLoadedServices !== null) ||
      (this.hasLoadedServices === false && this.hasLoadedUserData !== null && this.hasLoadedEmployeesData !== null)
    );
  }

  applicationsOdd(applications: any){
    let incomeApplications = applications ? applications.length : 0;
    let staticApplications = this.user?.organization?.applications ? this.user?.organization?.applications?.length : 0;
    let percentage = (incomeApplications / (staticApplications === 0 ? 1 : staticApplications)) * 100;
    return incomeApplications + '/' + staticApplications + '\t('+getANumberWithComma(percentage, 2)+'%)';
  }

  ngOnInit(){
    this.loadUser();
    this.retrieveEmployees();
    this.loadServices();
  }

  ngAfterViewInit() {
    this.employeeCreationModal = this.ngxSmartModalService.getModal(MODAL_ID);
  }

  reloadData(){
    if(this.hasLoadedUserData === false){
      this.loadUser();
    }
    if(this.hasLoadedEmployeesData === false){
      this.retrieveEmployees();
    }
    if(this.hasLoadedServices === false){
      this.loadServices();
    }
  }

  loadUser(){
    this.hasLoadedUserData = null;
    this.authStateService.userData.subscribe({
      next: (user) =>{
        if(user){
          this.user = user;
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
        this.hasLoadedServices = true;
      })
      .catch((err) =>{
        console.error(err);
        this.hasLoadedServices = false;
      });
  }

  retrieveEmployees(){
    this.hasLoadedEmployeesData = null;
    this.organizationService.getAnOrganizationEmployees(
      this.user?.organization?.id as number,
      ((this.searchedName && this.searchedName !== '') ? this.searchedName : null)
    )
      .then((res: any) =>{
        this.employees = res.data;
        console.log(res);
        this.hasLoadedEmployeesData = true;
      })
      .catch((err) =>{
        console.error(err);
        this.hasLoadedEmployeesData = false;
      });
  }

  openEmployeeCreationModal(){
    this.employeeCreationModal.setData({
      services: (this.user?.organization?.applications ?? []).map(elt => elt.service_id),
      allServices: this.allServices,
      organization_id: this.user?.organization?.id
    });
    this.employeeCreationModal.open();
  }

}
