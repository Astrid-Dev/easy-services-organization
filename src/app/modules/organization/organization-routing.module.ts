import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IsOrganizationGuard} from "../../helpers/is-organization.guard";
import {OrganizationComponent} from "../../pages/organization/organization.component";
import {OrganizationInfosEditionComponent} from "../../pages/organization-infos-edition/organization-infos-edition.component";
import {OrganizationRegistrationComponent} from "../../pages/organization-registration/organization-registration.component";
import {CanCreateEnterpriseGuard} from "../../helpers/can-create-enterprise.guard";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'infos',
        component: OrganizationComponent,
        canActivate: [IsOrganizationGuard]
      },
      {
        path: 'edit',
        component: OrganizationInfosEditionComponent,
        canActivate: [IsOrganizationGuard]
      },
      {
        path: 'registration',
        component: OrganizationRegistrationComponent,
        canActivate: [CanCreateEnterpriseGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'infos'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
