import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EmployeesRoutingModule} from "./employees-routing.module";
import {SharedModule} from "../../helpers/shared.module";
import {EmployeesComponent} from "../../pages/employees/employees.component";
import {ModalEmployeeCreationComponent} from "../../components/modal-employee-creation/modal-employee-creation.component";



@NgModule({
  declarations: [
    EmployeesComponent,
    ModalEmployeeCreationComponent,
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    SharedModule
  ]
})
export class EmployeesModule { }
