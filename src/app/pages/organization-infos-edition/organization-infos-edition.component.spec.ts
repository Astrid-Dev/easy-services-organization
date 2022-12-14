import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationInfosEditionComponent } from './organization-infos-edition.component';

describe('OrganizationInfosEditionComponent', () => {
  let component: OrganizationInfosEditionComponent;
  let fixture: ComponentFixture<OrganizationInfosEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationInfosEditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationInfosEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
