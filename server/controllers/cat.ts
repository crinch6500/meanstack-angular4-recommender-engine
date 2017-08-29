import Cat from '../models/cat';
import BaseCtrl from './base';

export default class CatCtrl extends BaseCtrl {
  model = Cat;
  
  
  /********START FOR PAGINATED LIKE CATS/1, CATS/2 WITH COUNT....*****************/
  getPaginated = (req, res) => {
  
		if(!req.params.page)
		{
			var page:number = 1;
		}else{
			var page:number = +req.params.page;
		}

		if(!req.params.limit)
		{
			var limit:number = 2;
		}else{
			var limit:number = +req.params.limit;  // + sign used to make it number, otherwise query return error to be limit must be a number
		}
		
		if(req.params.searchkey && req.params.searchkey!='undefined')
		{
			//var searchkey = new RegExp(req.params.searchkey, 'i');							
			//var search = {};
			//search['name'] = searchkey;			
			var toSearch = req.params.searchkey.split(" ").map(function(n) {
				return {
					name: new RegExp(n.trim(), 'i')
				};
			});			
			var search = {};
			search['$and'] = toSearch;
		}else{			
			var search = {};
		}
  
	this.model.find(search, null, null).count((err, count) => {	  	  
		this.model.find(search, null, null).skip((page-1)*limit).limit(limit).exec(function(err, docs) {
			if (err)
			  res.json(err);
			else
			  res.json({
			  "total": count,
				"cats": docs
			  });
		});
});		
  };
/********END FOR PAGINATED LIKE CATS/1, CATS/2 WITH COUNT....*****************/
    
  /********START FOR PAGINATED LIKE CATS/1, CATS/2 ....*****************/
/*  
  getPaginated = (req, res) => {
  console.log('SERVER CONTROLER.......'+req.params.page);
  
    if(!req.params.page)
    {
        var page = 1;
    }else{
        var page = req.params.page;
    }
    var per_page = 2;  
  
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    }).skip((page-1)*per_page).limit(per_page);
  };
*/  
  /********END FOR PAGINATED LIKE CATS/1, CATS/2 ....*****************/
  
  
  
  
  
  /********START FOR SIMPLE RECORDS LIST*****************/
/*  
  getPaginated = (req, res) => {
  
  
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    }).limit(10);
  };
*/  
  /********END FOR SIMPLE RECORDS LIST*****************/
}
