import { Component } from '@angular/core';
import {Enquiry} from "../../models/Enquiry";
import {User} from "../../models/User";
import {Filter, OrderDirection, OrderType, Paginator} from "../../models/Filter";
import {TranslationService} from "../../services/translation.service";
import {OrganizationService} from "../../services/organization.service";
import {AuthStateService} from "../../services/auth-state.service";
import {Router} from "@angular/router";
import {
  formatNewServicesGroup, formatNewServicesGroup2,
  getARequestStateColor, getARequestStateLabel, initializeServicesGroup,
  printReadableDate,
  printReadableDateComparedToDelay
} from "../../helpers/helpers.functions";
import {NgxSmartModalService} from "ngx-smart-modal";
import {CategoryService} from "../../services/category.service";
import {Service, ServiceSelection} from "../../models/Service";

const MODAL_ID = 'requestsFiltering';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent {

  hasLoadedRequests: boolean | null = null;
  hasLoadedUserData: boolean | null = null;
  hasLoadedServices: boolean | null = null;
  user!: User;
  servicesList: ServiceSelection[] = [];
  requests: Enquiry[] = [];

  searchedRequestCode: string = "";

  defaultFilter: Filter = {
    order_by: OrderType.CREATION_DATE,
    order_direction: OrderDirection.DESCENDANT,
    states: "",
    services: []
  }

  filter: Filter = {
    ...this.defaultFilter
  }

  filteringModal: any = null;

  paginator:Paginator = {
    currentPage: 1,
    currentPageEndingNumber: 0,
    currentPageStartingNumber: 0,
    totalPages: 0,
    totalResults: 0,
    totalResultsPerPage: 15
  }

  constructor(
    private translationService: TranslationService,
    private organizationService: OrganizationService,
    private authStateService: AuthStateService,
    private router: Router,
    private ngxSmartModalService: NgxSmartModalService,
    private categoryService: CategoryService
  ) { }

  get isLoading(){
    return (this.hasLoadedRequests === null || this.hasLoadedUserData === null || this.hasLoadedServices === null)
  }

  get hasFailedLoading(){
    return ((this.hasLoadedUserData === false && this.hasLoadedRequests !== null && this.hasLoadedServices !== null) ||
      (this.hasLoadedRequests === false && this.hasLoadedUserData !== null && this.hasLoadedServices !== null) ||
      (this.hasLoadedServices === false && this.hasLoadedRequests !== null && this.hasLoadedUserData !== null)
    );
  }

  get actualCheckedServices(){
    let result: number[] = [];
    let applications = this.user?.organization?.applications ?? [];
    result = applications.map((elt) => elt.service_id);
    return result;
  }

  get remainingItemsToCompleteRow(){
    let temp = this.requests.length > 0 ? (3 - (this.requests.length % 3)) : 0;
    let result = [];
    for(let i = 0; i < temp; i++){
      result.push(i);
    }

    return result;
  }

  label(item: any){
    return this.translationService.getCurrentLang() === 'fr' ? item?.label : item?.label_en;
  }

  printDate(date: Date | string | undefined, withDelay: boolean = false)
  {
    date = typeof date === 'string' ? new Date(date) : date;
    return !withDelay ? printReadableDate(date as Date, this.translationService.getCurrentLang(), true, true)
      : printReadableDateComparedToDelay(date as Date, this.translationService.getCurrentLang());
  }

  requestStateColor(state: number | undefined){
    return getARequestStateColor(state as number, 'text');
  }

  requestStateLabel(state: number | undefined){
    return this.translationService.getValueOf(getARequestStateLabel(state as number));
  }

  arrayOfPages(pages: number, startingValue: number = 1){
    let result = [];
    for(let i = 0; i < pages; i++){
      result.push(i+startingValue);
    }

    return result;
  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.filteringModal = this.ngxSmartModalService.getModal(MODAL_ID);
  }

  loadData(){
    if(!this.hasLoadedUserData){
      this.loadUserData();
    }
    if(!this.hasLoadedServices){
      this.loadServices();
    }
    if(!this.hasLoadedRequests){
      this.filterRequests();
    }
  }

  loadRequests(otherParams: ({key: string, value: string | number}[] | null) = null){
    this.hasLoadedRequests = null;
    this.organizationService.getAnOrganizationRequests(this.user?.organization?.id as number, otherParams)
      .then((res: any) =>{
        console.log(res);
        this.requests = res.data;
        this.paginator = {
          ...this.paginator,
          totalResults: res.total,
          totalPages: res.last_page,
          totalResultsPerPage: res.per_page,
          currentPageStartingNumber: res.from,
          currentPageEndingNumber: res.to
        }
        this.hasLoadedRequests = true;
      })
      .catch((err) =>{
        console.error(err);
        this.hasLoadedRequests = false;
      });
  }

  loadServices(){
    this.hasLoadedServices = null;

    this.categoryService.getAllServices()
      .then((res: any) =>{
        this.servicesList = initializeServicesGroup(res);
        console.log(this.servicesList);
        this.hasLoadedServices = true;
      })
      .catch((err) =>{
        console.error(err);
        this.hasLoadedServices = false;
      });
  }

  filterRequests(){
    let otherParams = [];
    otherParams.push({
      key: 'page',
      value: this.paginator.currentPage
    }, {
      key: 'per_page',
      value: this.paginator.totalResultsPerPage
    });

    if(this.searchedRequestCode !== '') {
      otherParams.push({
        key: 'code',
        value: this.searchedRequestCode
      });
    }
    if(this.filter.states !== '') {
      otherParams.push({
        key: 'states',
        value: this.filter.states
      });
    }
    if(this.filter.services.length > 0) {
      otherParams.push({
        key: 'services',
        value: this.filter.services.join(',')
      });
    }

    otherParams.push(
      {
        key: 'order_by',
        value: this.filter.order_by
      },
      {
        key: 'order_direction',
        value: this.filter.order_direction
      }
    );

    this.loadRequests(otherParams);
  }

  goToPage(page: number){
    if(page > 0){
      this.paginator = {
        ...this.paginator,
        currentPage: page
      }
      this.filterRequests();
    }
  }

  private loadUserData(){
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

  onViewRequestDetails(request: Enquiry){
    this.router.navigate(['/requests/'+request.code])
  }

  openFilteringModal(){
    let filteredServices = this.filter.services;
    let temp = formatNewServicesGroup2(this.actualCheckedServices, this.servicesList, true)
      .map((elt) =>{
        let children = elt.children.map((child) =>{return {...child, isChecked: filteredServices.length > 0 ? filteredServices.includes(child.id) : true}});
        let checkedChildren = children.filter(child => child.isChecked);
        return {
          parent: {...elt.parent, hasCheckedAllChildren: checkedChildren.length === elt.children.length, hasCheckedOneChild: checkedChildren.length > 0},
          children: children
        }
      });
    this.filteringModal.setData({
      filter: this.filter,
      defaultFilter: this.defaultFilter,
      possiblesServices: this.actualCheckedServices,
      servicesList: temp
    });
    this.filteringModal.open();
  }

  onApplyFilter(newFilter: Filter){
    this.filter = newFilter;
    this.filterRequests();
  }

}
