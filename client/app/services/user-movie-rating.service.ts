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
    return this.http.get(`/api/ratings/${obj.user}/${obj.movie}/${obj.rating}`).map(res => res.json());
  }
  
  getMovieRating(obj): Observable<any> {
    return this.http.get(`/api/rating/${obj.user}/${obj.movie}`).map(res => res.json());
  }

  jaccardMovies(obj): Observable<any> {
    return this.http.get(`/api/jaccardmoviesnew/${obj.user}/${obj.movie}`).map(res => res.json());
  }

  /***THIS FUNCTION RELATES TO CLIENT MOVIDE DETAILED FILE 'jaccardMovies' **/
  myRatedMovies(obj): Observable<any> {
    return this.http.get(`/api/myratedmovies/${obj.user}`).map(res => res.json());
  }
  
  /***THIS FUNCTION RELATES TO CLIENT MOVIDE DETAILED FILE 'jaccardMovies' **/
  userWhoRatedMovies(): Observable<any> {		
    return this.http.get(`/api/userswhoratedmovies`).map(res => res.json());    
  }
  
  /***THIS FUNCTION RELATES TO CLIENT MOVIDE DETAILED FILE 'jaccardMovies' **/
  moviesRatedByUsers(movieArr,userId): Observable<any> {		
    return this.http.get(`/api/jaccardmovies/${movieArr}/${userId}`).map(res => res.json());    
  }
    
}
