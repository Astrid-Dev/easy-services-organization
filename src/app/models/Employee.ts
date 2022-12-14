import {Service} from "./Service";
import {User} from "./User";

export interface Employee {
  id: number;
  user_id: number;
  applications?: EmployeeApplication[];
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeApplication{
  service_provider_id: number;
  service_id: number;
  service?: Service,
  provider?: Employee;
  created_at?: string;
  updated_at?: string;
}

export interface NewEmployee{
  organization_id: number;
  service_provider_id?: number;
  user?: User;
  services?: number[];
}
