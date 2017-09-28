import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'; //TO GET PARAMETER 'PAGE' URL QUERY STRING. CRINCH
import { Http } from '@angular/http';
/*import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';*/

import { MovieService } from '../services/movie.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  movie = {};
  movies = [];
  isLoading = true;
  isEditing = false;
  
	total = 0;
	page = 1;
	limit = 5;
	searchkey = '';
  

  constructor(private movieService: MovieService,              
              private http: Http,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getMovies();
  }

  getMovies() {
  
	  console.log('client controller getMovies func.......'+this.searchkey);    
	  var parameters = {};
	  parameters['page'] = this.page;
	  parameters['limit'] = this.limit;
	  if(this.searchkey){
		parameters['searchkey'] = this.searchkey;
	  }else{
		parameters['searchkey'] = 'empty';
	  }  
	  this.movieService.getMovies(parameters).subscribe(res => {
		  this.total = res.total;
		  this.movies = res.movies;
		  this.isLoading = false;
	  });
  }
  
/*****************START PAGINATION*******************/
  goToPage(n: number): void {
    this.page = n;
    this.getMovies();
  }

  onNext(): void {
    this.page++;
    this.getMovies();
  }

  onPrev(): void {
    this.page--;
    this.getMovies();
  }
/*****************END PAGINATION********************/
  
	movieSearch(searchKey){	
		if(searchKey){
		this.page = 1;
			this.searchkey = searchKey;
			this.getMovies();
		}else{
			this.searchkey = '';
			this.getMovies();
		}    
	}
  

}
