import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CatsComponent } from './cats/cats.component';
import { CatDetailComponent } from './catdetail/catdetail.component';  //CRINCH
import { MoviesComponent } from './movies/movies.component';
import { MovieDetailComponent } from './moviedetail/moviedetail.component';  //CRINCH
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LoginldapComponent } from './loginldap/loginldap.component';  //CRINCH, FOR LDAP LOGIN/AUTHENTICATION
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'cats', component: CatsComponent },
  { path: 'cat/:id', component: CatDetailComponent },
  //{ path: 'movies', component: MoviesComponent, canActivate: [AuthGuardAdmin] },   //CRINCH, ONLY FOR ADMIN USERS
  { path: 'movies', component: MoviesComponent, canActivate: [AuthGuardLogin] },   //CRINCH, ONLY FOR AUTHENTICATED USERS
  //{ path: 'movie/:id', component: MovieDetailComponent, canActivate: [AuthGuardAdmin] }, //ONLY FOR ADMIN USERS
  { path: 'movie/:id', component: MovieDetailComponent, canActivate: [AuthGuardLogin] }, //ONLY FOR AUTHENTICATED USERS
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'loginldap', component: LoginldapComponent },  //CRINCH, FOR LDAP LOGIN/AUTHENTICATION
  { path: 'logout', component: LogoutComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuardLogin] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardAdmin] },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class RoutingModule {}
