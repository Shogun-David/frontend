import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasPageComponent } from './reservas-page.component';

describe('ReservasPageComponent', () => {
  let component: ReservasPageComponent;
  let fixture: ComponentFixture<ReservasPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservasPageComponent]
    });
    fixture = TestBed.createComponent(ReservasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
