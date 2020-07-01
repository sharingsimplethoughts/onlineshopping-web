import { Component, OnInit } from '@angular/core';
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service'
import { Router, ActivatedRoute } from '@angular/router';
import { LoginAuthService } from '../../services/authentication/loginauth.service'

declare var $:any;
declare var swal:any;
@Component({
  selector: 'app-designer-detail',
  templateUrl: './designer-detail.component.html',
  styleUrls: ['./designer-detail.component.css']
})
export class DesignerDetailComponent implements OnInit {
  designer;
  id;
  

  view_product;
  stars;
  non_stars;
  collections;

  constructor(
    private StylistDesignerService :StylistDesignerService,
    private route: ActivatedRoute,
    private router:Router,
    private LoginAuthService:LoginAuthService


  ) { }

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;


    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.StylistDesignerService.getdesigner_detail(this.id).toPromise()
    .then(response => {
      this.collections = response['designer'].collections
      this.designer = response['designer']
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
    
      },0)

    })
    

  }
  showAllProduct(){
    this.router.navigate(['/product-list/', this.id]);

      
  }


  view_product_detail(event){
    
    var id = event.currentTarget.id;
   
    this.StylistDesignerService.getproduct_detail(this.designer.id,id).toPromise()
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
      this.StylistDesignerService.remove_from_wishlist( product_id).subscribe(responase =>{
        swal("", "Successfully removed from wishlist", "success");
        
        this.StylistDesignerService.getdesigner_detail(this.id).toPromise()
        .then(response => {
          this.collections = response['designer'].collections
        });
        
  
      }),error=>{
        
        swal("Sorry!", "Something went wrong.", "error");

      }

    }else{

      this.StylistDesignerService.add_to_wishlist({
        product:product_id,
      } 
        ).subscribe(responase =>{
          swal("", "Successfully added in wishlist", "success");

          this.StylistDesignerService.getdesigner_detail(this.id).toPromise()
          .then(response => {
            this.collections = response['designer'].collections
          });

       
  
      }),error=>{
        
        swal("Sorry!", "Something went wrong.", "error");
        
      }

    }

  }else{

    swal("Login Required", "Please login to add products in your wishlist", "info");

  }

}

startChat(){
    localStorage.setItem('chatid',this.designer.user)
    localStorage.setItem('egg_role','3')
    this.router.navigate(['/i-chat']);
}


}
