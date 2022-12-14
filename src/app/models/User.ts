import {Organization} from "./Organization";

export interface  User {
  id?: number;
  username?: string;
  email?: string;
  names?: string;
  phone_number?: string;
  password?: string;
  role?: UserRoles;
  password_confirmation?: string;
  created_at?: string;
  updated_at?: string;
  is_free?: boolean;
  service_provider_id?: number;
  organization?: Organization;
}

export enum UserRoles{
  SIMPLE_USER = ('SIMPLE_USER'),
  PROVIDER = ('PROVIDER'),
  ORGANIZATION = ('ORGANIZATION')
}
