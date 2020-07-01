import { Component, OnInit } from '@angular/core';
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service'
import { Router, ActivatedRoute } from '@angular/router';
import { LoginAuthService } from '../../services/authentication/loginauth.service'

declare var $:any;
declare var swal:any;

@Component({
  selector: 'app-stylist-detail',
  templateUrl: './stylist-detail.component.html',
  styleUrls: ['./stylist-detail.component.css']
})
export class StylistDetailComponent implements OnInit {
  stylist;
  id;

  view_product;
  stars;
  non_stars;
  collections;

  constructor(
    private StylistDesignerService :StylistDesignerService,
    private route: ActivatedRoute,
    private router:Router,
    private LoginAuthService :LoginAuthService

  ) { 


  }

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    // $('a, button').on('click', function(){
    //   $('html, body').animate({
    //     scrollTop: 0
    //   }, 500);
    // });


    $("[data-background]").each(function () {
      $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
    });

    // mainSlider
    function mainSlider() {
      var BasicSlider = $('.slider-active');
      BasicSlider.on('init', function (e, slick) {
        var $firstAnimatingElements = $('.single-slider:first-child').find('[data-animation]');
        doAnimations($firstAnimatingElements);
      });
      BasicSlider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
        var $animatingElements = $('.single-slider[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
        doAnimations($animatingElements);
      });
      BasicSlider.slick({
        autoplay: true,
        autoplaySpeed: 10000,
        dots: true,
        fade: true,
        arrows: false,
        responsive: [
          { breakpoint: 767, settings: { dots: false, arrows: false } }
        ]
      });

      function doAnimations(elements) {
        var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        elements.each(function () {
          var $this = $(this);
          var $animationDelay = $this.data('delay');
          var $animationType = 'animated ' + $this.data('animation');
          $this.css({
            'animation-delay': $animationDelay,
            '-webkit-animation-delay': $animationDelay
          });
          $this.addClass($animationType).one(animationEndEvents, function () {
            $this.removeClass($animationType);
          });
        });
      }
    }
    mainSlider();

    ////////////////

    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.StylistDesignerService.getstylist_detail(this.id).toPromise()
    .then(response => {
      console.log(response['stylist'])
      this.stylist = response['stylist']
      this.collections = this.stylist.collections
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
    
      },100)

    })


  }
  showAllProduct(){
    this.router.navigate(['/product-list/', this.id]);

      
  }


  view_product_detail(event){
    
    var id = event.currentTarget.id;
   
    this.StylistDesignerService.getproduct_detail(this.stylist.id, id).toPromise()
    .then(response => {
     
      this.view_product = response['product_detail'];
      this.stars = new Array(Math.round(response['product_detail'].avg_rating))
      this.non_stars = new Array(5 - Math.round(response['product_detail'].avg_rating))
      $("#productModal").modal("show");

  }).catch(err => {
    swal("Sorry!", "Something went wrong.", "error");

  }
      
    )
  }

  addToWishlist(product_id,status){
    var product_id = product_id
    if (this.LoginAuthService.isLoggednIn()){
      
      if (status){
        this.StylistDesignerService.remove_from_wishlist( product_id).subscribe(responase =>{
          swal("", "Successfully removed from wishlist", "success");
          this.StylistDesignerService.getstylist_detail(this.id).toPromise()
          .then(response => {
            
            
            
            this.collections = response['stylist'].collections
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

            this.StylistDesignerService.getstylist_detail(this.id).toPromise()
            .then(response => {
             
              this.collections = response['stylist'].collections
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
    localStorage.setItem('chatid',this.stylist.user)
    localStorage.setItem('egg_role','2')
    this.router.navigate(['/i-chat']);
  }


}
