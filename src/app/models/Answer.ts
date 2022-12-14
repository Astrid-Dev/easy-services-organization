export interface Answer {
  id: number;
  content: string;
  enquiry_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StepAnswer{
  label: string;
  label_en: string;
  value?: string;
  value_en?: string;
  values?: {
    value: string;
    value_en: string;
    unique_value: string;
  }[];
  is_array?: boolean;
}
