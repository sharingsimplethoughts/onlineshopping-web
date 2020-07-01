import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service'
import { LoginAuthService } from '../../services/authentication/loginauth.service'

declare var $:any;
declare var swal:any;

// import {LoaderService } from '../../comman/loader/loader.service'

@Component({
  selector: 'app-product-detail-by-colour',
  templateUrl: './product-detail-by-colour.component.html',
  styleUrls: ['./product-detail-by-colour.component.css']
})
export class ProductDetailByColourComponent implements OnInit {
  product;
  product_id;
  colour_id;
  view_product;
  view_profile
  id;
  profile_id;
  action;
  profile;
  best_selling;
  stars;
  non_stars;
  product_stars;
  product_non_stars;
  colour_and_images;
  is_in_wishlist;
  selected_size;

  constructor(
    private StylistDesignerService :StylistDesignerService,
    private route: ActivatedRoute,
    private router:Router,
    private LoginAuthService :LoginAuthService

  ) { 

    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
   }
  }
  ngOnInit() {

    this.route.params.subscribe(params => {

      // document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.profile_id = params['profile_id'];
      this.product_id = params['product_id'];
      this.colour_id = params['colour_id'];

      this.StylistDesignerService.getproduct_detail_bycolour(this.profile_id, this.product_id ,this.colour_id).toPromise()
      .then(response => {
        this.product = response['product_detail'];
        this.is_in_wishlist = this.product.isInwishlist 
        this.colour_and_images = response['product_detail']['colour_and_images'];
        this.profile = response['profile_data'];
        this.best_selling = response['best_selling'];
        this.product_stars = new Array(Math.round(response['product_detail'].avg_rating))
        this.product_non_stars = new Array(5 - Math.round(response['product_detail'].avg_rating))

        console.log(this.best_selling.length)
        console.log(this.best_selling)
        setTimeout(function(){

          $(".product-curosel").owlCarousel({

            autoPlay: true,
            loop: true,
            slideSpeed:3000,
            pagination:false,
            navigation:true,
            items : 4,
            // /* transitionStyle : "fade", */    /* [This code for animation ] */
            navigationText:["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
            itemsDesktop : [1199,4],
            itemsDesktopSmall : [980,3],
            itemsTablet: [767,1],
            itemsMobile : [479,1],
          });
        },100);
   
        $('.zoomSlide').imagesLoaded( function() {
          $("#exzoom").exzoom({
                autoPlay: false,
            });
          $("#exzoom").removeClass('hid_den');
          setTimeout(function(){
            $('.exzoom_nav_inner').find('span').removeClass('current') 
            $('.exzoom_nav_inner').find('span:first').addClass('current')
            let img_url = $('.exzoom_img_ul').find('li:first img').attr('src')
            $('.exzoom_preview_img').attr('src' ,img_url);
  
          },1000)

        });
        // $('.exzoom_nav_inner').find('span').removeClass('current') 
        // $('.exzoom_nav_inner').find('span:first').addClass('current')
        // let img_url = $('.exzoom_img_ul').find('li:first img').attr('src')
        // $('.exzoom_preview_img').attr('src' ,img_url);
      });


    });

  }

  view_product_detail(event){
    // this.LoaderService.show()
    var id = event.currentTarget.id;
   
    console.log(id)

    this.StylistDesignerService.getproduct_detail(this.profile_id,id).toPromise()
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

// add to wishlist 

addToWishlist(product_id,status){
   
  var product_id = product_id
  if (this.LoginAuthService.isLoggednIn()){
    
    if (status){
      this.StylistDesignerService.remove_from_wishlist( product_id).subscribe(response =>{
        localStorage.setItem('wishlistCount',response['total_wishlist_count']);
        // swal("", "Successfully removed from wishlist", "success"); 
        swal({title: "", text: "Item removed from wishlist.", type: "success"},
            function(){
                location.reload();
            }
          );
        this.is_in_wishlist=false
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
          swal({title: "", text: "Item added to wishlist.", type: "success"},
              function(){
                  location.reload();
              }
            );
          this.is_in_wishlist = true
      }),error=>{
        
        swal("Sorry!", "Something went wrong.", "error");
        
      }

    }

  }else{

    swal("Login Required", "Please Login for wishlisting a product", "info");

  }

}



// add to wish list for best-selling


addToWishlist_bestselling(product_id,event){
  var status = $('#'+event.currentTarget.id).attr('name');
  var product_id = product_id
  var current_id = event.currentTarget.id;

  
  console.log('#'+event.currentTarget.id);
  // console.log();
  
  if (this.LoginAuthService.isLoggednIn()){
    
    if (status=="true"){
      
      this.StylistDesignerService.remove_from_wishlist( product_id).subscribe(response =>{


        $('#'+current_id).removeClass('liked')
        $('#'+current_id).attr('name', "false" )
        swal("", "Successfully removed from wishlist", "success"); 

      }),error=>{
        
        swal("Sorry!", error.error['message'], "error");

      }

    }else{

      this.StylistDesignerService.add_to_wishlist({
        product:product_id,
      } 
        ).subscribe(responase =>{


          $('#'+current_id).addClass('liked')
          $('#'+current_id).attr('name', "true" );
          swal("", "Successfully added in wishlist", "success");


      }),error=>{
        
        swal("Sorry!", "Something went wrong.", "error");
        
      }

    }

  }else{

    swal("Login Required", "Please login to add products in your wishlist", "info");

  }

}











// add to cart 

addToCard(product_id){
 
  if (this.LoginAuthService.isLoggednIn()){
    if(this.selected_size){
      this.StylistDesignerService.add_in_cart({
        product:product_id,
        selected_colour:this.colour_and_images.id,
        selected_size:this.selected_size,
        selected_quantity:1
      }).subscribe(responase =>{
        // redirect to cart 
        // swal("", "Successfully added in cart", "success");
        // this.router.navigate(['/cart']);

        // update cart items for localstorage
        this.StylistDesignerService.get_cart_item().subscribe(response =>{
          // save in local storage for further use
          localStorage.setItem('cartCount',response['price_details']['items']);
          window.localStorage.setItem('cart_items', JSON.stringify(response['cart_items']) )
          swal("", "Successfully added in cart", "success");
          this.router.navigate(['/cart']);
        }),error=>{
          swal("Sorry!", "Something went wrong.", "error");
        }
        
    }),error=>{

      swal("Sorry!", "Something went wrong.", "error");
    };
    }else{
      swal("Select size", "Please select a size", "info")
    }
  }else{

    swal("Login Required", "Please Login to add product in cart", "info");
  }
  
}
















}

