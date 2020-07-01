import { Component, OnInit ,ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {PaymentService} from '../../services/payment/payment.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from "ngx-stripe";

declare var $:any;
declare var swal:any;


@Component({
  selector: 'app-saved-cards',
  templateUrl: './saved-cards.component.html',
  styleUrls: ['./saved-cards.component.css']
})
export class SavedCardsComponent implements OnInit {
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
  errormessage;
 
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
  }

  getAllSavedCardData(){
    this.pmt.getSavedCards().subscribe((x)=>{
      console.log(x);
      this.savedCards = x['data']
      console.log(this.savedCards)
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
    var name = this.stripeTest.get('name').value;
    name=name.trim()
    if(!this.validate_stripeTest()){
      return 
    }
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
            this.route.navigate(['/saved-cards'])
          })
          console.log(result.token.id);
        } else if (result.error) {
          
          console.log(result.error.message);
        }
      });
  }

  validate_stripeTest(){
    var name = this.stripeTest.value.name;
    name=name.trim()

    if(!name || name==''){
      this.loginError("Please write your full name");
      return false;
    }
    else if(/\d/.test(name)){
      this.loginError("Full name can not contain numbers");
      return false;
    }
    else if(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(name)){
      // var regx = new RegExp(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g);
      // console.log(regx.test(name))
      this.loginError("Full name can not contain special characters")
      return false;
    } 
    else if(name.length<2 || name.length>64){
      this.loginError("Full name must contain in between 2 to 64 characters");
      return false;
    }
    return true;
  }
  loginError(e) {
    console.log(e);
    
    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }

}