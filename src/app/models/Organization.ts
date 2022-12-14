import {Service} from "./Service";

export interface Organization {
  id?: number;
  name: string;
  code?: string;
  logo?: string;
  phone_number1: string;
  phone_number2?: string;
  email1: string;
  email2?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  country?: string;
  city?: string;
  address?: string;
  description?: string;
  description_en?: string;
  applications?: OrganizationApplication[];
  employees_number: number;
}

export interface OrganizationApplication{
  organization_id: number;
  service_id: number;
  service?: Service,
  organization?: Organization;
  created_at?: string;
  updated_at?: string;
}

