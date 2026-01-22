import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioAdminPageComponent } from './calendario-admin-page.component';

describe('CalendarioAdminPageComponent', () => {
  let component: CalendarioAdminPageComponent;
  let fixture: ComponentFixture<CalendarioAdminPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarioAdminPageComponent]
    });
    fixture = TestBed.createComponent(CalendarioAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
