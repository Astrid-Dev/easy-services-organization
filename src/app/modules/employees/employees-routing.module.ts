import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IsOrganizationGuard} from "../../helpers/is-organization.guard";
import {EmployeesComponent} from "../../pages/employees/employees.component";

const routes: Routes = [
  {
    path: '',
    canActivateChild: [IsOrganizationGuard],
    children: [
      {
        path: 'list',
        component: EmployeesComponent,
        canActivate: [IsOrganizationGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
