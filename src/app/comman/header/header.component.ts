import { Component, OnInit } from '@angular/core';
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { ManufacturerService } from '../../services/manufacturer/manufacturer.service'
import { Router, ActivatedRoute } from '@angular/router';
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service'
import { CartitemsService } from '../../services/cartitems/cartitems.service'
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import { MessagingService } from '../../services/messaging/messaging.service';
import { LoginService } from '../../services/authentication/login.service';

declare var swal:any;
declare var $:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  message1;
  newmsg=false;
  profileimg;
  uid;
  uname;
  me;

  login;
  category_list;
  searchString="";
  cart_items=[];
  message;
  userName;
  cartCount;
  wishlistCount;
  constructor(
    public db: AngularFireDatabase,
    private LoginAuthService :LoginAuthService,
    private ManufacturerService :ManufacturerService,
    private router:Router,
    private StylistDesignerService :StylistDesignerService,
    private CartitemsService :CartitemsService,
    private messagingService: MessagingService,
    private LoginService: LoginService


  ) { }

  ngOnInit() {
    this.messagingService.requestPermission()
    this.messagingService.receiveMessage()
    this.message1 = this.messagingService.currentMessage

    
    // change cart item 

    this.CartitemsService.currentMessage.subscribe(message => this.message = message)


    if (window.localStorage.getItem('address')){
      $('#locate_me').html( '<i class="fa fa-map-marker"></i>&nbsp;&nbsp;'+ window.localStorage.getItem('address'))
    }


    if(this.LoginAuthService.isLoggednIn()){
      this.login = true;
      this.userName = 'Hey,'+this.LoginAuthService.getUserData().firstname;
      // this.cartCount=this.LoginAuthService.getUserData().cart_count;
      this.cartCount=localStorage.getItem('cartCount')
      this.wishlistCount=localStorage.getItem('wishlistCount')
      
      // this.wishlistCount=this.LoginAuthService.getUserData().wishlist_count;


    }else{
      this.login = false;
      this.userName = 'SIGNUP/LOGIN';
      this.cartCount='0';
      this.wishlistCount='0'
    }


    // cart items 

    var cart_items  = window.localStorage.getItem('cart_items');
    if(cart_items){

      this.cart_items = JSON.parse(cart_items)

    }else{

      if (this.LoginAuthService.isLoggednIn()){
        this.StylistDesignerService.get_cart_item().subscribe(response =>{
  
          this.cart_items = response['cart_items']
          // save in local storage for further use
          window.localStorage.setItem('cart_items', JSON.stringify(response['cart_items']) )
  
        }),error=>{
          swal("Sorry!", "Something went wrong.", "error");
        }
      }else{
        this.cart_items = []
      } 
  

    }
    
    $("body").on('scroll', function() {
      if($("body").scrollTop() >0) {
        $('#headerWrapper').addClass("stick");
      }else if($("body").scrollTop() <=0){
        $('#headerWrapper').removeClass("stick");	
      }
    });

    $( '.dropdown' ).each(function() {
      var _this = $( this );
      $( this ).find('a').on( 'click', function(e) {
        e.preventDefault();
        $( _this ).toggleClass( 'open' );
        var value = $( this ).text();
        $( _this ).find( '> ul > li > a' ).text( value );
      });
    });
    $('html').on( 'click', function(e) {
      if( $( e.target ).closest('.dropdown.open').length == 0 ) {
        $( '.dropdown' ).removeClass('open');
      }
    });

    $('.mobileBtn').on('click', function(){
      $(this).toggleClass('active');
      $('.mobile-menu-area').slideToggle();
    });

    $('.mobile-menu-area li a').on('click', function(){
      $('.mobileBtn').removeClass('active');
      $('.mobile-menu-area').slideUp();
    });

    this.profileimg = localStorage.getItem('profileimg')
  }
  logout(){
    this.getMe();
    this.LoginService.logout().toPromise()
    .then(response => {
      console.log(response)
      localStorage.clear();
      // var cookies = $cookies.getAll();
      // angular.forEach(cookies, function (v, k) {
      //     $cookies.remove(k);
      // });
      // localStorage.removeItem('itemname');
      this.LoginAuthService.logout()
      let login = 'false'
    })
    .catch(console.log);
  }

  doSearch(){
    console.log(this.searchString)
    if (this.searchString==''){
      return false;
    }
    this.router.navigate(['/product/search/', this.searchString]);

  }

//get current_location
  getCurrentLocation(){
    $('#custom_location').html('')
    window.navigator.geolocation.getCurrentPosition(data=> {
      console.log(data);
      var lat = data.coords.latitude
      var long = data.coords.longitude
      if (lat && long){

        this.ManufacturerService.get_current_geoaddress(lat,long).subscribe(data=>{
          var first_addr = data['results'][0]['address_components'][0]['long_name']
          var second_addr =data['results'][0]['address_components'][1]['long_name']
          
          var address_json = {
            'lat':lat,
            'long':long
          };
          var address_str = first_addr +' ' +second_addr;
          swal(address_str, '', "success");

          window.localStorage.setItem('address_json', JSON.stringify(address_json));
          window.localStorage.setItem('address', address_str);
          var html = '<i class="fa fa-map-marker"></i>&nbsp;&nbsp;'
          $('#locate_me').html(html + address_str)
        }),error=>{
          swal("Sorry!", "Something went wrong.", "error");
        }
      }else{

        alert('somthing went wrong')

      }
    })
    
  }

  
  handleAddressChange($event){
    console.log($event)

    var first_addr = $event['address_components'][0]['long_name']
    var second_addr =$event['address_components'][1]['long_name']
    
    // var address_json = {
    //   'lat':lat,
    //   'long':long
    // };
    var address_str = first_addr +' ' +second_addr;
    // window.localStorage.setItem('address_json', JSON.stringify(address_json));
    window.localStorage.setItem('address', address_str);
    var html = '<i class="fa fa-map-marker"></i>&nbsp;&nbsp;'
    $('#locate_me').html(html + address_str)
    swal(address_str, '', "success");

  }



  // callChat(){
  //   let user_type = localStorage.getItem('temporary_user_type')
  //   if(!user_type){
  //     swal('Please choose stylist or designer.',)
  //     // document.getElementById('sty_des').setAttribute()
  //   }
  //   else{
  //     this.router.navigate(['/chat']);
  //   }
  // }


  // getCurrentDateTime(){
  //   let d = new Date()
  //   let date = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear();
  //   let time = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
  //   let datetime = date+'('+time+')';
  //   return datetime;
  // }
  // updateMe(){
  //   let d = this.getCurrentDateTime();
  //   let uid = this.LoginAuthService.getUserData().user_id;
  //   let user_type = localStorage.getItem('temporary_user_type');
  //   let itemsRef = this.db.list('Users/'+uid+'/'+uid);
  //   var data = {
  //     user_type:user_type,
  //     last_active:d,
  //     is_online:'0'
  //   }
  //   itemsRef.update('updatable', data);
  // }

  //update my online status for chat----------
  createMe(){
    console.log('inside logout create me');
    var data = {
      id:this.uid,
      isOnline:false,
      name: this.uname,
      profilePic:this.profileimg,
      role:'1'
    }
    let itemRef = this.db.object('users/user_'+this.uid);
    itemRef.set(data);
    this.db.list("users/user_"+this.uid).valueChanges().subscribe(
      data => {
        this.me = data;
    },error=>{
      console.log(error)
    });
  }
  
  getMe(){
    console.log('inside logout get me');
    this.uid = this.LoginAuthService.getUserData().user_id;
    let fname = this.LoginAuthService.getUserData().firstname;
    let lname = this.LoginAuthService.getUserData().lastname;
    this.uname = fname + ' '+ lname
    this.db.list("users/user_"+this.uid).valueChanges().subscribe(
      data => {
        this.me = data;
    },error=>{
      console.log(error)
    });
    setTimeout(()=>{
      if(this.me.length!=0){
        this.updateMe()
      }
      else{
        this.createMe();
      }
    },1500);
  }
  updateMe(){
    console.log('inside logout update me');
    let itemsRef = this.db.list('users/');
    var data1 = {
      id:this.uid,
      isOnline:false,
      name:this.me[2],
      profilePic:this.me[3],
      role:this.me[4]
    }
    itemsRef.update('user_'+this.uid, data1);
  }


  mid;
  callpk;
  // audio
  acceptCall(){
    var call_type = +localStorage.getItem('callNotification_callType');
    this.mid = localStorage.getItem('callNotification_channelName');
    this.callpk = localStorage.getItem('callNotification_callpk');
    localStorage.setItem('mid',this.mid);
    this.message1=null;
    document.getElementById('showNotification').style.display='none';
    this.updateMessage(true)
    if(call_type==1){
      window.open('/av-chat/1/0', '_blank');
      // this.router.navigate(['/av-chat/1'])
    }
    if(call_type==2){
      window.open('/av-chat/2/0', '_blank');
      // this.router.navigate(['/av-chat/2'])
    }
  }
  rejectCall(){
    this.message1=null;
    document.getElementById('showNotification').style.display='none'
    this.updateMessage(false)
    //hit reject notification api here
  }
  updateMessage(a){
    var data;
    if(a){
      data={
        key:'CONNECTED'
      }
    }
    else{
      data={
        key:'REJECTED'
      }
    }
    
    var itemsRef = this.db.list('messages/'+this.mid);
    if(itemsRef){
      itemsRef.update(this.callpk,data);
    }
  }
  // pauseAudio(){
  //   this.audio.pause();
  // }
}
