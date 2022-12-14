import {CommonModule, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslationService} from '../services/translation.service';
import {AuthService} from "../services/auth.service";
import {TokenService} from "../services/token.service";
import {AuthStateService} from "../services/auth-state.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";
import {AccordionModule} from "@syncfusion/ej2-angular-navigations";
import {DndDirective} from "../directives/dnd.directive";
import {AutocompleteLibModule} from "angular-ng-autocomplete";
import {NgxSmartModalModule} from "ngx-smart-modal";
import {MdlExpansionPanelModule} from "@angular-mdl/expansion-panel";
import {CategoryService} from "../services/category.service";
import {OrganizationService} from "../services/organization.service";
import {ScreenService} from "../services/screen.service";
import {HeaderComponent} from "../components/header/header.component";
import {LoadingContainerComponent} from "../components/loading-container/loading-container.component";
import {PageHeaderComponent} from "../components/page-header/page-header.component";
import {FooterComponent} from "../components/footer/footer.component";
import {SidemenuComponent} from "../components/sidemenu/sidemenu.component";
import {ServicesChecklistComponent} from "../components/services-checklist/services-checklist.component";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: false
    }),
    AccordionModule,
    AutocompleteLibModule,
    MdlExpansionPanelModule,
    NgxSmartModalModule.forRoot(),
    ToastrModule.forRoot(),
  ],
  declarations: [
    DndDirective,
    HeaderComponent,
    LoadingContainerComponent,
    PageHeaderComponent,
    FooterComponent,
    SidemenuComponent,
    ServicesChecklistComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    HttpClientModule,
    AccordionModule,
    DndDirective,
    AutocompleteLibModule,
    MdlExpansionPanelModule,
    HeaderComponent,
    LoadingContainerComponent,
    PageHeaderComponent,
    FooterComponent,
    SidemenuComponent,
    ServicesChecklistComponent,
    NgxSmartModalModule,
    ToastrModule,
    RouterModule
  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SharedModule,
      providers: [
        TranslationService,
        AuthService,
        TokenService,
        AuthStateService,
        CategoryService,
        OrganizationService,
        ScreenService
      ]
    };
  }
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
