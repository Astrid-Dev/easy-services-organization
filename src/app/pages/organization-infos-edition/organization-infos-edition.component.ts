import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {Service, ServiceSelection} from "../../models/Service";
import {User} from "../../models/User";
import {CategoryService} from "../../services/category.service";
import {AuthStateService} from "../../services/auth-state.service";
import {OrganizationService} from "../../services/organization.service";
import {Organization} from "../../models/Organization";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PhoneValidator} from "../../helpers/phone.validator";
import {TranslationService} from "../../services/translation.service";
import {ScreenService} from "../../services/screen.service";
import {arraysAreEquals, getARemoteResourcePath} from "../../helpers/helpers.functions";

@Component({
  selector: 'app-organization-infos-edition',
  templateUrl: './organization-infos-edition.component.html',
  styleUrls: ['./organization-infos-edition.component.scss']
})
export class OrganizationInfosEditionComponent {

  currentTab = 'infos';

  hasLoadedUserData: boolean | null = null;
  hasLoadedServices: boolean | null = null;

  servicesList: ServiceSelection[] = [];
  user!: User;
  organization!: Organization;

  infosForm!: FormGroup;
  contactsForm!: FormGroup;

  checkedServices: number[] = [];

  infosFormIsSubmitted: boolean = false;
  contactsFormIsSubmitted: boolean = false;

  isUpdatingInfos: boolean = false;
  isUpdatingServices: boolean = false;
  isUpdatingContacts: boolean = false;

  logo: any = null;
  logoBase64: string | null = null;
  validFilesTypes = ['image/jpeg', 'image/png', '.jpg', '.png', '.jfif'];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private authStateService: AuthStateService,
    private organizationService: OrganizationService,
    private translationService: TranslationService,
    private screenService: ScreenService,
  ){}

  isCurrentTab(tab: string){
    return this.currentTab === tab;
  }

  get actualCheckedServices(){
    let result: number[] = [];
    let applications = this.organization.applications ?? [];
    result = applications.map((elt) => elt.service_id);
    return result;
  }

  get isLoadingData(){
    return (this.hasLoadedServices === null || this.hasLoadedUserData === null);
  }

  get hasFailedDataLoading(){
    return ((this.hasLoadedServices === false && this.hasLoadedUserData !== null)
      || (this.hasLoadedUserData === false && this.hasLoadedServices !== null));
  }

  get infosFormControls(){
    return this.infosForm.controls;
  }

  get contactsFormControls(){
    return this.contactsForm.controls;
  }

  get canSubmitInfosForm(){
    let dataHaveChange = ((this.infosFormControls.name.value !== this.organization?.name) ||
      (this.infosFormControls.country.value !== this.organization?.country) ||
      (this.infosFormControls.city.value !== this.organization?.city) ||
      (this.infosFormControls.address.value !== this.organization?.address) ||
      (this.infosFormControls.description.value !== this.organization?.description) ||
      (this.infosFormControls.description_en.value !== this.organization?.description_en) ||
      (getARemoteResourcePath(this.organization?.logo as string) !== this.logoBase64)
    );

    return this.infosForm.valid && dataHaveChange;
  }

  get canSubmitServicesForm(){
    let dataHaveChange = !arraysAreEquals(this.actualCheckedServices, this.checkedServices);

    return this.checkedServices.length > 0 && dataHaveChange;
  }

  get canSubmitContactsForm(){
    let dataHaveChange = ((this.contactsFormControls.email1.value !== this.organization?.email1) ||
      (this.contactsFormControls.email2.value !== this.organization?.email2) ||
      (this.contactsFormControls.phone_number1.value !== this.organization?.phone_number1) ||
      (this.contactsFormControls.phone_number2.value !== this.organization?.phone_number2) ||
      (this.contactsFormControls.twitter.value !== this.organization?.twitter) ||
      (this.contactsFormControls.instagram.value !== this.organization?.instagram) ||
      (this.contactsFormControls.website.value !== this.organization?.website) ||
      (this.contactsFormControls.facebook.value !== this.organization?.facebook)
    );

    return this.contactsForm.valid && dataHaveChange;
  }

  infosFormInputStatusClassName(formControlName: string){
    let result = '';
    let control = this.infosFormControls[formControlName];
    if(control){
      result = control.errors ? 'has-error' : 'has-success';
    }
    else{
      result = ''
    }

    return 'form-group has-feedback ' + (this.infosFormIsSubmitted ? result : '');
  }

  contactsFormInputStatusClassName(formControlName: string){
    let result = '';
    let control = this.contactsFormControls[formControlName];
    if(control){
      result = control.errors ? 'has-error' : 'has-success';
    }
    else{
      result = ''
    }

    return 'form-group has-feedback ' + (this.infosFormIsSubmitted ? result : '');
  }

  ngOnInit(){
    this.loadData();
  }

  initializeForms(){
    this.infosForm = this.formBuilder.group({
      description: [this.organization?.description, [Validators.maxLength(500)]],
      description_en: [this.organization?.description_en, [Validators.maxLength(500)]],
      name: [this.organization?.name, [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      country: [this.organization?.country, [Validators.required]],
      city: [this.organization?.city, [Validators.required]],
      address: [this.organization?.address, [Validators.required]],
      country_code: ['CM']
    });

    if(this.organization?.logo && this.organization.logo !== ''){
      this.logoBase64 = getARemoteResourcePath(this.organization.logo);
    }

    this.checkedServices = this.actualCheckedServices;

    this.contactsForm = this.formBuilder.group({
      email1: [this.organization?.email1, [Validators.required, Validators.email, Validators.maxLength(100)]],
      email2: [this.organization?.email2, [Validators.required, Validators.email, Validators.maxLength(100)]],
      facebook: [this.organization?.facebook],
      twitter: [this.organization?.twitter],
      website: [this.organization?.website],
      instagram: [this.organization?.instagram],
    });

    this.contactsForm.addControl('phone_number1', new FormControl(this.organization?.phone_number1,
      Validators.compose([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(18),
        PhoneValidator.validCountryPhone(this.infosFormControls.country_code)
      ])));

    this.contactsForm.addControl('phone_number2', new FormControl(this.organization?.phone_number2,
      Validators.compose([
        Validators.minLength(12),
        Validators.maxLength(18),
        PhoneValidator.validCountryPhone(this.infosFormControls.country_code)
      ])));
  }

  loadData(){
    if(!this.hasLoadedUserData){
      this.loadUser();
    }
    if(!this.hasLoadedServices){
      this.loadServices();
    }
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

  loadServices(){
    this.hasLoadedServices = null;

    this.categoryService.getAllServices()
      .then((res: any) =>{
        this.servicesList = [];
        res.filter((elt: Service) => elt.parent_id === null)
          .forEach((elt: Service) =>{
            const children = res.filter((child: Service) => child.parent_id === elt.id)
              .map((child: Service) =>{
                return{
                  ...child,
                  isChecked: this.actualCheckedServices.includes(child.id)
                }
              });
            const checkedChildren = children.filter((child: (Service & {isChecked: boolean})) => child.isChecked);
            this.servicesList.push({
              parent: {...elt, hasCheckedAllChildren: checkedChildren.length === children.length, hasCheckedOneChild: checkedChildren.length > 0},
              children: children
            });
          });
        this.initializeForms();
        console.log(this.servicesList);
        this.hasLoadedServices = true;
      })
      .catch((err) =>{
        console.error(err);
        this.hasLoadedServices = false;
      });
  }

  onChangeTab(newTabName: string){
    if(!this.isUpdatingContacts && !this.isUpdatingServices &&!this.isUpdatingInfos) {
      this.currentTab = newTabName;
    }
  }

  onServicesChange(services: number[]){
    this.checkedServices = services;
  }

  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(evt: any) {
    const files = evt.target.files;
    this.prepareFilesList(files);
  }

  prepareFilesList(files: Array<any>) {
    const lastFile = this.logo;
    const item = files[0];
    if(this.validFilesTypes.includes(item.type))
    {
      this.logo = item;
    }
    else
    {
      this.screenService.showWarningToast(this.translationService.getValueOf("ORGANIZATION.REGISTRATION.INVALIDIMAGEFILE"));
    }
    if(lastFile !== this.logo)
    {
      let fileReader = new FileReader();
      fileReader.onloadend = () =>{
        this.logoBase64 = fileReader.result as string;
        console.log(this.logoBase64)
      }
      fileReader.readAsDataURL(this.logo);
    }
  }

  submitContactsForm(){
    this.contactsFormIsSubmitted = true;
  }

  submitInfosForm(){
    this.infosFormIsSubmitted = true;
  }

  submitServicesForm(){

  }
}
