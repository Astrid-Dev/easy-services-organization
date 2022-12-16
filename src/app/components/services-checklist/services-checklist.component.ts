import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ServiceSelection} from "../../models/Service";
import {TranslationService} from "../../services/translation.service";

@Component({
  selector: 'app-services-checklist',
  templateUrl: './services-checklist.component.html',
  styleUrls: ['./services-checklist.component.scss']
})
export class ServicesChecklistComponent {

  @Input() servicesList: ServiceSelection[] = [];
  @Input() shouldCheckAtLeastOne: boolean = false;
  @Input() readOnly: boolean = false;
  @Output('onChange') checkedList: EventEmitter<number[]> = new EventEmitter<number[]>();

  currentAccordionItem: string = '';

  constructor(private translationService: TranslationService) {
  }

  get checkedServices(){
    let services: number[] = [];
    this.servicesList.forEach((elt) =>{
      services = services.concat(elt.children.filter(child => child.isChecked).map(s => s.id));
    });

    return services;
  }

  label(item: any){
    return this.translationService.getCurrentLang() === 'fr' ? item.label : item.label_en;
  }

  isCurrentAccordionItem(accordionItemName: string){
    return this.currentAccordionItem === accordionItemName;
  }

  categoryParentId(id: number){
    return 'categoryParent'+id;
  }

  onCheckAllChildrenServices(parentId: number){
    if(!this.readOnly){
      this.servicesList.forEach((elt, index, array) =>{
        if(elt.parent.id === parentId){
          let checkState = !elt.parent.hasCheckedAllChildren;
          let children = elt.children
            .map((child) =>{
              return {
                ...child,
                isChecked: checkState
              }
            });
          let checkedChildren = children.filter(child => child.isChecked);
          array[index] = {
            parent: {
              ...elt.parent,
              hasCheckedAllChildren: checkState,
              hasCheckedOneChild: checkedChildren.length > 0
            },
            children: children
          }
        }
      });

      this.checkedList.emit(this.checkedServices);
    }
  }

  onCheckOneChildService(parentId: number, serviceId: number){
    if(!this.readOnly){
      this.servicesList.forEach((elt, index, array) =>{
        if(elt.parent.id === parentId){
          let children = elt.children
            .map((child) =>{
              return {
                ...child,
                isChecked: child.id === serviceId ? (!child.isChecked) : child.isChecked
              }
            });
          let checkedChildren = children.filter(child => child.isChecked);
          array[index] = {
            parent: {
              ...elt.parent,
              hasCheckedAllChildren: checkedChildren.length === elt.children.length,
              hasCheckedOneChild: checkedChildren.length > 0
            },
            children: children
          }
        }
      });

      this.checkedList.emit(this.checkedServices);
    }
  }

  onAccordionChange(accordionItemName: string){
    this.currentAccordionItem = (this.currentAccordionItem === accordionItemName) ? '' : accordionItemName;
  }

}
