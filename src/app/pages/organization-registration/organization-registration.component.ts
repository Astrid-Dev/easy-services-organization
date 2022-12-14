import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {ScreenService} from "../../services/screen.service";
import {TranslationService} from "../../services/translation.service";
import {PhoneValidator} from "../../helpers/phone.validator";
import {Service, ServiceSelection} from "../../models/Service";
import {User} from "../../models/User";
import {AuthStateService} from "../../services/auth-state.service";
import {CategoryService} from "../../services/category.service";
import {OrganizationService} from "../../services/organization.service";
import {Router} from "@angular/router";
import {initializeServicesGroup} from "../../helpers/helpers.functions";

@Component({
  selector: 'app-organization-registration',
  templateUrl: './organization-registration.component.html',
  styleUrls: ['./organization-registration.component.scss']
})
export class OrganizationRegistrationComponent {

  validFilesTypes = ['image/jpeg', 'image/png', '.jpg', '.png', '.jfif'];

  organizationRegistrationForm!: FormGroup;
  formIsSubmitted: boolean = false;
  isProcessing: boolean = false;

  servicesList: ServiceSelection[] = [];
  user!: User;

  logo: any = null;
  logoBase64: string | null = null;

  hasLoadedUserData: boolean | null = null;
  hasLoadedServices: boolean | null = null;

  checkedServices: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private screenService: ScreenService,
    private translationService: TranslationService,
    private authStateService: AuthStateService,
    private categoryService: CategoryService,
    private organizationService: OrganizationService,
    private router: Router
  ){
    this.organizationRegistrationForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      email1: [null, [Validators.required, Validators.email, Validators.maxLength(100)]],
      email2: [null, [Validators.required, Validators.email, Validators.maxLength(100)]],
      facebook: [null],
      twitter: [null],
      website: [null],
      instagram: [null],
      description: [null, [Validators.maxLength(500)]],
      description_en: [null, [Validators.maxLength(500)]],
      country: ['CM']
    });

    this.organizationRegistrationForm.addControl('phone_number1', new FormControl(null,
      Validators.compose([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(18),
        PhoneValidator.validCountryPhone(this.organizationRegistrationForm.controls.country)
      ])));

    this.organizationRegistrationForm.addControl('phone_number2', new FormControl(null,
      Validators.compose([
        Validators.minLength(12),
        Validators.maxLength(18),
        PhoneValidator.validCountryPhone(this.organizationRegistrationForm.controls.country)
      ])));
  }

  get formValue(){
    return this.organizationRegistrationForm.value;
  }

  get errorControl(){
    return this.organizationRegistrationForm.controls;
  }

  get hasLoadedAll(){
    return this.hasLoadedUserData && this.hasLoadedServices;
  }

  get isLoadingData(){
    return (this.hasLoadedServices === null || this.hasLoadedUserData === null);
  }

  get hasFailedDataLoading(){
    return ((this.hasLoadedServices === false && this.hasLoadedUserData !== null)
      || (this.hasLoadedUserData === false && this.hasLoadedServices !== null));
  }

  ngOnInit(){
    this.loadAll();
  }

  label(item: any){
    return this.translationService.getCurrentLang() === 'fr' ? item.label : item.label_en;
  }

  loadAll(){
    if(!this.hasLoadedUserData){
      this.loadUserData();
    }

    if(!this.hasLoadedServices){
      this.loadServices();
    }
  }

  loadUserData(){
    this.hasLoadedUserData = null;
    this.authStateService.getUserData()
      .then((userData) =>{
        this.user = userData;
        this.hasLoadedUserData = true;
      })
      .catch((err) =>{
        console.error(err);
        this.hasLoadedUserData = false;
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

  inputStatusClassName(formControlName: string){
    let result = '';
    let control = this.organizationRegistrationForm.controls[formControlName];
    if(control){
      result = control.errors ? 'has-error' : 'has-success';
    }
    else{
      result = ''
    }

    return 'form-group has-feedback ' + (this.formIsSubmitted ? result : '');
  }

  onFormSubmit(){
    this.formIsSubmitted = true;
    Object.entries(this.organizationRegistrationForm.controls).forEach((elt) =>{
      console.log((elt[0] + ': '+ elt[1].value))
    });
    if(!this.organizationRegistrationForm.valid)
    {
      this.screenService.showErrorToast(this.translationService.getValueOf("ORGANIZATION.REGISTRATION.INVALIDFORM"));
    }
    else {
      this.isProcessing = true;
      let data = new FormData();
      Object.entries(this.organizationRegistrationForm.controls).forEach((elt) =>{
        if(elt[0] !== 'country'){
          data.append(elt[0], elt[1].value);
        }
      });

      data.append('user_id', this.user.id as any);
      if(this.logo){
        data.append('logo', this.logo);
      }

      if(this.checkedServices.length > 0){
        data.append('services', this.checkedServices.join(','));
      }

      this.organizationService.registerAnOrganization(data)
        .then((res: any) =>{
          let user = {
            ...res.user,
            organization: {
              ...res.organization,
              applications: res.applications
            }
          }

          this.authStateService.setUserData(user);
          this.isProcessing = false;
          this.formIsSubmitted = false;
          this.organizationRegistrationForm.reset();
          this.router.navigate(["/home"]);
          this.screenService.showSuccessToast(this.translationService.getValueOf("ORGANIZATION.REGISTRATION.REGISTRATIONSUCCESS"));
        })
        .catch((err) =>{
          this.isProcessing = false;
          console.error(err);
          this.screenService.showErrorToast(this.translationService.getValueOf("ORGANIZATION.REGISTRATION.REGISTRATIONERROR"));
        });
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

}


