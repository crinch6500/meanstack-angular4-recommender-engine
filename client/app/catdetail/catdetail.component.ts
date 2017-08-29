import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'; //TO GET PARAMETER 'PAGE' URL QUERY STRING. CRINCH
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { CatService } from '../services/cat.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-cat-detail',
  templateUrl: './catdetail.component.html',
  styleUrls: ['./catdetail.component.scss']
})
export class CatDetailComponent {

  cat = {};  
  isLoading = true;
  isEditing = false;
  
  
  

  constructor(private catService: CatService,              
              private http: Http,
              public toast: ToastComponent) { }              //TO GET PARAMETER 'PAGE' URL QUERY STRING.CRINCH



  getCat(cat) {	  
	  this.catService.getCat(cat).subscribe(res => {
		  this.cat = res.cat;
		  this.isLoading = false;
	  });
  }


}
