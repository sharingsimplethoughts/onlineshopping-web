import { Component, OnInit } from '@angular/core';
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service'
declare var $:any;

@Component({
  selector: 'app-designer-list',
  templateUrl: './designer-list.component.html',
  styleUrls: ['./designer-list.component.css']
})
export class DesignerListComponent implements OnInit {
  designers;
  constructor(
    private StylistDesignerService :StylistDesignerService,


  ) { }

  ngOnInit() {
    localStorage.setItem('temporary_user_type','Designer')
    $('a, button').on('click', function(){
      $('html, body').animate({
        scrollTop: 0
      }, 500);
    });

    this.StylistDesignerService.getdesigner_list().toPromise()
    .then(response => {
      console.log(response['designer'])
      this.designers = response['designer']
    })

  }

}
