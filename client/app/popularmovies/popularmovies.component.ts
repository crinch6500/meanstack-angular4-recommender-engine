import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'; //TO GET PARAMETER 'PAGE' URL QUERY STRING. CRINCH
import { Http } from '@angular/http';


import { PopularMoviesService } from '../services/popular-movies.service';  //CREATE IT
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-popular-movies',
  templateUrl: './popularmovies.component.html',
  styleUrls: ['./popularmovies.component.scss']
})
export class PopularMoviesComponent implements OnInit {

  
  popularmovies = [];
  isLoading = true;
  private exemptMovieId: any;
  private sub: any;
  


  constructor(private popularmovieService: PopularMoviesService,              
              private http: Http,
              private route: ActivatedRoute,
              public toast: ToastComponent) { 
              
				this.sub = this.route
					.params
					.subscribe(params => {            						
						//this.getPopularMovie(params['id']);
						this.exemptMovieId = params['id'];
				});				
              
  }

  ngOnInit() {
    this.getPopularMovies();
  }

  getPopularMovies() {
  
	  console.log('client controller popular movies func.......'+this.exemptMovieId);    
	  var parameters = {};
	  parameters['exemptMovieId'] = this.exemptMovieId;
	  this.popularmovieService.getPopularMovies(parameters).subscribe(res => {		  
		  this.popularmovies = res.popularmovies;
		  this.isLoading = false;
	  });    
  }
  
}
