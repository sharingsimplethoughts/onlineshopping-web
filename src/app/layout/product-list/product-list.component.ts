import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ManufacturerService } from '../../services/manufacturer/manufacturer.service'
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service'

declare var $:any;
declare var swal:any;
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  cat_id;
  subcat_id;
  subsubcat_id;
  products;
  filters;
  first_product;
  p;

  noProduct=false;
  sort_by='-qty_sold';
  discount='';
  size='';
  min_price='';
  max_price='';
  colour='';

  category ='';
  subcategory = '';
  subsubcategory='';

  view_product;
  stars;
  non_stars;


  constructor(

    private route: ActivatedRoute,
    private ManufacturerService :ManufacturerService,
    private LoginAuthService :LoginAuthService,
    private StylistDesignerService :StylistDesignerService

  ) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.cat_id = params['cat_id'];
      this.subcat_id = params['subcat_id'];
      this.subsubcat_id = params['subsubcat_id'];
    });

    this.ManufacturerService.getproducts_list(this.cat_id,this.subcat_id,this.subsubcat_id,this.discount,this.min_price,this.max_price,this.size,this.colour,this.category,this.subcategory,this.subsubcategory,'-qty_sold').toPromise()
    .then(response=>{
      this.products = response['products']
      this.filters = response['filters']
      console.log(this.products)
      if (response['products'] != null){
      this.first_product = response['products'][0]

    }
    })
  }
  setValue(type,value,status){
    if(type=='discount'){
      this.discount = value
    }
    if(type=='size'){
      if(status==true){
        this.size = this.size + value + ','
      }else{
        let new_value = value+','
        this.size = this.size.replace(new_value, '')
      }
    }
    if(type=='price'){
      if(status==true){

        if (value == 'above-5000'){
          let price = value.split('-')
          this.min_price = price[1]
          this.max_price = '500000'
        }else{
          let price_str = value.split('-')
          this.min_price = price_str[0]
          this.max_price = price_str[1]
        }    

      }else{
        this.min_price = ''
        this.max_price = ''
      }

    }
    if(type=='colour'){
      value = value.split('-')[1]
      if(status == true){
        this.colour = this.colour + value + ',' 
      }else{
        let new_value = value+','
        this.colour = this.colour.replace(new_value, '')
      }
    }
  }

  setCategory(status, category,subcategory,subsubcategory){

    if (status==true){
      this.category = this.category + category + ','
      this.subcategory = this.subcategory + subcategory + ','
      if(subsubcategory==undefined){
        this.subsubcategory = this.subsubcategory
      }else{
        this.subsubcategory  = this.subsubcategory + subsubcategory + ','
      }

    }else{
      let new_category = category+','
      this.category = this.category.replace(new_category, '')
      let new_subcategory = subcategory+','
      this.subcategory = this.subcategory.replace(new_subcategory, '')
      let new_subsubcategory = subsubcategory+','
      this.subsubcategory = this.subsubcategory.replace(new_subsubcategory, '')

    }

  }



  async onChange($event,category,subcategory,subsubcategory) {

    
  
    if ($event.target.name=='discount'){
      
      this.setValue('discount',$event.target.id, $event.target.checked) 
    }
  
    if ($event.target.name =='size'){
      this.setValue('size',$event.target.id, $event.target.checked)     
    }

    if ($event.target.name =='price'){
      this.setValue('price',$event.target.id, $event.target.checked)
      
    }
    if ($event.target.name =='sorting'){
      this.sort_by=$event.target.value
      
    }
    if ($event.target.name =='colour'){
      this.setValue('colour',$event.target.id, $event.target.checked)
      
    }

    if ($event.target.name =='category'){
      this.setCategory($event.target.checked,category,subcategory,subsubcategory)
      console.log(category,subcategory,subsubcategory)
      
    }
    if($event.currentTarget.id=='reset-all'){

      console.log('click')

      this.discount='';
      this.size='';
      this.min_price='';
      this.max_price='';
      this.colour='';
      this.category='';
      this.subcategory='';
      this.subsubcategory='';

    }

    console.log(this.size);
    console.log(this.discount);
    console.log(this.max_price,this.min_price,this.sort_by,this.colour);

    this.route.params.subscribe(params => {
      this.ManufacturerService.getproducts_list(this.cat_id,this.subcat_id,this.subsubcat_id,this.discount,this.min_price,this.max_price,this.size,this.colour,this.category,this.subcategory,this.subsubcategory,this.sort_by).toPromise()
      .then(response => {
        console.log(response)
        this.products = response['products']
        
      })

    });
    

  }

  onReset(){
    
  }

  view_product_detail(event){
    
    var id = event.currentTarget.id;
   
    console.log(id)

    this.ManufacturerService.getProducts_details(id).toPromise()
    .then(response => {
     
      this.view_product = response['product_detail'];
      this.stars = new Array(Math.round(response['product_detail'].avg_rating))
      this.non_stars = new Array(5 - Math.round(response['product_detail'].avg_rating))
      // this.view_profile = response['profile_data'];
      console.log(this.stars, this.non_stars)
      console.log(this.view_product)
  },

    )
  }


// add in wihlist 

addToWishlist(product_id,status){
  var product_id = product_id
  if (this.LoginAuthService.isLoggednIn()){
    
    if (status){
      this.StylistDesignerService.remove_from_wishlist( product_id).subscribe(response =>{
        localStorage.setItem('wishlistCount',response['total_wishlist_count']);
        // swal("", "Successfully removed from wishlist", "success");
        
        // refresh data
        this.ManufacturerService.getproducts_list(this.cat_id,this.subcat_id,this.subsubcat_id,this.discount,this.min_price,this.max_price,this.size,this.colour,this.category,this.subcategory,this.subsubcategory,'-qty_sold').toPromise()
        .then(response=>{
          this.products = response['products']
          this.filters = response['filters']
          if (response['products'] != null){
          this.first_product = response['products'][0]

          swal({title: "", text: "Item removed from wishlist.", type: "success"},
            function(){
                location.reload();
            }
          );
    
        }
        })
        
  
      }),error=>{
        
        swal("Sorry!", "Something went wrong.", "error");

      }

    }else{

      this.StylistDesignerService.add_to_wishlist({
        product:product_id,
      } 
        ).subscribe(response =>{
          localStorage.setItem('wishlistCount',response['total_wishlist_count']);
          // swal("", "Successfully added in wishlist", "success");


          // refresh data
          this.ManufacturerService.getproducts_list(this.cat_id,this.subcat_id,this.subsubcat_id,this.discount,this.min_price,this.max_price,this.size,this.colour,this.category,this.subcategory,this.subsubcategory,'-qty_sold').toPromise()
          .then(response=>{
            this.products = response['products']
            this.filters = response['filters']
            console.log(this.products)
            if (response['products'] != null){
            this.first_product = response['products'][0]
      
            swal({title: "", text: "Item added to wishlist.", type: "success"},
              function(){
                  location.reload();
              }
            );
          }
          })

       
  
      }),error=>{
        
        swal("Sorry!", "Something went wrong.", "error");
        
      }

    }

  }else{

    swal("Login Required", "Please login to add products in your wishlist", "info");

  }

}






}
