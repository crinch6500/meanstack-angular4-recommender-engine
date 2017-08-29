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
  //moviesWithJaccard = [];
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
		  //this.moviesWithSameGenres = this.moviesWithSameGenreId(res.movie.genre_ids);
		  this.moviesWithSameGenreId(res.movie.genre_ids,movieId);
		  //this.myRatedMovies();
		  //this.usersWhoRatedMovies();
		  //this.jaccardMovies();
		  this.jaccardMoviesToDisplay();
		  this.isLoading = false;
	  });	  
  }
  
  moviesWithSameGenreId(genreStr,movieId)
  {
	console.log('GENRE IDS OF CURRENT MOVIE............'+genreStr);	
	var genreIds = genreStr.split(',');
	console.log('GENRE IDS OF CURRENT MOVIE............'+genreIds[0]);		
	this.movieService.getMovieWithSimilarGenres(genreIds[0],movieId).subscribe(res => {		  
		this.moviesWithSameGenres = res.movieswithsimilargenres;
		//console.log(this.moviesWithSameGenres);		
	});	  	
  }
  
  myRatedMovies()
  {
	var parameters = {};
	console.log('MY RATED MOVIES (JACCARD)............'+ this.auth.currentUser._id);		
	parameters['user'] = this.auth.currentUser._id;
	this.userMovieRatingService.myRatedMovies(parameters).subscribe(res => {		  
		//return res.myratedmovies;
		this.myMovies = res.myratedmovies;
		console.log(res.myratedmovies);		
	});	  	
  }
  
  usersWhoRatedMovies()
  {
	
	console.log('USER WHO RATED MOVIES (JACCARD)............');			
	this.userMovieRatingService.userWhoRatedMovies().subscribe(res => {		  
		//return res.userswhoratedmovies;
		this.usersRatedMovies = res.userswhoratedmovies;
		console.log(res.userswhoratedmovies);		
	});	  	
  }
  
  
  jaccardMoviesToDisplay()
  {
	var parameters = {};  
	parameters['user'] = this.auth.currentUser._id;
	this.userMovieRatingService.jaccardMovies(parameters).subscribe(res => {		  
		console.log(res);		
		console.log('WORKIGN ON IT........TODAY');		
	});	  		
  }
  
  
  /*
  * jaccardMovies, it is old function, that executes service function inside service functions.
  */  
  jaccardMovies()
  {
	var parameters = {};  
	var csvContent = "";
	parameters['user'] = this.auth.currentUser._id;
	this.userMovieRatingService.myRatedMovies(parameters).subscribe(res => {		  
		this.myMovies = res.myratedmovies;		
		this.userMovieRatingService.userWhoRatedMovies().subscribe(res => {		  
			this.usersRatedMovies = res.userswhoratedmovies;
			console.log(this.usersRatedMovies);		
			console.log(this.myMovies);
			
			var exemtedMovies = [];
			var newExemtedMovies = []
			newExemtedMovies.push('5968ca0726eac3841a8b45d3');
			for (let movie of this.myMovies) {                      //CRINCH, WHAT IF THERE ARE NO MY MOVIES AND SENT EMPTY ARRAY
				exemtedMovies.push(movie.movie);
				//exemtedMovies.push(new ObjectId(movie.movie));
			}			
			console.log(exemtedMovies);
			
			for (let usersWhoRated of this.usersRatedMovies) {
				//var csvContent = "";
				console.log(usersWhoRated._id);
				this.userMovieRatingService.moviesRatedByUsers(exemtedMovies,usersWhoRated._id).subscribe(res => {		  
					console.log(res.moviesratedbyusers);
					console.log(res.moviesratedbyusers.length);
					if(res.moviesratedbyusers.length > 0){
						for (var i = 0; i < res.moviesratedbyusers.length; i++) {
						  console.log(res.moviesratedbyusers[i]._id);						  						  
						  csvContent+=res.moviesratedbyusers[i]._id + ",";
						}						
					}
					console.log('TOTAL MOVIES...........'+csvContent.trim());
				});	  					
			}			
		});	  					
	});	  	
	//console.log('TOTAL MOVIES...........'+csvContent.trim());
  }

  
/*
    public function getSimilarMoviesUsingJaccardPython($movieId)
    {
        $myRatedMovies = DB::table('user_ratings')->select('movie_id')->where('user_id',Auth::user()->id)->get();
        $myRatedMoviesArr = array();
        if($myRatedMovies)
        {
            foreach($myRatedMovies as $myRateMovie)
            {
                $myRatedMoviesArr[] = $myRateMovie->movie_id;
            }
            
        }
        $usersWhoRated = DB::table('user_ratings')->select('user_id')->groupBy('user_id')->get();

        $file = fopen('movies.csv', 'w');
        foreach($usersWhoRated as $userWhoRated)
        {
            $csvContent = "";            

            if($myRatedMovies)
            {
                $moviesRatedByUsers = DB::table('user_ratings')->select('movie_id')->where('user_id',$userWhoRated->user_id)->whereNotIn('movie_id',$myRatedMoviesArr)->orderBy('movie_id','asc')->get();
            }
            else
            {
                $moviesRatedByUsers = DB::table('user_ratings')->select('movie_id')->where('user_id',$userWhoRated->user_id)->orderBy('movie_id','asc')->get();
            }
            foreach($moviesRatedByUsers as $movieRated)
            {
                $csvContent .= $movieRated->movie_id . "," ;
            }
            $csvContent = rtrim ($csvContent, ",");
            $csvContent .= PHP_EOL;
            fwrite($file, $csvContent);
        }
        fclose($file);        
        $output = shell_exec("python jaccard.py '".$movieId."'");
        
        $recommendedMovies = str_replace("[", "",$output);
        $recommendedMovies = str_replace("]", "",$recommendedMovies);
        $recommendedMovies = str_replace("'", "",$recommendedMovies);
        $recom = explode(",", $recommendedMovies);
        $recomendedMoviesForUser = Movies::whereIn('id', $recom )->limit(5)->get();  //Movies::whereIn('id',$recommendedMovies)->get();
        if($recomendedMoviesForUser->count())
        {
            return $recomendedMoviesForUser;
        }
        else
        {
            return false;            
        }
    }
*/  
  
  
}
