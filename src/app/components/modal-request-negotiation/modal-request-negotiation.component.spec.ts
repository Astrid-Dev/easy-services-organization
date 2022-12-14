import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRequestNegociationComponent } from './modal-request-negotiation.component';

describe('ModalRequestNegociationComponent', () => {
  let component: ModalRequestNegociationComponent;
  let fixture: ComponentFixture<ModalRequestNegociationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRequestNegociationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRequestNegociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
