import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RequestsRoutingModule} from "./requests-routing.module";
import {SharedModule} from "../../helpers/shared.module";
import {RequestsComponent} from "../../pages/requests/requests.component";
import {RequestDetailsComponent} from "../../pages/request-details/request-details.component";
import {ModalRequestNegotiationComponent} from "../../components/modal-request-negotiation/modal-request-negotiation.component";
import {ModalRequestsFilteringComponent} from "../../components/modal-requests-filtering/modal-requests-filtering.component";



@NgModule({
    declarations: [
        RequestsComponent,
        RequestDetailsComponent,
        ModalRequestNegotiationComponent,
        ModalRequestsFilteringComponent
    ],
  imports: [
    CommonModule,
    RequestsRoutingModule,
    SharedModule
  ]
})
export class RequestsModule { }
