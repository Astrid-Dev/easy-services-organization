export interface Service {
  id: number;
  label: string;
  label_en?: string;
  illustration: string;
  parent_id?: number | null;
  parent?: Service | null;
  created_at?: string;
  updated_at?: string;
  total?: number;
}

export interface ServiceStructure{
  parent: Service;
  children: Service[];
}

export interface ServiceSelection extends ServiceStructure{
  parent: Service & {hasCheckedOneChild: boolean, hasCheckedAllChildren: boolean};
  children: (Service & { isChecked: boolean })[];
}
