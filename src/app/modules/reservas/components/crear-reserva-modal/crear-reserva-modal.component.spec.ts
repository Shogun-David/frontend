import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearReservaModalComponent } from './crear-reserva-modal.component';

describe('CrearReservaModalComponent', () => {
  let component: CrearReservaModalComponent;
  let fixture: ComponentFixture<CrearReservaModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearReservaModalComponent]
    });
    fixture = TestBed.createComponent(CrearReservaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
