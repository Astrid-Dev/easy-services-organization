import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRequestsFilteringComponent } from './modal-requests-filtering.component';

describe('ModalRequestsFilteringComponent', () => {
  let component: ModalRequestsFilteringComponent;
  let fixture: ComponentFixture<ModalRequestsFilteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRequestsFilteringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRequestsFilteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
