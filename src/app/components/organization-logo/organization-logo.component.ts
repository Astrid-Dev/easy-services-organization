import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-organization-logo',
  templateUrl: './organization-logo.component.html',
  styleUrls: ['./organization-logo.component.scss']
})
export class OrganizationLogoComponent implements OnInit{

  @Input() imagePath: string | null = null;
  @Input() name: string | null = '';
  @Input() styles: string | null = null;
  @Input() setMinHeight: boolean = false;

  constructor(){}

  get abbreviatedName(){
    let temp = this.name ? this.name.split(' ') : [''];
    let result = temp.map((elt: string) => elt.charAt(0)).join('').toUpperCase();

    return result.length > 3 ? result.substring(0, 3) : result;
  }

  get abbreviationFontSize(){
    let size = 5;
    size = size - (this.abbreviatedName.length - 1);

    return size + 'em';
  }

  get canShowImage() {
    return this.imagePath !== null;
  }

  ngOnInit(){

  }
}
