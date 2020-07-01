import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ManufacturerService } from '../../services/manufacturer/manufacturer.service'



@Component({
  selector: 'app-product-subcategory',
  templateUrl: './product-subcategory.component.html',
  styleUrls: ['./product-subcategory.component.css']
})
export class ProductSubcategoryComponent implements OnInit {
  cat_id;
  subsubcategories;
  subcat_id;
  constructor(
    private route: ActivatedRoute,
    private ManufacturerService :ManufacturerService
    

  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.cat_id = params['cat_id'];
      this.subcat_id = params['subcat_id'];
      console.log(params)
    });

    this.ManufacturerService.getsubsubcategory_list(this.cat_id,this.subcat_id).toPromise()
    .then(response =>{
      this.subsubcategories = response
      console.log(this.subsubcategories)
    })
  }
  
  getSubSubCat(cat,subcat){

    console.log(cat,subcat)


  }


  }


