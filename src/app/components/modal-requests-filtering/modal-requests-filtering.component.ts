import {Component, EventEmitter, Output} from '@angular/core';
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {TranslationService} from "../../services/translation.service";
import {Filter, OrderDirection, OrderType, State} from "../../models/Filter";
import {getARequestStateLabel, getEnumValues} from "../../helpers/helpers.functions";

const MODAL_ID = 'requestsFiltering';

@Component({
  selector: 'app-modal-requests-filtering',
  templateUrl: './modal-requests-filtering.component.html',
  styleUrls: ['./modal-requests-filtering.component.scss']
})
export class ModalRequestsFilteringComponent {

  @Output('onApply') submitEvent: EventEmitter<Filter> = new EventEmitter<Filter>();

  modal: any = null;

  checkedServices: number[] = [];
  filter!: Filter;

  states: ({label: string, value: State, isChecked: boolean}[]) = [];
  orderTypes = [
    {
      label: 'ENQUIRYFILTERING.INTERVENTIONDATE',
      value: OrderType.INTERVENTION_DATE2
    },
    {
      label: 'ENQUIRYFILTERING.CREATIONDATE',
      value: OrderType.CREATION_DATE
    }
  ];
  orderDirections = [
    {
      label: 'ENQUIRYFILTERING.ASCENDING',
      value: OrderDirection.ASCENDANT
    },
    {
      label: 'ENQUIRYFILTERING.DESCENDING',
      value: OrderDirection.DESCENDANT
    }
  ];

  checkAllStates: boolean = true;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private translationService: TranslationService,
  ) {

  }

  get hasData()
  {
    return this.modal !== null && this.modal.hasData();
  }

  get data()
  {
    return this.hasData ? this.modal.getData() : null;
  }

  label(item: any){
    return this.translationService.getCurrentLang() === 'fr' ? item?.label : item?.label_en;
  }

  getStateLabel(state: State){
    return this.translationService.getValueOf(getARequestStateLabel(state));
  }

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
    this.modal.addCustomClass("nsm-centered");
    this.modal.onOpenFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      console.log(this.data);
      this.filter = this.data.filter;
      let checkedStates: number[] = this.filter.states !== '' ? this.filter.states.split(',').map(elt => parseInt(elt)) : [];
      getEnumValues(State).forEach((elt, index) =>{
        this.states.push({
          label: this.getStateLabel(elt),
          value: elt,
          isChecked: (this.filter.states === '') ? true : checkedStates.includes(elt)
        });
      });

      this.checkAllStates = (this.states.length === checkedStates.length || checkedStates.length === 0);
    });
    this.modal.onAnyCloseEventFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.modal.removeData();
      this.states = [];
      this.checkAllStates = false;
      this.checkedServices = [];
    });
  }

  onOrderTypeChange($event: any){
    this.filter = {
      ...this.filter,
      order_by: $event.target.value
    }
  }

  onOrderDirectionChange($event: any){
    this.filter = {
      ...this.filter,
      order_direction: $event.target.value
    }
  }

  onServicesChange(services: number[]){
    this.checkedServices = services;
    this.filter = {
      ...this.filter,
      services: this.checkedServices.length === this.data.possiblesServices ? [] : this.checkedServices
    }
  }

  onStatesChange(isForAll: boolean = false, index: number = 0){
    if(!isForAll){
      let temp = this.states.filter((elt, i) => (index === i) ? !elt.isChecked : elt.isChecked)
        .map((elt) => elt.value);

      this.checkAllStates = (temp.length === this.states.length) || (temp.length === 0);
      if(this.checkAllStates){
        this.onStatesChange(true);
      }
      else{
        this.filter = {
          ...this.filter,
          states: temp.join(',')
        }
      }
    }
    else{
      this.checkAllStates = true;
      this.states.forEach((elt, index, array) =>{
        array[index] = {
          ...elt,
          isChecked: true
        }
      });

      this.filter = {
        ...this.filter,
        states: ''
      }
    }

    console.log(this.filter);
  }

  onApply(shouldClear: boolean = false) {
    if(shouldClear){
      this.filter = this.data.defaultFilter;
    }

    this.submitEvent.emit(this.filter);
    this.close();
  }

  close()
  {
    this.modal.close();
  }

}
