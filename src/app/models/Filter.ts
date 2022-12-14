export interface Filter {
  order_by: OrderType;
  order_direction: OrderDirection;
  states: string;
  services: number[];
}

export enum OrderType{
  INTERVENTION_DATE = ('user_intervention_date'),
  INTERVENTION_DATE2 = ('provider_intervention_date'),
  CREATION_DATE = ('created_at')
}

export enum OrderDirection{
  ASCENDANT = ('asc'),
  DESCENDANT = ('desc')
}

export enum State{
  CREATED,
  IN_ATTENDANCE_OF_CUSTOMER,
  IN_ATTENDANCE_OF_PROVIDER,
  APPROVED,
  RESOLVED
}

export enum Period{
  TODAY,
  ALL,
  CUSTOM
}

export interface NotificationsFilter{
  order_direction: OrderDirection;
  state: NotificationState;
  period: Period;
  starting_date?: string;
  ending_date?: string;
}

export enum NotificationState{
  READED,
  UNREADED,
  ALL
}

export interface Paginator{
  currentPage: number;
  totalPages: number;
  totalResultsPerPage: number;
  totalResults: number;
  currentPageStartingNumber: number;
  currentPageEndingNumber: number;
}

