import { Component, OnInit ,ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {PaymentService} from '../../services/payment/payment.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from "ngx-stripe";

declare var $:any;
declare var swal:any;

@Component({
  selector: 'app-paymentcard',
  templateUrl: './paymentcard.component.html',
  styleUrls: ['./paymentcard.component.css']
})
export class PaymentcardComponent implements OnInit {

  @ViewChild(StripeCardComponent) card: StripeCardComponent;
 
  savedCards:any = [];

  cardOptions: ElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#8f91d9'
        }
      }
    }
  };
 

  elementsOptions: ElementsOptions = {
    locale: 'en'
    
  };
 

  stripeTest: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private route:Router,
    private stripeService: StripeService,
    private pmt:PaymentService) {}
 
  ngOnInit() {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
  this.getAllSavedCardData();
  localStorage.removeItem("cardToken")
  }

  getAllSavedCardData(){
    this.pmt.getSavedCards().subscribe((responase)=>{
      console.log(responase);
      this.savedCards = responase['data']
      // console.log(this.savedCards)
    }
    )
  }

  deleteCard(id){
    this.pmt.deleteCard(id).subscribe(response=>{
      this.savedCards = response['data']
      swal("", "Card deleted successfully", "success");

    })

  }

  saveCard() {
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card.getCard(), { name })
      .subscribe(result => {
        if (result.token) {
          this.pmt.addCard({
            source_token:result.token.id
          }).subscribe(x =>{
            // alert(Object.values(x))
            swal("", x['message'], "success");
            $('#productModal').modal('hide');
            this.getAllSavedCardData();
            this.route.navigate(['/payment-method'])
          })
          console.log(result.token.id);
        } else if (result.error) {
          
          console.log(result.error.message);
        }
      });
  }

  selectCard(sourcetoken){
    if(sourcetoken){
      console.log(sourcetoken);
      this.route.navigate(['/payment-method'])
      localStorage.setItem('cardToken', sourcetoken );
    }
  }

}