import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';

import { UserService } from '../services/user.service';

import * as Promise from 'bluebird';


@Injectable()
export class AuthService {
  loggedIn = false;
  isAdmin = false;

  jwtHelper: JwtHelper = new JwtHelper();

  currentUser = { _id: '', username: '', role: '' };

  constructor(private userService: UserService, private router: Router) {              
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = this.decodeUserFromToken(token);
      this.setCurrentUser(decodedUser);
    }
  }

  login(emailAndPassword) {
    return this.userService.login(emailAndPassword).map(res => res.json()).map(
      res => {
        localStorage.setItem('token', res.token);
        const decodedUser = this.decodeUserFromToken(res.token);
        this.setCurrentUser(decodedUser);
        return this.loggedIn;
      }
    );
  }

  /*****************CRINCH, CUSTOM FUNCTION FOR LDAP AUTHENTICATION*********************/
  loginldap(usernameAndPassword) {
    return this.userService.loginldap(usernameAndPassword).map(res => res.json()).map(
      res => {
		if(res.status == 1){
			localStorage.setItem('token', res.token);
			const decodedUser = this.decodeUserFromToken(res.token);
			this.setCurrentUser(decodedUser);
			//return this.loggedIn;			
		}else if(res.status == 2){
			var registerObject = {};
			registerObject['username'] = res.user.UserName;
			registerObject['email'] = res.user.Email;
			registerObject['role'] = 'user';							
			this.userService.ldapRegister(registerObject).subscribe(								
			  res => {
				var str_token = res._body.split('"').join('');			  
				localStorage.setItem('token', str_token);
				const decodedUser = this.decodeUserFromToken(str_token);
				this.setCurrentUser(decodedUser);
				this.router.navigate(['/movies']);
			  }
			);
		}
      }
    );
	
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn = false;
    this.isAdmin = false;
    this.currentUser = { _id: '', username: '', role: '' };
    this.router.navigate(['/']);
  }

  decodeUserFromToken(token) {
    return this.jwtHelper.decodeToken(token).user;
  }

  setCurrentUser(decodedUser) {
    this.loggedIn = true;
    this.currentUser._id = decodedUser._id;
    this.currentUser.username = decodedUser.username;
    this.currentUser.role = decodedUser.role;
    decodedUser.role === 'admin' ? this.isAdmin = true : this.isAdmin = false;
    delete decodedUser.role;
  }

}
