import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrganizationRoutingModule} from "./organization-routing.module";
import {SharedModule} from "../../helpers/shared.module";
import {OrganizationComponent} from "../../pages/organization/organization.component";
import {OrganizationRegistrationComponent} from "../../pages/organization-registration/organization-registration.component";
import {OrganizationLogoComponent} from "../../components/organization-logo/organization-logo.component";
import {OrganizationInfosEditionComponent} from "../../pages/organization-infos-edition/organization-infos-edition.component";

@NgModule({
  declarations: [
    OrganizationComponent,
    OrganizationRegistrationComponent,
    OrganizationLogoComponent,
    OrganizationInfosEditionComponent,
  ],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    SharedModule
  ]
})
export class OrganizationModule { }
