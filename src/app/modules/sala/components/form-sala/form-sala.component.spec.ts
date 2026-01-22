import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSalaComponent } from './form-sala.component';

describe('FormSalaComponent', () => {
  let component: FormSalaComponent;
  let fixture: ComponentFixture<FormSalaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormSalaComponent]
    });
    fixture = TestBed.createComponent(FormSalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
