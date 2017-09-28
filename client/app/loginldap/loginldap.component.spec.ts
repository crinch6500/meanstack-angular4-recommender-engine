import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LoginldapComponent } from './loginldap.component';

describe('LoginldapComponent', () => {
  let component: LoginldapComponent;
  let fixture: ComponentFixture<LoginldapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginldapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginldapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the string "LoginLDAP" in h4', () => {
    const el = fixture.debugElement.query(By.css('h4')).nativeElement;
    expect(el.textContent).toContain('Loginldap');
  });*/
});
