import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { CatService } from './services/cat.service';
import { MovieService } from './services/movie.service';
import { UserMovieRating } from './services/user-movie-rating.service'; //CRINCH
import { PopularMoviesService } from './services/popular-movies.service'; //CRINCH
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AppComponent } from './app.component';
import { CatsComponent } from './cats/cats.component';
import { CatDetailComponent } from './catdetail/catdetail.component'; //CRINCH
import { MoviesComponent } from './movies/movies.component';
import { MovieDetailComponent } from './moviedetail/moviedetail.component'; //CRINCH
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LoginldapComponent } from './loginldap/loginldap.component'; //CRINCH, FOR LDAP LOGIN/AUTHENTICATION
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { PaginationComponent } from './pagination/pagination.component'; //CRINCH
import { RatingsComponent } from './ratings/ratings.component'; //CRINCH
import { PopularMoviesComponent } from './popularmovies/popularmovies.component'; //CRINCH
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    CatsComponent,
    CatDetailComponent,
    MoviesComponent,
    MovieDetailComponent,
    RatingsComponent,
    PopularMoviesComponent,
    AboutComponent,
    RegisterComponent,
    LoginComponent,
    LoginldapComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    PaginationComponent,
    NotFoundComponent
  ],
  imports: [
    RoutingModule,
    SharedModule
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    CatService,
    MovieService,
    UserService,
    UserMovieRating,
    PopularMoviesService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
