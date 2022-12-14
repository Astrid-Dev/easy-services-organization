import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {TranslationService} from "../../services/translation.service";
import {OrganizationService} from "../../services/organization.service";
import {ScreenService} from "../../services/screen.service";
import {Employee} from "../../models/Employee";
import {parseDateToISOFormat, printReadableDate} from "../../helpers/helpers.functions";
import {User} from "../../models/User";
import {State} from "../../models/Filter";
import {Enquiry} from "../../models/Enquiry";

const MODAL_ID = 'requestNegotiation';

@Component({
  selector: 'app-modal-request-negotiation',
  templateUrl: './modal-request-negotiation.component.html',
  styleUrls: ['./modal-request-negotiation.component.scss']
})
export class ModalRequestNegotiationComponent {

  @ViewChild('identifier') identifier: any;

  @Output('onNegotiate') negotiationCompleted: EventEmitter<Enquiry> = new EventEmitter<Enquiry>();

  modal: any = null;
  makeAnOfferForm!: FormGroup;
  identifierKey: string = 'username';
  selectedProvider!: Employee | null;

  formIsSubmitted: boolean = false;
  possiblesProviders: (Employee & User)[] = [];
  hasLoadedPossiblesProviders: boolean | null = null;

  isProcessing: boolean = false;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private translationService: TranslationService,
    private formBuilder: FormBuilder,
    private organizationService: OrganizationService,
    private screenService: ScreenService
  ) {
    this.makeAnOfferForm = this.formBuilder.group({
      user_date: [null],
      user_price: [null],
      provider_date: [null, [Validators.required]],
      provider_price: [null, [Validators.required]],
    });

    this.makeAnOfferForm.controls.provider_date.valueChanges.subscribe((value: any) =>{console.log(value)});
  }

  get isLoading(){
    return this.hasLoadedPossiblesProviders === null;
  }

  get hasFailedLoading(){
    return this.hasLoadedPossiblesProviders === false;
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
    return this.makeAnOfferForm.controls;
  }

  get formValues()
  {
    return this.makeAnOfferForm.value;
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

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
    this.modal.addCustomClass("nsm-centered");
    this.modal.onOpenFinished.subscribe((mountModal: NgxSmartModalComponent) =>{

      this.loadPossibleProviders();

      this.formControls.user_date.setValue(printReadableDate(new Date(this.data?.requestData?.user_intervention_date), this.translationService.getCurrentLang(), true, true));
      this.formControls.user_price.setValue(this.data?.requestData?.user_intervention_date ?? '-');
      this.formControls.user_date.disable();
      this.formControls.user_date.disable();
      this.formControls.provider_date.setValue(parseDateToISOFormat(new Date(this.data.requestData.provider_intervention_date ?? this.data?.requestData?.user_intervention_date)));
      this.formControls.provider_price.setValue(this.data.requestData.provider_price ?? 0);
    });
    this.modal.onAnyCloseEventFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.modal.removeData();
      this.selectedProvider = null;
      this.makeAnOfferForm.reset();
      this.possiblesProviders = [];
      this.formIsSubmitted = false;
    });
  }

  loadPossibleProviders(){
    this.hasLoadedPossiblesProviders = null;
    this.organizationService.searchSomeProvidersForRequest(this.data.organizationId, this.data.requestData.id)
      .then((res: any) =>{
        this.possiblesProviders = res.map((elt: any) => {return {...elt.user, ...elt}});
        console.log(res);
        console.log(this.possiblesProviders)
        this.hasLoadedPossiblesProviders = true;
      })
      .catch((err) =>{
        console.error(err);
        this.hasLoadedPossiblesProviders = false;
      });
  }

  onNegotiate(){

    this.isProcessing = true;

    let data = {
      ...this.data.requestData,
      state: State.IN_ATTENDANCE_OF_CUSTOMER,
      provider_intervention_date: parseDateToISOFormat(new Date(this.formControls.provider_date.value)),
      provider_price: this.formValues.provider_price.value,
      final_intervention_date: null,
      final_price: null,
      service_provider_id: this.selectedProvider?.id,
    }

    this.organizationService.updateARequest(this.data.requestData.id, data)
      .then((res: any) =>{
        this.isProcessing = false;
        this.screenService.showSuccessToast('L\'offre a été faite avec succès !');
        this.negotiationCompleted.emit(res.enquiry);
        this.close();
      })
      .catch((err) =>{
        console.error(err);
        this.isProcessing = false;
        this.screenService.showErrorToast('Une erreur s\'est produite lors de la publication de l\'offre ! Veuillez réessayer !')
      });
  }

  close()
  {
    this.modal.close();
  }

  onSelectProvider(provider: Employee){
    this.selectedProvider = provider;
    console.log(this.selectedProvider);
  }


  onIdentifierChange($event: any){

  }

  onIdentifierKeyChange($event: any){
    if($event.target.checked){
      this.identifierKey = $event.target.value;
    }
  }

}
