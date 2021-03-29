import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '../../api.service';
import { LoaderService } from '../../loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  user;

  constructor(private apiService: ApiService, private storage: Storage, private loaderService: LoaderService, private router: Router) { }

  ngOnInit() {
    this.loaderService.presentLoading();
    this.storage.get('user').then(user => {

      this.user = JSON.parse(user);

      this.apiService.get(`user/${encodeURIComponent(this.user.email)}`).subscribe((res) => {
        this.user = res;
        this.loaderService.dismiss();
      }, (error) => {
        console.log(error);
        this.loaderService.dismiss();
      });
    })
  }
}
