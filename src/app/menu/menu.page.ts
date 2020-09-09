import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, RouterEvent } from  "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  activePath = '';

  pages = [
    {
      name: 'Home',
      path: '/menu/home'
    },
    {
      name: 'Locations',
      path: '/menu/locations'
    }
  ]

  constructor(private storage: Storage, private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.activePath = event.url;
    });
  }

  ngOnInit() {
    
  }

}
