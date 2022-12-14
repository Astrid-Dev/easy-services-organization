import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesChecklistComponent } from './services-checklist.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('ServicesChecklistComponent', () => {
  let component: ServicesChecklistComponent;
  let fixture: ComponentFixture<ServicesChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesChecklistComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
