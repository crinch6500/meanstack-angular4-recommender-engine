import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';  //TO GET LOGGED IN USER INFO
import { UserMovieRating } from '../services/user-movie-rating.service'; //CRINCH
//import { UserMovieRating } from '../services/user-movie-rating.service'; //CRINCH
import { PopularMoviesService } from '../services/popular-movies.service'; //CRINCH


import { Router, ActivatedRoute, Params } from '@angular/router'; //TO GET PARAMETER 'PAGE' URL QUERY STRING. CRINCH
import { Http } from '@angular/http';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-rating',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})

export class RatingsComponent implements OnInit  {

  rating = {};
  private sub: any; //TO GET PRAMETER FROM URL
  private movie_id: any;
  private user_id: any;  
  rating_star_counter = Array;

  constructor(private userMovieRatingService: UserMovieRating,
			  private popularMovieService: PopularMoviesService,	
			  public auth: AuthService,
			  private http: Http,
              public toast: ToastComponent,
              private route: ActivatedRoute) { }              //TO GET PARAMETER 'PAGE' URL QUERY STRING.CRINCH


  ngOnInit() {  
  /*********START FOR CUSTOM PAGINATION WITH QUERY URL**********/
  
    this.sub = this.route
        .params
        .subscribe(params => {            
            this.movie_id = params['id'];
    });
    this.user_id = this.auth.currentUser._id;
    console.log('THE CURRENT MOVIE ID .............:'+this.movie_id);
    console.log('THE CURRENT USER .............:'+this.auth.currentUser._id);
    this.getUserMovieRating();
  /*********END FOR CUSTOM PAGINATION WITH QUERY URL**********/    	
  }

 	submitUserRating(rateVal){
		console.log('RATING VALUE..........'+rateVal);
		var parameters = {};
		parameters['user'] = this.auth.currentUser._id;
		parameters['movie'] = this.movie_id;
		parameters['rating'] = rateVal;
 		
 		
 		/*
		this.userMovieRatingService.addMovieRating(parameters).subscribe(
		  res => {        
			this.toast.setMessage('Rating added successfully.', 'success');
		  },
		  error => console.log(error)
		);
		
		
		this.popularMovieService.updatePopularity(parameters).subscribe(
		  res => {        
			this.toast.setMessage('Popularity added successfully.', 'success');
		  },
		  error => console.log(error)
		);
		*/
		/*
		this.userMovieRatingService.addMovieRating(parameters).subscribe(
		  res => {        
			this.toast.setMessage('Rating added successfully.', 'success');
		  },
		  error => console.log(error)
		);
		
		this.popularMovieService.updatePopularity(parameters).subscribe(
		  res => {        
			this.toast.setMessage('Popularity added successfully.', 'success');
		  },
		  error => console.log(error)
		);
		*/
		
		this.userMovieRatingService.addMovieRating(parameters).subscribe(
		  res => {        
			//this.toast.setMessage('Rating added successfully.', 'success');
			//
				this.popularMovieService.updatePopularity(parameters).subscribe(
						  res => {        
							this.toast.setMessage('Rating and Popularity added successfully.', 'success');
						  },
						  error => console.log(error)
						);			
			//
		  },
		  error => console.log(error)
		);
		
		
		
		this.getUserMovieRating();				
	}
	
	getUserMovieRating()
	{
		console.log('THE CURRENT MOVIE ID ON LOAD .............:'+this.movie_id);
		console.log('THE CURRENT USER ON LOAD.............:'+this.auth.currentUser._id);	
		var parameters = {};
		parameters['user'] = this.auth.currentUser._id;
		parameters['movie'] = this.movie_id;				
		this.userMovieRatingService.getMovieRating(parameters).subscribe(res => {		  
			if(res.rating){this.rating = res.rating;}else{this.rating = this.rating;}		
		});
		
	}

}
