import { Component, OnInit } from '@angular/core';  //CHECK IT AFTER COMMENTING, CRINCH
import { Router, ActivatedRoute, Params } from '@angular/router'; //TO GET PARAMETER 'PAGE' URL QUERY STRING. CRINCH
import { Http } from '@angular/http';

import { AuthService } from '../services/auth.service';  //TO GET LOGGED IN USER INFO
import { MovieService } from '../services/movie.service';
import { UserMovieRating } from '../services/user-movie-rating.service'; //CRINCH
import { ToastComponent } from '../shared/toast/toast.component';



@Component({
  selector: 'app-movie-detail',
  templateUrl: './moviedetail.component.html',
  styleUrls: ['./moviedetail.component.scss']
})

export class MovieDetailComponent {

  movie = {};
  moviesWithSameGenres = [];  
  moviesWithJaccard = [];
  myMovies = [];
  usersRatedMovies = [];  
  private sub: any; //TO GET PRAMETER FROM URL
  isLoading = true;
  isEditing = false;
  

  constructor(private movieService: MovieService,
			  private userMovieRatingService: UserMovieRating,
			  public auth: AuthService,
              private http: Http,
              public toast: ToastComponent,
              private route: ActivatedRoute) { 
              
				this.sub = this.route
					.params
					.subscribe(params => {            						
						this.getMovie(params['id']);
				});				
              }
              

  getMovie(movieId) {    
	  console.log('CLIENT MOVIE DEATAIL COMPONENT WITH GETMOVIE FUNC.......'+movieId);    	  
	  this.movieService.getMovieDetail(movieId).subscribe(res => {		  
		  this.movie = res.movie;
		  this.moviesWithSameGenreId(res.movie.genre_ids,movieId);
		  this.jaccardMoviesToDisplay(movieId);
		  this.isLoading = false;
	  });	  
  }
  
  moviesWithSameGenreId(genreStr,movieId)
  {	
	var genreIds = genreStr.split(',');	
	this.movieService.getMovieWithSimilarGenres(genreIds[0],movieId).subscribe(res => {		  
		this.moviesWithSameGenres = res.movieswithsimilargenres;		
	});	  	
  }
  
  myRatedMovies()
  {
	var parameters = {};	
	parameters['user'] = this.auth.currentUser._id;
	this.userMovieRatingService.myRatedMovies(parameters).subscribe(res => {		  		
		this.myMovies = res.myratedmovies;
		console.log(res.myratedmovies);		
	});	  	
  }
  
  usersWhoRatedMovies()
  {
	this.userMovieRatingService.userWhoRatedMovies().subscribe(res => {		  
		this.usersRatedMovies = res.userswhoratedmovies;
		console.log(res.userswhoratedmovies);		
	});	  	
  }
  
  
  jaccardMoviesToDisplay(movieId)
  {
	var parameters = {};  
	parameters['user'] = this.auth.currentUser._id;
	parameters['movie'] = movieId;
	this.userMovieRatingService.jaccardMovies(parameters).subscribe(res => {		  
		console.log(res);		
		this.moviesWithJaccard = res.jaccard_Movies;
	});		
  }
  
  
}
