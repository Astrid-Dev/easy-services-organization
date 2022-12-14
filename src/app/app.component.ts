import { Component } from '@angular/core';
import {TranslationService} from "./services/translation.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'impact-admin';
  currentPageUrl = "";

  pagesWithNonStaticsComponents = ["/login", '/register', '/organization/registration'];

  constructor(private router: Router, private translationService: TranslationService) {
    router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.currentPageUrl = event.url;
        }
      });
  }

  get canShowStaticsComponents()
  {
    return !this.pagesWithNonStaticsComponents.includes(this.currentPageUrl);
  }
}
