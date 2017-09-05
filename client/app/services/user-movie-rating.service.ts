import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserMovieRating {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  addMovieRating(obj): Observable<any> {
	console.log('SERVICE CLASS USER.......'+obj.user);
	console.log('SERVICE CLASS MOVIE.......'+obj.movie);
	console.log('SERVICE CLASS RATING.......'+obj.rating);
    return this.http.get(`/api/ratings/${obj.user}/${obj.movie}/${obj.rating}`).map(res => res.json());
  }
  
  getMovieRating(obj): Observable<any> {
	console.log('SERVICE RATING CLASS GETMOVIERATING FUNC USER.......'+obj.user);
	console.log('SERVICE RTING CLASS GETMOVIERATING FUNC MOVIE.......'+obj.movie);	
    return this.http.get(`/api/rating/${obj.user}/${obj.movie}`).map(res => res.json());
  }


  jaccardMovies(obj): Observable<any> {
	console.log('SERVICE RATING CLASS GETMOVIERATING FUNC USER.......'+obj.user);	
    return this.http.get(`/api/jaccardmoviesnew/${obj.user}/${obj.movie}`).map(res => res.json());
  }



  /***THIS FUNCTION RELATES TO CLIENT MOVIDE DETAILED FILE 'jaccardMovies' **/
  myRatedMovies(obj): Observable<any> {
	console.log('SERVICE RATING CLASS GETMOVIERATING FUNC USER.......'+obj.user);
	console.log('SERVICE RTING CLASS GETMOVIERATING FUNC MOVIE.......'+obj.movie);	
    return this.http.get(`/api/myratedmovies/${obj.user}`).map(res => res.json());
  }
  
  /***THIS FUNCTION RELATES TO CLIENT MOVIDE DETAILED FILE 'jaccardMovies' **/
  userWhoRatedMovies(): Observable<any> {		
    return this.http.get(`/api/userswhoratedmovies`).map(res => res.json());    
  }
  
  /***THIS FUNCTION RELATES TO CLIENT MOVIDE DETAILED FILE 'jaccardMovies' **/
  moviesRatedByUsers(movieArr,userId): Observable<any> {		
  //moviesRatedByUsers(movieArr=[],userId): Observable<any> {		
  console.log('function moviesRatedByUsers............................JACCARD');
  console.log('EXEMPTED MOVIES............................'+movieArr);
  console.log('MOVIES OF USER............................'+userId);
    return this.http.get(`/api/jaccardmovies/${movieArr}/${userId}`).map(res => res.json());    
  }
  
  

}
