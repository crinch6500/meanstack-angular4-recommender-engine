import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-login',
  templateUrl: './loginldap.component.html',
  styleUrls: ['./loginldap.component.scss']
})
export class LoginldapComponent implements OnInit {

  loginldapForm: FormGroup;
  username = new FormControl('', [Validators.required,
                                  Validators.minLength(2),
                                  Validators.maxLength(30),
                                  Validators.pattern('[a-zA-Z0-9._-\\s]*')]);
                                       
                                       
  password = new FormControl('', [Validators.required,
                                          Validators.minLength(6)]);

  constructor(private auth: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              public toast: ToastComponent) { }

  ngOnInit() {
    if (this.auth.loggedIn) {
      this.router.navigate(['/']);
    }
    this.loginldapForm = this.formBuilder.group({
      //email: this.email,
      username: this.username,
      password: this.password
    });
  }
  setClassUsername() {
    return { 'has-danger': !this.username.pristine && !this.username.valid };
  }  
  
  setClassPassword() {
    return { 'has-danger': !this.password.pristine && !this.password.valid };
  }

  loginldap() {	  
	this.auth.loginldap(this.loginldapForm.value).subscribe(
	  res => this.router.navigate(['/movies']),
	  error => this.toast.setMessage('invalid username or password!', 'danger')
	);
	
    
  }

}
