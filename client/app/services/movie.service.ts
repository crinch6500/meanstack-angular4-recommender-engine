import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class MovieService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getMovies(obj): Observable<any> {
	console.log('SERVICE CLASS RECORDS SEARCHKEY.......'+obj.searchkey);
    return this.http.get(`/api/movies/${obj.page}/${obj.limit}/${obj.searchkey}`).map(res => res.json());    
  }
  
  countMovies(): Observable<any> {
    return this.http.get('/api/movies/count').map(res => res.json());
  }
  
  getMovieDetail(movie_id): Observable<any> {
    return this.http.get(`/api/movie/${movie_id}`).map(res => res.json());    
  }
  
  getMovieWithSimilarGenres(genreId,movieId): Observable<any> {
	console.log('SERVICE CLASS  SIMILARWITHGENERID.......'+genreId);
	console.log('SERVICE CLASS  SIMILARWITHGENERID MOVIE ID.......'+movieId);
    return this.http.get(`/api/movieswithgenerid/${genreId}/${movieId}`).map(res => res.json());    
  }

}
