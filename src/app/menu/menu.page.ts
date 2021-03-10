import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, RouterEvent } from  "@angular/router";
import { AuthService } from '../auth/auth.service';

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
      path: '/menu/home',
      placement: 'top'
    },
    {
      name: 'Locations',
      path: '/menu/locations',
      placement: 'top'
    },
    {
      name: 'Settings',
      path: '/menu/settings',
      placement: 'bottom'
    },
    {
      name: 'Logout',
      path: '',
      placement: 'bottom'
    }
  ]

  constructor(private storage: Storage, private router: Router, private autService: AuthService) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.activePath = event.url;
    });
  }

  ngOnInit() {
    this.storage.get('tokens').then(token => {
      if(!token){
        this.router.navigateByUrl('login');
      }
    })
  }

  navigateSettings(){
    this.router.navigateByUrl('/menu/settings');
  }

  logout(){
    this.autService.logout();
    this.router.navigateByUrl('login');
  }

}
