import {Component, Input, OnInit} from '@angular/core';
import {Breadcrumb} from "../../models/Breadcrumb";
import {TranslationService} from "../../services/translation.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit{

  @Input() title !: string;
  @Input() breadcrumbs: Breadcrumb[] = [];

  constructor(
    private translationService: TranslationService,
    private titleService: Title
  ){}

  ngOnInit(){
    this.titleService.setTitle(this.translationService.getValueOf(this.title));
  }

}
