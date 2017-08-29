import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class MovieService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

/*
  getMovies(): Observable<any> {
    return this.http.get('/api/movies').map(res => res.json());
  }
*/
  
  getMovies(obj): Observable<any> {
	console.log('SERVICE CLASS PAGE NUMBER.......'+obj.page);
	console.log('SERVICE CLASS RECORDS LIMIT.......'+obj.limit);
	console.log('SERVICE CLASS RECORDS SEARCHKEY.......'+obj.searchkey);
    return this.http.get(`/api/movies/${obj.page}/${obj.limit}/${obj.searchkey}`).map(res => res.json());    
  }
  

  countMovies(): Observable<any> {
    return this.http.get('/api/movies/count').map(res => res.json());
  }
  
  getMovieDetail(movie_id): Observable<any> {
	console.log('SERVICE DETAIL FOR MOVIE ID.......'+movie_id);
    return this.http.get(`/api/movie/${movie_id}`).map(res => res.json());    
  }
  

  getMovieWithSimilarGenres(genreId,movieId): Observable<any> {
	console.log('SERVICE CLASS  SIMILARWITHGENERID.......'+genreId);
	console.log('SERVICE CLASS  SIMILARWITHGENERID MOVIE ID.......'+movieId);
    return this.http.get(`/api/movieswithgenerid/${genreId}/${movieId}`).map(res => res.json());    
  }

/*
  userWhoRatedMovies(): Observable<any> {		
    return this.http.get(`/api/userswhoratedmovies`).map(res => res.json());    
  }
*/

/*
  addMovie(movie): Observable<any> {
    return this.http.post('/api/movie', JSON.stringify(movie), this.options);
  }

  getMovie(movie): Observable<any> {
    return this.http.get(`/api/movie/${movie._id}`).map(res => res.json());
  }

  editMovie(movie): Observable<any> {
    return this.http.put(`/api/movie/${movie._id}`, JSON.stringify(movie), this.options);
  }

  deleteMovie(movie): Observable<any> {
    return this.http.delete(`/api/movie/${movie._id}`, this.options);
  }
*/  

}
