import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {RegisterComponent} from "./pages/register/register.component";
import {LoginComponent} from "./pages/login/login.component";
import {OrganizationComponent} from "./pages/organization/organization.component";
import {OrganizationRegistrationComponent} from "./pages/organization-registration/organization-registration.component";
import {CanCreateEnterpriseGuard} from "./helpers/can-create-enterprise.guard";
import {IsOrganizationGuard} from "./helpers/is-organization.guard";
import {IsSignedOutGuard} from "./helpers/is-signed-out.guard";
import {IsSignedInGuard} from "./helpers/is-signed-in.guard";
import {EmployeesComponent} from "./pages/employees/employees.component";
import {RequestsComponent} from "./pages/requests/requests.component";
import {OrganizationInfosEditionComponent} from "./pages/organization-infos-edition/organization-infos-edition.component";
import {RequestDetailsComponent} from "./pages/request-details/request-details.component";
import {CalendarComponent} from "./pages/calendar/calendar.component";

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [IsOrganizationGuard]
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [IsOrganizationGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [IsSignedOutGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [IsSignedOutGuard]
  },
  {
    path: 'organization',
    loadChildren: () => import('./modules/organization/organization.module').then( m => m.OrganizationModule)
  },
  {
    path: 'employees',
    loadChildren: () => import('./modules/employees/employees.module').then( m => m.EmployeesModule)
  },
  {
    path: 'requests',
    loadChildren: () => import('./modules/requests/requests.module').then( m => m.RequestsModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
