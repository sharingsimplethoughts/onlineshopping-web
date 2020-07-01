import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service'
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


declare var $:any;
declare var swal:any;


@Component({
  selector: 'app-saved-addresses',
  templateUrl: './saved-address.component.html',
  styleUrls: ['./saved-address.component.css']
})
export class SavedAddressComponent implements OnInit {

  delivery_addresses;

  addNewAddressForm;
  submitted=false;
  errormessage;
  edit_delivery_addresses;
  update=false;
  edit_address_id;


  constructor(
    private StylistDesignerService :StylistDesignerService,
    private route: ActivatedRoute,
    private router:Router,
    private LoginAuthService:LoginAuthService,
    private formBuilder: FormBuilder 



  ) { }

  ngOnInit() {

        //scroll top
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        //check login
        if (this.LoginAuthService.isLoggednIn()){
          this.StylistDesignerService.get_all_address().subscribe(response =>{
            this.delivery_addresses = response['delivery_addresses']

           
          }),error=>{
            swal("Sorry!", "Something went wrong.", "error");
          }
    
        }else{
          this.delivery_addresses = []

        }


    // add new address form handler 

    this.addNewAddressForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^(?!\s*$)[-a-zA-Z0-9_:,.\s]{1,100}$/)]],
      phonenum: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(10)]],
      country_code: ['+91', Validators.required],
      city: ['', [Validators.required, Validators.pattern(/^(?!\s*$)[-a-zA-Z0-9_:,.\s]{1,100}$/)]],
      area_street: ['', [Validators.required,Validators.pattern(/^(?!\s*$)[-a-zA-Z0-9_:,.\s]{1,100}$/)]],
      flat_building: ['', [Validators.required, Validators.pattern(/^(?!\s*$)[-a-zA-Z0-9_:,.\s]{1,100}$/)]],
      landmark: [''],
      pincode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      addr_type: ['2', [Validators.required,Validators.pattern(/^(?!\s*$)[-a-zA-Z0-9_:,.\s]{1,100}$/)]],
      state: ['', [Validators.required,Validators.pattern(/^(?!\s*$)[-a-zA-Z0-9_:,.\s]{1,100}$/)]],

      });

  }

  // reset form 
  resetForm() {
    $("#productModal").modal("show");
    this.submitted=false;
    this.update=false;
    this.edit_address_id=''
    this.addNewAddressForm.setValue({
      name: '',
      phonenum: '',
      country_code: '+91',
      city: '',
      area_street: '',
      flat_building: '',
      landmark: '',
      pincode: '',
      addr_type: '2',
      state: '',

    });
  }

  // raise form errors
  get add_address() { return this.addNewAddressForm.controls; }

  // post address
  addAddress(address_id){

    this.submitted = true;
    if (this.addNewAddressForm.invalid) { 
      return;
    }

    
    if (this.LoginAuthService.isLoggednIn()){
      
      if (this.update){

        this.StylistDesignerService.edit_address({
          name: this.addNewAddressForm.value.name,
          phonenum:this.addNewAddressForm.value.phonenum,
          city:this.addNewAddressForm.value.city,
          state:this.addNewAddressForm.value.state,
          area_street:this.addNewAddressForm.value.area_street,
          flat_building:this.addNewAddressForm.value.flat_building,
          landmark:this.addNewAddressForm.value.landmark,
          addr_type:this.addNewAddressForm.value.addr_type,
          pincode:this.addNewAddressForm.value.pincode,
          country_code:this.addNewAddressForm.value.country_code,
  
        },address_id ).subscribe(response =>{
          // close model 
  
          $("#productModal").modal("hide");
  
          swal("", response['message'], "success");
  
         // refreshing data 
         this.StylistDesignerService.get_all_address().subscribe(response =>{
          this.delivery_addresses = response['delivery_addresses']
          this.update=false;
          }),error=>{
  
              this.add_address_error(response['message']);
          }
  
        }),error=>{
          swal("Sorry!", "Something went wrong.", "error");
        }
  

      }else{

        this.StylistDesignerService.add_new_address({
          name: this.addNewAddressForm.value.name,
          phonenum:this.addNewAddressForm.value.phonenum,
          city:this.addNewAddressForm.value.city,
          state:this.addNewAddressForm.value.state,
          area_street:this.addNewAddressForm.value.area_street,
          flat_building:this.addNewAddressForm.value.flat_building,
          landmark:this.addNewAddressForm.value.landmark,
          addr_type:this.addNewAddressForm.value.addr_type,
          pincode:this.addNewAddressForm.value.pincode,
          country_code:this.addNewAddressForm.value.country_code,
  
        }).subscribe(response =>{
          // close model 
  
          $("#productModal").modal("hide");
  
          swal("", response['message'], "success");
  
         // refreshing data 
         this.StylistDesignerService.get_all_address().subscribe(response =>{
            this.delivery_addresses = response['delivery_addresses']
  
          }),error=>{
  
              this.add_address_error(error.error['message']);
          }
  
        }),error=>{
          swal("Sorry!", "Something went wrong.", "error");
        }
  


      }

    }else{
      this.delivery_addresses = []

    }
  }
  
  
  // show add address error 
  add_address_error(e) {
    console.log(e);
    
    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }


  deleteAddress(address_id){
    if (this.LoginAuthService.isLoggednIn()){
      this.StylistDesignerService.delete_an_address(address_id).subscribe(response =>{
        swal("", response['message'], "success");

        this.StylistDesignerService.get_all_address().subscribe(response =>{
          this.delivery_addresses = response['delivery_addresses']

        }),error=>{
          swal("Sorry!", "Something went wrong.", "error");
        }

      }),error=>{
        swal("Sorry!", "Something went wrong.", "error");
      }

    }else{
      this.delivery_addresses = []

    }
  }

  get_data_for_edit(address_id){
    
    this.StylistDesignerService.get_an_address(address_id).subscribe(response =>{
      this.edit_delivery_addresses = response['delivery_address']
        console.log(this.edit_delivery_addresses)
        this.submitted=false;
        this.update=true;
        this.edit_address_id=this.edit_delivery_addresses.id;
        this.addNewAddressForm.setValue({
          name: this.edit_delivery_addresses.name,
          phonenum:this.edit_delivery_addresses.phonenum,
          country_code: this.edit_delivery_addresses.country_code,
          city: this.edit_delivery_addresses.city,
          area_street: this.edit_delivery_addresses.area_street,
          flat_building: this.edit_delivery_addresses.flat_building,
          landmark: this.edit_delivery_addresses.landmark,
          pincode: this.edit_delivery_addresses.pincode,
          addr_type: this.edit_delivery_addresses.addr_type,
          state: this.edit_delivery_addresses.state,
    
        });
        $("#productModal").modal("show");

    }),error=>{

        this.add_address_error('Somthing went wrong');
    }


  }

}
