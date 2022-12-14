import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {

  currentMenu: string | null = null;

  constructor(private router: Router) {

    router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          let segments = event.url.split('/');
          this.currentMenu = segments[1] ?? null;
        }
      });
  }

  isActiveMenu(menu: string)
  {
    return this.currentMenu === menu;
  }

  ngOnInit(): void {
  }

}
