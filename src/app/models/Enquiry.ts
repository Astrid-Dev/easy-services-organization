import {Service} from "./Service";

export interface Enquiry {
  id?: number;
  code?: string;
  address: string;
  latitude: number;
  longitude: number;
  user_intervention_date: string;
  user_price?: string;
  provider_intervention_date?: string;
  provider_price?: string;
  final_intervention_date?: string;
  final_price?: string;
  state?: number;
  user_id: number;
  service_id: number;
  service_provider_id?: number | null;
  answers?: string;
  service?: Service;
  created_at?: string;
  updated_at?: string;
}
