import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslationService} from "../../services/translation.service";
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {User} from "../../models/User";
import {PhoneValidator} from "../../helpers/phone.validator";
import {OrganizationService} from "../../services/organization.service";
import {ServiceSelection} from "../../models/Service";
import {formatNewServicesGroup} from "../../helpers/helpers.functions";
import {NewEmployee} from "../../models/Employee";
import {ScreenService} from "../../services/screen.service";

const MODAL_ID = 'employeeCreation';

@Component({
  selector: 'app-modal-employee-creation',
  templateUrl: './modal-employee-creation.component.html',
  styleUrls: ['./modal-employee-creation.component.scss']
})
export class ModalEmployeeCreationComponent{

  @ViewChild('identifier') identifier: any;

  modal: any = null;
  createEmployeeForm!: FormGroup;
  identifierKey: string = 'username';
  selectedUser!: User | null;

  formIsSubmitted: boolean = false;
  possiblesUsers: User[] = [];
  isSearchingPossiblesUsers: boolean = false;
  isANewUser: boolean = true;

  servicesList: ServiceSelection[] = [];
  checkedServices: number[] = [];

  isProcessing: boolean = false;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private translationService: TranslationService,
    private formBuilder: FormBuilder,
    private organizationService: OrganizationService,
    private screenService: ScreenService
  ) {
    this.createEmployeeForm = this.formBuilder.group({
        username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        names: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
        email: [null, [Validators.required, Validators.email, Validators.maxLength(100)]],
        password: ['123456'],
        confirm_password: ['123456', [Validators.required]],
        country: ['CM']
      });

    this.createEmployeeForm.addControl('phone_number', new FormControl(null,
      Validators.compose([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(18),
        PhoneValidator.validCountryPhone(this.createEmployeeForm.controls.country)
      ])));
  }

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
    this.modal.addCustomClass("nsm-centered");
    this.modal.onOpenFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.servicesList = formatNewServicesGroup(this.data.services ?? [], this.data.allServices ?? []);
    });
    this.modal.onAnyCloseEventFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.modal.removeData();
      this.selectedUser = null;
      this.createEmployeeForm.reset();
      this.possiblesUsers = [];
      this.isSearchingPossiblesUsers = false;
      this.checkedServices = [];
      this.servicesList = [];
      this.formIsSubmitted = false;
    });
  }

  get hasData()
  {
    return this.modal !== null && this.modal.hasData();
  }

  get data()
  {
    return this.hasData ? this.modal.getData() : null;
  }

  get formControls()
  {
    return this.createEmployeeForm.controls;
  }

  get formValues()
  {
    return this.createEmployeeForm.value;
  }

  getAUserNames(user: any){
    return (user.names && user.names.trim() !== '') ? user.names : '';
  }

  inputStatusClassName(formControlName: string){
    let result = '';
    let control = this.formControls[formControlName];
    if(control){
      result = control.errors ? 'has-error' : 'has-success';
    }
    else{
      result = ''
    }

    return 'col-6 form-group has-feedback ' + (this.formIsSubmitted ? result : '');
  }

  label(item: any){
    return this.translationService.getCurrentLang() === 'fr' ? item?.label : item?.label_en;
  }

  searchForPossiblesUsers(){
    this.isSearchingPossiblesUsers = false;
    if(this.identifier.query !== ''){
      this.isSearchingPossiblesUsers = true;
      this.organizationService.searchForAnUser(this.identifierKey, this.identifier.query)
        .then((res: any) =>{
          console.log(res);
          this.possiblesUsers = res;
          this.isSearchingPossiblesUsers = false;
        })
        .catch((err) =>{
          console.error(err);
        });
    }
  }

  onCreateEmployee(){
    this.isProcessing = true;

    let newUser: User ={
      names: this.formControls.names.value,
      email: this.formControls.email.value,
      username: this.formControls.username.value,
      phone_number: this.formControls.phone_number.value
    }
    let employee: NewEmployee = {
      organization_id: this.data.organization_id as number,
      services: this.checkedServices,
      user: this.isANewUser ? newUser : undefined,
      service_provider_id: this.selectedUser?.service_provider_id
    };

    this.organizationService.registerNewEmployee(employee)
      .then((res) =>{
        this.screenService.showSuccessToast('L\'employé(e) a été créé(e) avec succès !');
        this.isProcessing = false;
        this.close();
      })
      .catch((err) =>{
        console.error(err);
        this.screenService.showErrorToast('Une erreur s\'est produite lors de la création de l\'employé(e) ! Veuillez réessayer !');
        this.isProcessing = false;
      })
  }

  close()
  {
    this.modal.close();
  }

  onSelectUser(user: any){
    this.isANewUser = false;
    this.syncForm(user);
    this.possiblesUsers = [];
    this.isSearchingPossiblesUsers = false;
  }

  onSelectNewUser(){
    this.isANewUser = true;
    let otherKey = this.identifierKey === 'username' ? 'email' : 'username';
    let user: User = {
      [this.identifierKey]: this.identifier.query,
      [otherKey]: null,
    }

    this.syncForm(user);
  }

  syncForm(user: User){
    this.selectedUser = user;
    this.formControls.email.setValue(this.selectedUser?.email);
    this.formControls.username.setValue(this.selectedUser?.username);
    this.formControls.names.setValue(this.selectedUser?.names);
    this.formControls.phone_number.setValue(this.selectedUser?.email);

    if(user?.email){
      this.formControls.email.disable();
    }
    if(user?.username){
      this.formControls.username.disable();
    }
    if(user?.names){
      this.formControls.names.disable();
    }
    if(user?.phone_number){
      this.formControls.phone_number.disable();
    }
  }

  onIdentifierChange($event: any){
    this.searchForPossiblesUsers();
  }

  onIdentifierKeyChange($event: any){
    if($event.target.checked){
      this.identifierKey = $event.target.value;
      this.searchForPossiblesUsers();
    }
  }

  onServicesChange(checkedServices: number[]){
    this.checkedServices = checkedServices;
  }

}
