import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ManufacturerService } from '../../services/manufacturer/manufacturer.service'


@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.css']
})
export class ProductCategoriesComponent implements OnInit {
  cat_id;
  subcategories
  constructor(
    private route: ActivatedRoute,
    private ManufacturerService :ManufacturerService

  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.cat_id = params['id'];
      this.ManufacturerService.getsubcategory_list(this.cat_id).toPromise()
      .then(response =>{
        this.subcategories = response
        console.log(this.subcategories)
      })
    });
  }
  
  getSubSubCat(cat,subcat){

    console.log(cat,subcat)


  }

}
