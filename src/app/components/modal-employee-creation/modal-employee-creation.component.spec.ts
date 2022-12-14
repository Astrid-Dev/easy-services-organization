import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEmployeeCreationComponent } from './modal-employee-creation.component';

describe('ModalEmployeeCreationComponent', () => {
  let component: ModalEmployeeCreationComponent;
  let fixture: ComponentFixture<ModalEmployeeCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEmployeeCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEmployeeCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
