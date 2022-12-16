import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  notificationMenuIsExpanded: boolean = false;
  sideMenuIsHidden: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onExpandNotificationMenu(){
    this.notificationMenuIsExpanded = true;
  }

  onToggleSideMenu(){
    if(this.sideMenuIsHidden){
      document.body.classList.remove('sidebar-hide');
      document.getElementById('hamburgerButton')?.classList?.remove('is-active');
      document.getElementById('sideMenu')?.classList?.add('has-scroller');
    }
    else{
      document.body.classList.add('sidebar-hide');
      document.getElementById('hamburgerButton')?.classList?.add('is-active');
      document.getElementById('sideMenu')?.classList?.remove('has-scroller');
    }
    this.sideMenuIsHidden = !this.sideMenuIsHidden;
  }

}
