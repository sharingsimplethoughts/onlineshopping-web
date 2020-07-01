import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service'
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { environment } from '../../../environments/environment';

declare var $:any;
declare var swal:any;

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  wishlist_items;


  constructor(
    private StylistDesignerService :StylistDesignerService,
    private route: ActivatedRoute,
    private router:Router,
    private LoginAuthService:LoginAuthService,

  ) { }

  ngOnInit() {

    //scroll top
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    //check login
    if (this.LoginAuthService.isLoggednIn()){
      this.StylistDesignerService.get_wishlist_item().subscribe(response =>{
        this.wishlist_items = response['response']
 
      }),error=>{
        swal("Sorry!", "Something went wrong.", "error");
      }

    }else{
      this.wishlist_items = []

    }


  }

  removeFromWishlist(wishlist_id){

    if (this.LoginAuthService.isLoggednIn()){

      this.StylistDesignerService.remove_from_wishlist(wishlist_id).subscribe(responase =>{
        swal("", responase['message'], "success");

        this.StylistDesignerService.get_wishlist_item().subscribe(response =>{
          this.wishlist_items = response['response']
          localStorage.setItem('wishlistCount',response['total_wishlist_count']);
          console.log(response['total_wishlist_count'])
          swal({title:"", text: "Item removed from wishlist.", type: "success"},
            function(){
                location.reload();
            }
          );

        }),error=>{
          swal("Sorry!", "Something went wrong.", "error");
        }

      }),error=>{
        
        swal("Sorry!", "Something went wrong.", "error");
      } 

    }else{
      swal("Login Required", "Login required for this action", "info");
    }
    
  
  }

  }

