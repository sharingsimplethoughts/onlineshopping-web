import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service'
import * as _ from "lodash";
declare var $:any;
@Component({
  selector: 'app-style-list',
  templateUrl: './style-list.component.html',
  styleUrls: ['./style-list.component.css']
})
export class StyleListComponent implements OnInit {


  result;
  constructor(private StylistDesignerService :StylistDesignerService) { }

  ngOnInit() {
      localStorage.setItem('temporary_user_type','Stylist')
      $(".stylist_alpha").on('click', function(event) {
          if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
    
      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
            scrollTop: $(hash).offset().top - 220
      }, 500, function(){
       
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
      });
          } // End if
      });

      $('.designer_list a').on('click', function(){
        debugger;
        setTimeout(function(){
          
          $("html, body, app-root").animate({ scrollTop: 0 }, 600);
          return false;
        }, 100);
      });
 

    this.StylistDesignerService.getstylist_list().toPromise()
    .then(response => {

      const sorted = response['stylist'].sort((a, b) => a.name > b.name ? 1 : -1);

      const grouped = sorted.reduce((groups, stylist) => {
          const letter = stylist.name.charAt(0).toUpperCase();

          groups[letter] = groups[letter] || [];
          groups[letter].push(stylist);

          return groups;
      }, {});

       this.result = Object.keys(grouped).map(key => ({key, stylist: grouped[key]}));

      console.log(this.result);




    })

  }

}
