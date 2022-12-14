import { Component } from '@angular/core';
import {Enquiry} from "../../models/Enquiry";
import {Service} from "../../models/Service";
import {Employee} from "../../models/Employee";
import {User} from "../../models/User";
import {StepAnswer} from "../../models/Answer";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthStateService} from "../../services/auth-state.service";
import {TranslationService} from "../../services/translation.service";
import {ScreenService} from "../../services/screen.service";
import {OrganizationService} from "../../services/organization.service";
import {NgxSmartModalService} from "ngx-smart-modal";
import {State} from "../../models/Filter";
import {
  getARequestStateColor, getARequestStateLabel,
  printReadableDate,
  printReadableDateComparedToDelay
} from "../../helpers/helpers.functions";

const NEGOTIATION_MODAL_ID = 'requestNegotiation';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent {

  requestCode: string | null = null;
  requestData: Enquiry | null = null;
  requestAnswers: StepAnswer[] = [];
  requestService: Service | null = null;
  requestUser: User | null = null;
  requestProvider: Employee | null = null;
  request: Enquiry | null = null;
  user !: User;

  hasLoadedUserData: boolean | null = null;
  hasLoadedRequestData: boolean | null = null;

  isProcessing = false;
  currentAction: string = 'cancellation';

  negotiationModal: any = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authStateService: AuthStateService,
    private organizationService: OrganizationService,
    private translationService: TranslationService,
    private screenService: ScreenService,
    private ngxSmartModalService: NgxSmartModalService,
  ) {
    this.requestCode = this.activatedRoute.snapshot.paramMap.get('code');
    console.log(this.requestCode)
  }

  get arrayAnswers(){
    return this.requestAnswers.filter(elt => elt.is_array);
  }

  get simpleAnswers(){
    return this.requestAnswers.filter(elt => !elt.is_array);
  }

  get canCancel(){
    return this.requestData && this.requestData.state !== State.CREATED && this.requestData.state !== State.RESOLVED;
  }

  get canNegotiate(){
    return this.requestData && this.requestData.state !== State.APPROVED && this.requestData.state !== State.RESOLVED;
  }

  get canApprove(){
    return this.requestData && this.requestData.user_price && this.requestData.user_intervention_date
      && (this.requestData.state !== State.CREATED
      && this.requestData.state !== State.RESOLVED
      && this.requestData.state !== State.APPROVED);
  }

  get canChangeProvider(){
    return this.requestData && this.requestData.service_provider_id && this.requestProvider
      && (this.requestData.state !== State.CREATED
      && this.requestData.state !== State.RESOLVED);
  }

  get isLoading(){
    return (this.hasLoadedRequestData === null || this.hasLoadedUserData === null)
  }

  get hasFailedLoading(){
    return ((this.hasLoadedUserData === false && this.hasLoadedRequestData !== null) ||
      (this.hasLoadedRequestData === false && this.hasLoadedUserData !== null)
    );
  }

  label(item: any){
    return (this.translationService.getCurrentLang() === 'fr' ? item?.label : item?.label_en) ?? 'value';
  }

  value(item: any){
    return (this.translationService.getCurrentLang() === 'fr' ? item?.value : (item.value_en ?? item?.value)) ?? 'value';
  }

  printDate(date: Date | string | undefined, withDelay: boolean = false)
  {
    date = typeof date === 'string' ? new Date(date) : (date ?? new Date());
    return !withDelay ? printReadableDate(date, this.translationService.getCurrentLang(), true, true)
      : printReadableDateComparedToDelay(date, this.translationService.getCurrentLang());
  }

  requestStateColor(state: number | undefined){
    return getARequestStateColor(state ?? -1, 'text');
  }

  requestStateLabel(state: number | undefined){
    return this.translationService.getValueOf(getARequestStateLabel(state ?? -1));
  }

  getAllValuesOfArrayAnswer(values: any){
    return (values.map((elt: any) => this.value(elt))).join('&nbsp;|&nbsp;');
  }

  ngOnInit() {
    this.loadAll();
  }

  ngAfterViewInit(){
    this.negotiationModal = this.ngxSmartModalService.getModal(NEGOTIATION_MODAL_ID);
  }

  loadAll(){
    this.loadUserData();
    this.loadCurrentRequestData();
  }

  loadUserData()
  {
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
    })
  }

  loadCurrentRequestData(code: string = this.requestCode ?? ''){
    this.hasLoadedRequestData = null;
    this.organizationService.getARequestWithCode(code)
      .then((res: any) =>{
        console.log(res);
        let {service, answers, service_provider, user, ...data} = res;
        this.request = res;
        this.requestService = service;
        this.requestProvider = service_provider;
        this.requestUser = user;
        this.requestData = data;
        this.requestAnswers = JSON.parse(answers.content);

        this.hasLoadedRequestData = true;
      })
      .catch((err) =>{
        console.error(err);
        this.hasLoadedRequestData = false;
      });
  }

  askConfirmation(action: string){
    this.currentAction = action;
    let temp = action === 'cancellation' ? 'ENQUIRYACTIONS.ONABANDON2' : action === 'approbation' ? 'ENQUIRYACTIONS.ONAPPROVE2' : ' ';
    // this.screenService.presentAlert({
    //   mode: "ios",
    //   message: this.translationService.getValueOf(temp),
    //   buttons: [
    //     {
    //       text: this.translationService.getValueOf('SUBMIT.NO'),
    //       role: 'cancel'
    //     },
    //     {
    //       text: this.translationService.getValueOf('SUBMIT.YES'),
    //       handler: () =>{
    //         if(action === 'cancellation'){
    //           this.onCancelRequest();
    //         }
    //         else if (action === 'approbation'){
    //           this.onApproveRequest()
    //         }
    //       }
    //     }
    //   ]
    // });
  }

  onCancelRequest()
  {
    this.currentAction = 'cancellation';
    let newRequestData = {
      ...this.requestData,
      user_price: null,
      final_intervention_date: null,
      final_price: null,
      provider_intervention_date: null,
      provider_price: null,
      service_provider_id: null,
      state: State.CREATED
    }

    this.updateRequest(newRequestData);
  }

  updateRequest(newRequestData: any){
    this.isProcessing = true;
    this.organizationService.updateARequest(this.requestData?.id as number, newRequestData)
      .then((res: any) =>{
        console.log(res);
        this.requestData = {
          ...res.enquiry
        }
        if(this.currentAction === 'cancellation'){
          this.requestProvider = null;
        }
        this.isProcessing = false;
        let temp = this.currentAction === 'cancellation' ? 'ENQUIRYACTIONS.SUCCESSABANDON' : this.currentAction === 'approbation' ? 'ENQUIRYACTIONS.SUCCESSAPPROBATION' : 'ENQUIRYACTIONS.SUCCESSMAKEOFFER';
        this.screenService.showSuccessToast(this.translationService.getValueOf(temp));
      })
      .catch((err) =>{
        console.error(err);
        this.isProcessing = false;
        let temp = this.currentAction === 'cancellation' ? 'ENQUIRYACTIONS.ERRORABANDON' : this.currentAction === 'approbation' ? 'ENQUIRYACTIONS.ERRORAPPROBATION' : 'ENQUIRYACTIONS.MAKEOFFERERROR';
        this.screenService.showErrorToast(this.translationService.getValueOf(temp));
      })
  }

  onApproveRequest(){
    this.currentAction = 'approbation';
    let newRequestData = {
      ...this.requestData,
      // service_provider_id: this.user?.provider?.id,
      // final_intervention_date: this.requestData.user_intervention_date,
      // final_price: this.requestData.user_price,
      state: State.APPROVED
    }

    this.updateRequest(newRequestData);
  }

  async showNegotiationFormModal(){
    // const modal = await this.modalController.create({
    //   component: ServiceProviderRequestApprobationComponent,
    //   componentProps: {
    //     'requestData': this.request,
    //     'isForProvider': true
    //   }
    // });
    //
    // modal.onDidDismiss()
    //   .then((event) =>{
    //     console.log(event);
    //     if(event.data)
    //     {
    //       let temp = {
    //         ...this.requestData,
    //         service_provider_id: this.user?.provider?.id,
    //         state: State.IN_ATTENDANCE_OF_CUSTOMER,
    //         provider_intervention_date: event.data.date,
    //         provider_price: ""+event.data.price,
    //       };
    //
    //       this.updateRequest(temp);
    //     }
    //   })
    // return await modal.present();
  }

  async showMapLocationModal(){
    // const modal = await this.modalController.create({
    //   component: EnquiryMapLocationComponent
    // });
    //
    // modal.onDidDismiss()
    //   .then((event) =>{
    //
    //   })
    // return await modal.present();
  }

  openNegotiationModal(){
    this.negotiationModal.setData({
      requestData: this.requestData,
      requestProvider: this.requestProvider,
      organizationId: this.user?.organization?.id
    }, true);
    this.negotiationModal.open();
  }

  onNegotiationCompleted(newRequest: any){
    let {service, answers, service_provider, user, ...data} = newRequest;
    this.request = newRequest;
    this.requestService = service;
    this.requestProvider = service_provider;
    this.requestUser = user;
    this.requestData = data;
    this.requestAnswers = JSON.parse(answers.content);
  }

}
