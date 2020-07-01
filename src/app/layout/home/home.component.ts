import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManufacturerService } from '../../services/manufacturer/manufacturer.service'


declare var $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  manufacturer_products;
  stylist_products;
  designer_products;


  constructor(
    private route: ActivatedRoute,
    private ManufacturerService :ManufacturerService

  ) { }

  ngOnInit() {
    this.ManufacturerService.getHomeProducts_list().toPromise()
    .then(response =>{
      this.manufacturer_products = response['manufacturer_products']
      this.stylist_products = response['stylist_products']
      this.designer_products = response['designer_products']

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



  }

}
