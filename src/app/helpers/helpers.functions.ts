import {State} from "../models/Filter";
import {environment} from "../../environments/environment";
import {Service, ServiceSelection} from "../models/Service";

export const workHoursList = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

export const MAX_DAYS_TO_ENQUIRY = 30;
export const ONE_MINUTE_IN_MILLISECONDS = 60 * 1000;
export const ONE_HOUR_IN_MILLISECONDS = 60 * ONE_MINUTE_IN_MILLISECONDS;
export const ONE_DAY_IN_MILLISECONDS = 24 * ONE_HOUR_IN_MILLISECONDS;
export const ONE_WEEK_IN_MILLISECONDS = 7 * ONE_DAY_IN_MILLISECONDS;

export function parseDateToISOFormat(date: Date){
  let z = date.getTimezoneOffset() * 60 * 1000;
  let localDate = new Date(date.getTime() - z);

  return localDate.toISOString().slice(0, 19);
}

export function printReadableDate(date: Date, lang: string, printMonth: boolean = false, printHours: boolean = false){
  const englishDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const frenchDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const englishMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const frenchMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'];

  const days = lang === 'fr' ? frenchDays : englishDays;
  const months = lang === 'fr' ? frenchMonths : englishMonths;

  const hours = (lang === 'fr' ? ' à ' : ' at ') + (date.toLocaleTimeString());

  return printMonth ? (days[date.getDay()] + ', ' + date.getDate() + ' '+ months[date.getMonth()] + ' '+ date.getFullYear() + (printHours ? hours : '')) : (days[date.getDay()] + ', '+ date.toLocaleDateString());
}

export function printReadableDateComparedToDelay(date: Date, lang: string){
  let currentTime = new Date().getTime();
  let incomingTime = date.getTime();
  let currentDate = new Date().getDate();
  let incomingDate = date.getDate();
  let result = printReadableDate(date, lang, true, true) as string;

  if(incomingTime <= currentTime){
    if(incomingTime >= (currentTime - ONE_MINUTE_IN_MILLISECONDS)){
      result = lang === 'fr' ? 'Maintenant' : 'Just now';
    }
    else if(incomingTime > (currentTime - ONE_HOUR_IN_MILLISECONDS)){
      let minutes = Math.floor(((currentTime - incomingTime) / ONE_MINUTE_IN_MILLISECONDS));
      result = lang === 'fr' ? `Il y'a ${minutes} min` : `${minutes} min ago`;
    }
    else if(incomingTime > (currentTime - ONE_DAY_IN_MILLISECONDS)){
      if(currentDate !== incomingDate){
        result = lang === 'fr' ? 'Hier' : 'Yesterday';
      }
      else{
        let hours = Math.floor(((currentTime - incomingTime) / ONE_HOUR_IN_MILLISECONDS));
        result = lang === 'fr' ? `Il y'a ${hours} heure${hours > 1 ? 's' : ''}` : `${hours} hour${hours > 1 ? 's' : ''} ago`;
      }
    }
    else if(incomingTime > (currentTime - (4 * ONE_DAY_IN_MILLISECONDS))){
      let days = Math.floor(((currentTime - incomingTime) / ONE_DAY_IN_MILLISECONDS));
      result = lang === 'fr' ? `Il y'a ${days} jour${days > 1 ? 's' : ''}` : `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  return result;

}

export function getAMinDateIntervention(returnInISOFormat: boolean = true){
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  let preferredDate = currentDate;

  if(currentHour >= Math.max(...workHoursList))
  {
    const temp = preferredDate.getTime() + (ONE_DAY_IN_MILLISECONDS);
    preferredDate = new Date(temp);
    preferredDate.setHours(Math.min(...workHoursList), 0, 0, 0);
  }
  else if(currentHour < Math.min(...workHoursList))
  {
    preferredDate.setHours(Math.min(...workHoursList), 0, 0, 0);
  }
  else{
    const temp = workHoursList.filter((elt) => elt > currentHour).sort((a, b) => a-b)[0];

    if(temp)
    {
      preferredDate.setHours(temp);
    }
  }

  return returnInISOFormat ? parseDateToISOFormat(preferredDate) : preferredDate;
}

export function getAMaxDateIntervention(returnInISOFormat: boolean = true)
{
  const currentDate = new Date();
  const temp = currentDate.getTime() + (MAX_DAYS_TO_ENQUIRY * ONE_DAY_IN_MILLISECONDS);
  const preferredDate = new Date(temp);
  preferredDate.setHours(Math.max(...workHoursList), 0, 0, 0);

  return returnInISOFormat ? parseDateToISOFormat(preferredDate) : preferredDate;
}

export function getEnumValues(enumObject: any){
  return Object.keys(enumObject)
    .filter(key => Number.isNaN(Number(key)))
    .map(key => enumObject[key]);
}

export function getARequestStateLabel(state: number){
  let result = ' ';
  switch(state){
    case State.CREATED: {
      result = 'ENQUIRYSTATES.CREATED';
      break;
    }
    case State.IN_ATTENDANCE_OF_CUSTOMER: {
      result = 'ENQUIRYSTATES.INATTENDANCEOFCUSTOMER';
      break;
    }
    case State.IN_ATTENDANCE_OF_PROVIDER: {
      result = 'ENQUIRYSTATES.INATTENDANCEOFPROVIDER';
      break;
    }
    case State.APPROVED: {
      result = 'ENQUIRYSTATES.APPROVED';
      break;
    }
    case State.RESOLVED: {
      result = 'ENQUIRYSTATES.RESOLVED';
      break;
    }
  }

  return result;
}

export function getARequestStateLabelForStatistics(state: number, author: string='client'){
  let result = '';
  switch(state){
    case State.CREATED: {
      result = author === 'client' ? 'REQUESTLEGEND.CANCELEDBYCUSTOMER' : 'REQUESTLEGEND.CANCELEDBYYOU';
      break;
    }
    case State.APPROVED: {
      result = 'REQUESTLEGEND.APPROVED';
      break;
    }
    case State.RESOLVED: {
      result = 'REQUESTLEGEND.RESOLVED';
      break;
    }
  }

  return result;
}

export function getARequestStateColor(state: number, selector: string | null = null, isForNotification: boolean = false){
  let result;
  switch(state){
    case State.CREATED: {
      result = isForNotification ? 'danger' : 'primary';
      break;
    }
    case State.IN_ATTENDANCE_OF_CUSTOMER: {
      result = result = isForNotification ? 'primary' : 'danger';
      break;
    }
    case State.IN_ATTENDANCE_OF_PROVIDER: {
      result = result = isForNotification ? 'primary' : 'danger';
      break;
    }
    case State.APPROVED: {
      result = 'warning';
      break;
    }
    case State.RESOLVED: {
      result = 'success';
      break;
    }
  }

  return selector ? (selector + '-' + result) : result;
}

export function getARequestStateNotificationImage(state: number){
  const basePath='assets/images/';
  const endingPath = '-removebg-preview.png';
  let result;
  switch(state){
    case State.CREATED: {
      result = 'cancel';
      break;
    }
    case State.IN_ATTENDANCE_OF_CUSTOMER: {
      result = 'offer2';
      break;
    }
    case State.IN_ATTENDANCE_OF_PROVIDER: {
      result = 'offer2';
      break;
    }
    case State.APPROVED: {
      result = 'approve';
      break;
    }
    case State.RESOLVED: {
      result = 'solve';
      break;
    }
  }

  return (basePath+result+endingPath);
}

export function getARequestStateNotificationTitle(state: number){
  let result = '';
  switch(state){
    case State.CREATED: {
      result = 'NOTIFICATIONS.ABANDONTITLE';
      break;
    }
    case State.IN_ATTENDANCE_OF_CUSTOMER: {
      result = 'NOTIFICATIONS.NEWOFFERTITLE';
      break;
    }
    case State.IN_ATTENDANCE_OF_PROVIDER: {
      result = 'NOTIFICATIONS.NEWOFFERTITLE';
      break;
    }
    case State.APPROVED: {
      result = 'NOTIFICATIONS.APPROVETITLE';
      break;
    }
    case State.RESOLVED: {
      result = 'NOTIFICATIONS.RESOLVEDTITLE';
      break;
    }
  }

  return result;
}

export function getARequestStateNotificationDescription(state: number, requestCode: string, isForProvider: boolean = true){
  let result: {key: string, shouldNotTranslate?: boolean}[] = [];
  switch(state){
    case State.CREATED: {
      result = [
        {
          key: isForProvider ? 'NOTIFICATIONS.THEREQUEST' : 'NOTIFICATIONS.YOURENQUIRY',
        },
        {
          key: '#'+requestCode,
          shouldNotTranslate: true
        },
        {
          key: isForProvider ? 'NOTIFICATIONS.ABANDONEDBYCUSTOMER' : 'NOTIFICATIONS.ABANDONEDBYPROVIDER',
        }
      ];
      break;
    }
    case State.IN_ATTENDANCE_OF_CUSTOMER: {
      result = [
        {
          key: 'NOTIFICATIONS.NEWOFFER1',
        },
        {
          key: '#'+requestCode,
          shouldNotTranslate: true
        }
      ];
      break;
    }
    case State.IN_ATTENDANCE_OF_PROVIDER: {
      result = [
        {
          key: 'NOTIFICATIONS.NEWOFFER2',
        },
        {
          key: '#'+requestCode,
          shouldNotTranslate: true
        }
      ];
      break;
    }
    case State.APPROVED: {
      result = [
        {
          key: isForProvider ? 'NOTIFICATIONS.PROVIDEROFFER ' : 'NOTIFICATIONS.USEROFFER',
        },
        {
          key: '#'+requestCode,
          shouldNotTranslate: true
        },
        {
          key: isForProvider ? 'NOTIFICATIONS.APPROVEDBYCUSTOMER' : 'NOTIFICATIONS.APPROVEDBYPROVIDER',
        }
      ];
      break;
    }
    case State.RESOLVED: {
      result = [
        {
          key: isForProvider ? 'NOTIFICATIONS.THEREQUEST' : 'NOTIFICATIONS.YOURENQUIRY',
        },
        {
          key: '#'+requestCode,
          shouldNotTranslate: true
        },
        {
          key: 'NOTIFICATIONS.RESOLVED',
        }
      ];
      break;
    }
  }

  return result;
}

export function getANumberAbbreviation(value: number){
  let result = '';
  const billion = Math.pow(10, 9);
  const million = Math.pow(10, 6);
  const kilo = Math.pow(10, 3);
  let printNumber = 0;

  if(value >= billion){
    printNumber = getANumberWithComma((value / billion), 2);
    result = 'Md';
  }
  else if(value >= million){
    printNumber = getANumberWithComma((value / million), 2);
    result = 'M';
  }
  else if(value >= kilo){
    printNumber = getANumberWithComma((value / kilo), 2);
    result = 'k';
  }
  else{
    printNumber = Math.floor(value);
  }

  return printNumber + result;

}

export function getANumberWithComma(value: number, numbersAfterComma: number){
  let result = Math.floor(value);
  let comma = 0;

  if(result === value){
    comma = value;
  }
  else{
    let temp: string | number = value - result;
    temp = temp.toString();
    comma = parseInt(temp.substring(0, numbersAfterComma-1));
  }

  return numbersAfterComma > 0 ? (result + comma) : value;
}

export function getARemoteResourcePath(short_path: string){
  return environment.BACKEND_URL + short_path;
}

export function getRandomInt(min: number, max: number, notConsidarate: number[] | null = null): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  let value = Math.floor(Math.random() * (max - min + 1)) + min;
  if(notConsidarate !== null && notConsidarate.includes(value))
  {
    return getRandomInt(min, max, notConsidarate);
  }
  else{
    return value;
  }

}

export function initializeServicesGroup(services: Service[]){
  let servicesList: ServiceSelection[] = [];

  services.filter((elt: Service) => elt.parent_id === null)
    .forEach((elt: Service) =>{
      servicesList.push({
        parent: {...elt, hasCheckedAllChildren: false, hasCheckedOneChild: false},
        children: services.filter((child: Service) => child.parent_id === elt.id)
          .map((child: Service) => {
            return {
              ...child,
              isChecked: false
            }
          })
      });
    });

  return servicesList;
}

export function formatNewServicesGroup(servicesIds: number[], allServices: Service[], checkAll: boolean = false){
  let result: ServiceSelection[] = [];

  allServices.forEach((elt) =>{
    if(elt.parent_id === null){
      let children = allServices.filter(child => child.parent_id === elt.id);
      let newChildren: (Service & {isChecked: boolean})[] = [];
      children.forEach((child) =>{
        if(servicesIds.includes(child.id)){
          newChildren.push({...child, isChecked: checkAll});
        }
      });
      if(newChildren.length > 0){
        result.push({
          parent: {
            ...elt,
            hasCheckedOneChild: checkAll,
            hasCheckedAllChildren: checkAll
          },
          children: newChildren
        });
      }
    }
  });

  return result;
}

export function formatNewServicesGroup2(servicesIds: number[], allServices: ServiceSelection[], checkAll: boolean = false){
  let result: ServiceSelection[] = []

  allServices.forEach((elt) =>{
    let newChildren: (Service & {isChecked: boolean})[] = elt.children.filter((child) =>{
      return servicesIds.includes(child.id);
    }).map(child => {
      return {...child, isChecked: checkAll}
    });

    if(newChildren.length > 0){
      result.push({
        parent: {...elt.parent, hasCheckedOneChild: checkAll, hasCheckedAllChildren: checkAll},
        children: newChildren
      })
    }
  });

  return result;
}

export function arraysAreEquals(array1: Array<any>, array2: Array<any>, sensitiveComparing: boolean = false){
  let result = true;
  if(array1.length !== array2.length){
    result = false;
  }
  else{
    if(sensitiveComparing){
      for(let i = 0; i < array1.length; i++){
        if(array1[i] !== array2[i]){
          result = false;
          break;
        }
      }
    }
    else {
      for (let i = 0; i < array1.length; i++) {
        if (!array2.includes(array1[i])) {
          result = false;
          break;
        }
      }
    }
  }

  return result;
}
