import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IsOrganizationGuard} from "../../helpers/is-organization.guard";
import {RequestsComponent} from "../../pages/requests/requests.component";
import {RequestDetailsComponent} from "../../pages/request-details/request-details.component";

const routes: Routes = [
  {
    path: '',
    canActivateChild: [IsOrganizationGuard],
    children: [
      {
        path: 'list',
        component: RequestsComponent,
      },
      {
        path: ':code',
        component: RequestDetailsComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestsRoutingModule {}
