import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'; //TO GET PARAMETER 'PAGE' URL QUERY STRING. CRINCH
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { CatService } from '../services/cat.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.scss']
})
export class CatsComponent implements OnInit {

  cat = {};
  cats = [];
  isLoading = true;
  isEditing = false;
  
  
  //private sub: any; //TO GET PRAMETER FROM URL

  addCatForm: FormGroup;
  name = new FormControl('', Validators.required);
  age = new FormControl('', Validators.required);
  weight = new FormControl('', Validators.required);
  
  
  
  
//http://www.bentedder.com/create-a-pagination-component-in-angular-4/	
	total = 0;
	page = 1;
	limit = 5;
	searchkey = '';
  

  constructor(private catService: CatService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent,
              private route: ActivatedRoute) { }              //TO GET PARAMETER 'PAGE' URL QUERY STRING.CRINCH

  ngOnInit() {
  /*********START FOR CUSTOM PAGINATION WITH QUERY URL**********/
  /*
    this.sub = this.route
        .params
        .subscribe(params => {            
            this.page = params['page'];
    });
  */  
  /*********END FOR CUSTOM PAGINATION WITH QUERY URL**********/    	
    this.getCats();
    this.addCatForm = this.formBuilder.group({
      name: this.name,
      age: this.age,
      weight: this.weight
    });
  }


  getCats() {
	  console.log('client controller getcats func.......'+this.searchkey);    
	  var parameters = {};
	  parameters['page'] = this.page;
	  parameters['limit'] = this.limit;
	  if(this.searchkey){
		parameters['searchkey'] = this.searchkey;
	  }  
	  this.catService.getCats(parameters).subscribe(res => {
		  this.total = res.total;
		  this.cats = res.cats;
		  this.isLoading = false;
	  });
  }


/*****************START PAGINATION*******************/
  goToPage(n: number): void {
    this.page = n;
    this.getCats();
  }

  onNext(): void {
    this.page++;
    this.getCats();
  }

  onPrev(): void {
    this.page--;
    this.getCats();
}
/*****************END PAGINATION********************/


  addCat() {
    this.catService.addCat(this.addCatForm.value).subscribe(
      res => {
        const newCat = res.json();
        this.cats.push(newCat);
        this.addCatForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }


  enableEditing(cat) {
    this.isEditing = true;
    this.cat = cat;
  }

  cancelEditing() {
    this.isEditing = false;
    this.cat = {};
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the cats to reset the editing
    this.getCats();
  }

  editCat(cat) {
    this.catService.editCat(cat).subscribe(
      res => {
        this.isEditing = false;
        this.cat = cat;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }
  
	catSearch(searchKey){
		if(searchKey){
			this.searchkey = searchKey;
			this.getCats();
		}else{
			this.searchkey = '';
			this.getCats();
		}    
	}

  deleteCat(cat) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.catService.deleteCat(cat).subscribe(
        res => {
          const pos = this.cats.map(elem => elem._id).indexOf(cat._id);
          this.cats.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }
  
  

}
