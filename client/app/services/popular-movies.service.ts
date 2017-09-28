import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class PopularMoviesService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  
  getPopularMovies(obj): Observable<any> {
	console.log('SERVICE CLASS POPULAR MOVIES EXMPTED MOVIE ID.......'+obj.exemptMovieId);
    return this.http.get(`/api/popularmovies/${obj.exemptMovieId}`).map(res => res.json());    
  }

  updatePopularity(obj): Observable<any> {
	console.log('SERVICE CLASS POPULARITY UPDATE movie ID.......'+obj.movie);
	console.log('SERVICE CLASS POPULARITY UPDATE MOVIE rating.......'+obj.rating);
    return this.http.get(`/api/popularity/${obj.movie}/${obj.rating}`).map(res => res.json());    
  }
  
  

}
