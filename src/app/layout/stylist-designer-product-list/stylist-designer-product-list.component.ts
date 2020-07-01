import { Component, OnInit } from '@angular/core';
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service'
import { Router, ActivatedRoute } from '@angular/router';
import { LoginAuthService } from '../../services/authentication/loginauth.service'

declare var $:any;
declare var swal:any;


@Component({
  selector: 'app-stylist-designer-product-list',
  templateUrl: './stylist-designer-product-list.component.html',
  styleUrls: ['./stylist-designer-product-list.component.css']
})
export class StylistDesignerProductListComponent implements OnInit {
  products;
  id;
  profile_detail;
  backlink;
  filters;
  p;

  
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
    private StylistDesignerService :StylistDesignerService,
    private route: ActivatedRoute,
    private LoginAuthService :LoginAuthService



  ) { }

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });


    this.StylistDesignerService.getstylist_designer_product_list(this.id,this.discount,this.min_price,this.max_price,this.size,this.colour,this.category,this.subcategory,this.subsubcategory,'-qty_sold').toPromise()
    .then(response => {
      console.log(response['products'])
      this.products = response['products']
      this.filters = response['filters']
      this.profile_detail = response['profile_detail']

      if (response['profile_detail'].role=="4"){
        this.backlink ='/stylist-detail' 
      }else{
        this.backlink ='/designer-detail' 
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
      
      if(subsubcategory==undefined){
        this.category = this.category + category + ','
        this.subcategory = this.subcategory + subcategory + ','

        


        
        this.subsubcategory = this.subsubcategory
      }else{
        this.category = this.category
        this.subcategory = this.subcategory
        this.subsubcategory  = this.subsubcategory + subsubcategory + ','
      }
      

    }else{
      if(subsubcategory==undefined){
      let new_category = category+','
      this.category = this.category.replace(new_category, '')
      let new_subcategory = subcategory+','
      this.subcategory = this.subcategory.replace(new_subcategory, '')

      let subsubcat = $("#"+subcategory+'-filter input').map(function(){
        return this.id
       }).get()
      var i =0;
      for (i=0 ; i < subsubcat.length; i++){
        $("#"+ subsubcat[i]).prop('checked', false);
        var id = subsubcat[i].split('-')[0]
       
        let new_subsubcategory = id+','
        this.subsubcategory = this.subsubcategory.replace(new_subsubcategory, '')
      }
      
      }else{

      let new_subsubcategory = subsubcategory+','
      this.subsubcategory = this.subsubcategory.replace(new_subsubcategory, '')
      }
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

      $('.panel-collapse').removeClass('in')
      $('.reset_main').addClass('collapsed')
    }

    console.log(this.size);
    console.log(this.discount);
    console.log(this.max_price,this.min_price,this.sort_by,this.colour);
    console.log(this.category,this.subcategory,this.subsubcategory)

    this.route.params.subscribe(params => {
      this.StylistDesignerService.getstylist_designer_product_list(this.id,this.discount,this.min_price,this.max_price,this.size,this.colour,this.category,this.subcategory,this.subsubcategory,this.sort_by).toPromise()
      .then(response => {
        console.log(response)
        this.products = response['products']
        
      })

    });

  }

  view_product_detail(event){
    
    var id = event.currentTarget.id;
   
    console.log(id)

    this.StylistDesignerService.getproduct_detail(this.profile_detail.id,id).toPromise()
    .then(response => {
     
      this.view_product = response['product_detail'];
      this.stars = new Array(Math.round(response['product_detail'].avg_rating))
      this.non_stars = new Array(5 - Math.round(response['product_detail'].avg_rating))
      // this.view_profile = response['profile_data'];

      $("#productModal").modal("show");


  },

    )
  }



  addToWishlist(product_id,status){
    var product_id = product_id
    if (this.LoginAuthService.isLoggednIn()){
      
      if (status){
        this.StylistDesignerService.remove_from_wishlist( product_id).subscribe(responase =>{
          swal("", "Successfully removed from wishlist", "success");
          
          // refresh data
          this.StylistDesignerService.getstylist_designer_product_list(this.id,this.discount,this.min_price,this.max_price,this.size,this.colour,this.category,this.subcategory,this.subsubcategory,'-qty_sold').toPromise()
          .then(response => {
            console.log(response['products'])
            this.products = response['products']
            this.filters = response['filters']
            this.profile_detail = response['profile_detail']
      
            if (response['profile_detail'].role=="4"){
              this.backlink ='/stylist-detail' 
            }else{
              this.backlink ='/designer-detail' 
            }
            
          })
          
    
        }),error=>{
          
          swal("Sorry!", "Something went wrong.", "error");

        }

      }else{

        this.StylistDesignerService.add_to_wishlist({
          product:product_id,
        } 
          ).subscribe(responase =>{
            swal("", "Successfully added in wishlist", "success");


            // refresh data
            this.StylistDesignerService.getstylist_designer_product_list(this.id,this.discount,this.min_price,this.max_price,this.size,this.colour,this.category,this.subcategory,this.subsubcategory,'-qty_sold').toPromise()
            .then(response => {
              console.log(response['products'])
              this.products = response['products']
              this.filters = response['filters']
              this.profile_detail = response['profile_detail']
        
              if (response['profile_detail'].role=="4"){
                this.backlink ='/stylist-detail' 
              }else{
                this.backlink ='/designer-detail' 
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
