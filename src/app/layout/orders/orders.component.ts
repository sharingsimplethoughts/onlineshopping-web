import { Component, OnInit } from '@angular/core';
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

declare var swal: any;
declare var $: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  order_status ={
    '1':'0rdered',
    '2': 'Packed',
    '3':'Shipped',
    '4':'Delivered',
    '5':'Cancelled',
    '6':'Out for delivery',
    '7':'Returned',
    '8':'Return accepted',
    '9':'Return completed and refuned',
    '10':'Exchanged',
    '11':'Pickuped and exchanged',
    '12':'Delivered and exchanged'
  }

  orders;
  baseUrl=environment.baseUrl;
  current_status;

  constructor(

    private StylistDesignerService: StylistDesignerService,
    private LoginAuthService: LoginAuthService,
    private router:Router,


  ) { }

  ngOnInit() {
    // if(!this.LoginAuthService.isLoggednIn){
    //   this.router.navigate(['/']);
    //   return false
    // }
    if(!this.LoginAuthService.getUserData()){
      swal('Please login to access chat',)
      this.router.navigate(['/login/']);
    }
    this.get_orders_list()

  }

  get_orders_list(){
    this.StylistDesignerService.get_order_list().subscribe(response=>{

      this.orders = response['history']

    },error=>{
      swal("", error.error['message'],'error')
    })
  }

}
