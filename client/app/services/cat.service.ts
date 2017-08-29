import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class CatService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

/*
  getCats(): Observable<any> {
    return this.http.get('/api/cats').map(res => res.json());
  }
*/


  getCats(obj): Observable<any> {
	console.log('SERVICE CLASS PAGE NUMBER.......'+obj.page);
	console.log('SERVICE CLASS RECORDS LIMIT.......'+obj.limit);
	console.log('SERVICE CLASS RECORDS SEARCHKEY.......'+obj.searchkey);
    return this.http.get(`/api/cats/${obj.page}/${obj.limit}/${obj.searchkey}`).map(res => res.json());
    //return this.http.get(`/api/cats/${obj.page}/${obj.limit}`).map(res => res.json());
  }


  getCatsBySearch(obj): Observable<any> {
	console.log('SERVICE CLASS PAGE NUMBER.......'+obj.page);
	console.log('SERVICE CLASS RECORDS LIMIT.......'+obj.limit);
	console.log('SERVICE CLASS RECORDS SEARCHKEY.......'+obj.searchkey);
	//return this.http.get(`/api/cats/${obj.page}/${obj.limit}`).map(res => res.json());
    return this.http.get(`/api/cats/${obj.page}/${obj.limit}/${obj.searchkey}`).map(res => res.json());
  }

  countCats(): Observable<any> {
    return this.http.get('/api/cats/count').map(res => res.json());
  }

  addCat(cat): Observable<any> {
    return this.http.post('/api/cat', JSON.stringify(cat), this.options);
  }

  getCat(cat): Observable<any> {
    return this.http.get(`/api/cat/${cat._id}`).map(res => res.json());
  }

  editCat(cat): Observable<any> {
    return this.http.put(`/api/cat/${cat._id}`, JSON.stringify(cat), this.options);
  }

  deleteCat(cat): Observable<any> {
    return this.http.delete(`/api/cat/${cat._id}`, this.options);
  }

}
